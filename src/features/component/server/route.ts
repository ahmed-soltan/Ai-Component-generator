import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

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

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-flash",
  temperature: 0.7,
  streaming: true,
});

const app = new Hono()
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

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!prompt) {
        return c.json({ error: "Prompt is required" }, 400);
      }

      const userId = user.$id;

      const profile = await databases.getDocument(
        DATABASES_ID,
        PROFILES_ID,
        userId,
      );

      const isFreePlan = profile.plan === "free";
      const isProPlan = profile.plan === "pro";

      const freePlanRequestsLimit = 500;
      const proPlanRequestsLimit = 1000;

      const isRestrictedFramework = jsFramework !== "react";
      const isRestrictedTheme = theme !== "earthy";

      if (isFreePlan && (isRestrictedFramework || isRestrictedTheme)) {
        return c.json(
          { error: "Your plan does not support this feature" },
          403,
        );
      }

      const requests = await databases.listDocuments(
        DATABASES_ID,
        PERFORMANCE_ID,
        [Query.equal("userId", userId)],
      );

      if (requests.total >= freePlanRequestsLimit && isFreePlan) {
        return c.json(
          { error: "You have reached your free plan requests limit" },
          403,
        );
      }

      if (requests.total >= proPlanRequestsLimit && isProPlan) {
        return c.json(
          { error: "You have reached your pro plan requests limit" },
          403,
        );
      }

      const detailedPrompt = `
      Generate a ${jsFramework} UI component based on the following specifications:
      - **Component Name:** ${name}
      - **Framework:** ${jsFramework} (Use best practices)
      - **CSS Framework:** ${cssFramework} (Apply relevant classes)
      - **Layout:** ${layout} (Ensure proper structure)
      - **Theme:** ${theme} 
        - Primary: ${themes[theme]?.primary} 
        - Secondary: ${themes[theme]?.secondary}
        - Accent: ${themes[theme]?.accent} 
        - Background: ${themes[theme]?.background}
      - **Border Radius:** ${radius}
      - **Box Shadow:** ${shadow}
      - **Description:** ${prompt}
      - **previous prompt:** ${previousPrompt}
      - **current code:** ${currentCode}

      when you are applying a hex color using this syntax bg-[#FFFFFF] or text-[#FFFFFF] with the props hex color 

      don't use props make everything internal only add props if the user asked for this

      Ensure a modern, visually appealing design with the following principles:

Color Balance: Maintain a harmonious palette with primary, secondary, and accent colors that complement each other. Avoid high saturation or clashing colors.
Spacing & Padding: Keep consistent padding and margins to avoid a cluttered appearance.
Typography & Contrast: Ensure text is readable, with high contrast against the background and appropriate font sizes.
      
      ### Formatting Rules:
      ✅ **DO NOT** include \\\` \`\`\`jsx \\\` or \\\` \`\`\` \\\`.  
      ✅ Return **ONLY** the raw JSX/TSX component code.  
      ✅ Ensure the code is **clean, readable, and performance-optimized**.  
      ✅ **No props** – make everything **inline**.  
      ✅ Ensure **responsiveness, accessibility, and reusability**.  
      ✅ Avoid **extra comments or unnecessary syntax**.  

      don't use external libraries except react-icons and bootstrap components
      and don't use this css links like this bootstrap/dist/css/bootstrap.min.css

      if there are previous prompt or current code   Modify the following component based on the new instructions:

  **Previous Prompt:**
  ${previousPrompt}

  **Current Component Code:**
  ${currentCode}

      ❌ **WRONG** ❌  
      \\\` \`\`\`jsx  \`\`\`html  \`\`\`typescript \`\`\`javascript \`\`\`
      const MyComponent = () => { ... };  
      export default MyComponent;  
      \\\` \`\`\`  
      
      ✅ **CORRECT** ✅  
      const MyComponent = () => { ... };  
      export default MyComponent;  
      `;

      const startTime = Date.now();
      const encoder = new TextEncoder();
      let finished = false;

      // Create a ReadableStream with immediate heartbeat to prevent Vercel timeout
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Send initial heartbeat immediately to prevent Vercel 10s timeout
            controller.enqueue(
              encoder.encode(JSON.stringify({ type: "start" }) + "\n"),
            );

            const heartbeat = setInterval(() => {
              if (!finished) {
                controller.enqueue(
                  encoder.encode(JSON.stringify({ type: "ping" }) + "\n"),
                );
              }
            }, 1000);

            const streamResponse = await model.stream([
              new HumanMessage(detailedPrompt),
            ]);

            // 3️⃣ Stop heartbeat when AI starts responding
            finished = true;
            clearInterval(heartbeat);

            for await (const chunk of streamResponse) {
              const content =
                typeof chunk.content === "string"
                  ? chunk.content
                  : Array.isArray(chunk.content)
                    ? chunk.content
                        .map((c) => (typeof c === "string" ? c : ""))
                        .join("")
                    : "";

              if (content) {
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({ type: "chunk", content }) + "\n",
                  ),
                );
              }
            }

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // Log success after streaming completes
            await databases.createDocument(
              DATABASES_ID,
              PERFORMANCE_ID,
              ID.unique(),
              {
                userId: user.$id,
                responseTime,
                status: "success",
              },
            );

            // Send completion message
            controller.enqueue(
              encoder.encode(JSON.stringify({ type: "end" }) + "\n"),
            );
            controller.close();
          } catch (error) {
            console.error("Gemini API Streaming Error:", error);

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // Log failure
            await databases.createDocument(
              DATABASES_ID,
              PERFORMANCE_ID,
              ID.unique(),
              {
                userId: user.$id,
                responseTime,
                status: "failed",
              },
            );

            // Send error message
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: "error",
                  error: "Failed to generate UI component",
                }) + "\n",
              ),
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
    },
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
