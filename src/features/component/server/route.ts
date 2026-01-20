import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import {
  COMPONENTS_ID,
  DATABASES_ID,
  PERFORMANCE_ID,
  PROFILES_ID,
} from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import {
  createComponentSchema,
  jsFrameworks,
  cssFrameworks,
  saveComponentSchema,
  themeKeys,
  themes,
} from "../schema";
import { ComponentType } from "../types";

/**
 * Cleans up AI-generated code by removing markdown code blocks and extra formatting
 */
function cleanupAIOutput(rawCode: string): string {
  if (!rawCode) return "";

  let code = rawCode.trim();

  // Remove opening code blocks with optional language identifier
  // Handles: ```jsx, ```tsx, ```javascript, ```typescript, ```html, ```
  code = code.replace(
    /^```(?:jsx|tsx|javascript|typescript|html|js|ts)?\s*\n?/i,
    "",
  );

  // Remove closing code blocks
  code = code.replace(/\n?```\s*$/g, "");

  // Remove any remaining triple backticks that might be in the middle
  code = code.replace(/```/g, "");

  // Normalize line endings
  code = code.replace(/\r\n/g, "\n");

  return code.trim();
}

/**
 * Extracts text content from Gemini streaming response chunks
 */
function extractTextFromGeminiChunk(chunk: any): string {
  try {
    if (chunk?.candidates?.[0]?.content?.parts) {
      return chunk.candidates[0].content.parts
        .map((part: any) => part.text || "")
        .join("");
    }
  } catch {
    // Ignore parsing errors
  }
  return "";
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_STREAMING_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

export const runtime = "edge";

export const app = new Hono()
  .post(
    "/generate-ui",
    sessionMiddleware,
    zValidator("json", createComponentSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const {
        name,
        jsFramework,
        cssFramework,
        layout,
        theme,
        prompt,
        radius,
        shadow,
        currentCode,
        previousPrompt,
      } = c.req.valid("json");

      if (!user) return c.json({ error: "Unauthorized" }, 401);
      if (!prompt) return c.json({ error: "Prompt is required" }, 400);

      const userId = user.$id;

      // --- check plan limits ---
      const profile = await databases.getDocument(DATABASES_ID, PROFILES_ID, userId);
      const isFreePlan = profile.plan === "free";
      const isProPlan = profile.plan === "pro";

      const freeLimit = 500;
      const proLimit = 1000;

      const requests = await databases.listDocuments(DATABASES_ID, PERFORMANCE_ID, [
        Query.equal("userId", userId),
      ]);

      if (isFreePlan && requests.total >= freeLimit)
        return c.json({ error: "Free plan limit reached" }, 403);
      if (isProPlan && requests.total >= proLimit)
        return c.json({ error: "Pro plan limit reached" }, 403);

      // --- construct prompt ---
      const detailedPrompt = `
Generate a ${jsFramework} UI component based on the following:

Component Name: ${name}
Framework: ${jsFramework}
CSS Framework: ${cssFramework}
Layout: ${layout}
Theme: ${theme} - Primary: ${themes[theme]?.primary} Secondary: ${themes[theme]?.secondary} Accent: ${themes[theme]?.accent} Background: ${themes[theme]?.background}
Border Radius: ${radius}
Box Shadow: ${shadow}
Description: ${prompt}
Previous Prompt: ${previousPrompt}
Current Code: ${currentCode}

Do NOT use external libraries except react-icons and bootstrap components.
Finish the component completely, close all JSX tags, and end with:
export default ${name};
DO NOT stop early.
`;

      const encoder = new TextEncoder();
      const startTime = Date.now();

      const stream = new ReadableStream({
        async start(controller) {
          let heartbeat: ReturnType<typeof setInterval> | null = null;

          try {
            // 1️⃣ send start
            controller.enqueue(encoder.encode(JSON.stringify({ type: "start" }) + "\n"));

            // 2️⃣ heartbeat every 5s
            heartbeat = setInterval(() => {
              try {
                controller.enqueue(encoder.encode(JSON.stringify({ type: "ping" }) + "\n"));
              } catch {}
            }, 5000);

            // 3️⃣ call Gemini streaming endpoint
            const geminiResponse = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: detailedPrompt }] }],
                  generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
                }),
              }
            );

            if (!geminiResponse.ok) {
              const errText = await geminiResponse.text();
              throw new Error(`Gemini API Error ${geminiResponse.status}: ${errText}`);
            }

            if (!geminiResponse.body) throw new Error("No response body from Gemini");

            // 4️⃣ SSE parsing
            const reader = geminiResponse.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });

              let newlineIndex;
              while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
                const line = buffer.slice(0, newlineIndex).trim();
                buffer = buffer.slice(newlineIndex + 1);

                if (!line.startsWith("data:")) continue;
                const jsonStr = line.slice(5).trim();
                if (!jsonStr || jsonStr === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(
                      encoder.encode(JSON.stringify({ type: "chunk", content: text }) + "\n")
                    );
                  }
                } catch {
                  // ignore malformed chunk
                }
              }
            }

            // 5️⃣ finish
            if (heartbeat) clearInterval(heartbeat);
            const responseTime = Date.now() - startTime;

            await databases.createDocument(DATABASES_ID, PERFORMANCE_ID, ID.unique(), {
              userId,
              responseTime,
              status: "success",
            });

            controller.enqueue(encoder.encode(JSON.stringify({ type: "end" }) + "\n"));
            controller.close();
          } catch (err) {
            console.error("Gemini streaming error:", err);
            if (heartbeat) clearInterval(heartbeat);

            const responseTime = Date.now() - startTime;
            try {
              await databases.createDocument(DATABASES_ID, PERFORMANCE_ID, ID.unique(), {
                userId,
                responseTime,
                status: "failed",
              });
            } catch {}

            controller.enqueue(
              encoder.encode(
                JSON.stringify({ type: "error", error: "Failed to generate UI component" }) + "\n"
              )
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  )

  .post(
    "/save-component",
    sessionMiddleware,
    zValidator("json", saveComponentSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const profile = await databases.getDocument(
        DATABASES_ID,
        PROFILES_ID,
        user.$id,
      );

      const isFreePlan = profile.plan === "free";
      const isProPlan = profile.plan === "pro";

      const components = await databases.listDocuments(
        DATABASES_ID,
        COMPONENTS_ID,
        [Query.equal("userId", user.$id)],
      );

      if (isFreePlan && components.total >= 10) {
        return c.json(
          { error: "Your free plan allows for a maximum of 5 components" },
          403,
        );
      } else if (!isProPlan && components.total >= 50) {
        return c.json(
          { error: "Your pro plan allows for a maximum of 10 components" },
          403,
        );
      }

      const {
        name,
        jsFramework,
        cssFramework,
        layout,
        theme,
        prompt,
        radius,
        shadow,
        code,
      } = c.req.valid("json");

      const cleanedCode = cleanupAIOutput(code);

      const savedComponent = await databases.createDocument(
        DATABASES_ID,
        COMPONENTS_ID,
        ID.unique(),
        {
          userId: user.$id,
          name,
          jsFramework,
          cssFramework,
          layout,
          theme,
          aiPrompt: prompt,
          radius,
          shadow,
          code: cleanedCode,
        },
      );

      return c.json({ data: savedComponent });
    },
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        jsFramework: z.enum(jsFrameworks).nullish(),
        cssFramework: z.enum(cssFrameworks).nullish(),
        theme: z.enum(themeKeys).nullish(),
        search: z.string().optional().nullish(),
        cursor: z.string().optional().nullish(),
        limit: z.string().nullish(),
      }),
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { jsFramework, cssFramework, theme, search, limit, cursor } =
        c.req.valid("query");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [Query.equal("userId", user.$id)];

      if (jsFramework) {
        query.push(Query.equal("jsFramework", jsFramework));
      }

      if (cssFramework) {
        query.push(Query.equal("cssFramework", cssFramework));
      }

      if (theme) {
        query.push(Query.equal("theme", theme));
      }

      if (search) {
        query.push(Query.search("name", search));
      }

      query.push(Query.limit(parseInt(limit!)));

      if (cursor) {
        query.push(Query.cursorAfter(cursor));
      }

      const components = await databases.listDocuments(
        DATABASES_ID,
        COMPONENTS_ID,
        [...query, Query.orderDesc("$createdAt")],
      );

      return c.json({
        data: {
          ...components,
          nextCursor: components.documents.length
            ? components.documents[components.documents.length - 1].$id
            : null,
        },
      });
    },
  )
  .get("/:componentId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { componentId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const component = await databases.getDocument<ComponentType>(
      DATABASES_ID,
      COMPONENTS_ID,
      componentId,
    );

    return c.json({ data: component });
  })
  .patch(
    "/update-component/:componentId",
    sessionMiddleware,
    zValidator("json", saveComponentSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { componentId } = c.req.param();

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const {
        name,
        jsFramework,
        cssFramework,
        layout,
        theme,
        prompt,
        radius,
        shadow,
        code,
      } = c.req.valid("json");

      const cleanedCode = cleanupAIOutput(code);

      const savedComponent = await databases.updateDocument(
        DATABASES_ID,
        COMPONENTS_ID,
        componentId,
        {
          name,
          jsFramework,
          cssFramework,
          layout,
          theme,
          aiPrompt: prompt,
          radius,
          shadow,
          code: cleanedCode,
        },
      );

      return c.json({ data: savedComponent });
    },
  )
  .delete("/:componentId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { componentId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASES_ID, COMPONENTS_ID, componentId);

    return c.json({ message: "Component deleted successfully" });
  });

export default app;
