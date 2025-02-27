import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { Mistral } from "@mistralai/mistralai";
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

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

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
        userId
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
          403
        );
      }

      const requests = await databases.listDocuments(
        DATABASES_ID,
        PERFORMANCE_ID,
        [Query.equal("userId", userId)]
      );

      if (requests.total >= freePlanRequestsLimit && isFreePlan) {
        return c.json(
          { error: "You have reached your free plan requests limit" },
          403
        );
      }

      if (requests.total >= proPlanRequestsLimit && isProPlan) {
        return c.json(
          { error: "You have reached your pro plan requests limit" },
          403
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

      try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
          return c.json({ error: "Missing Gemini API key" }, 500);
        }

        const startTime = Date.now();

        const chatResponse = await client.chat.complete({
          model: "mistral-large-latest",
          messages: [{ role: "user", content: detailedPrompt }],
        });

        const endTime = Date.now();

        const responseTime = endTime - startTime;

        if (
          !chatResponse?.choices ||
          !chatResponse?.choices[0]?.message.content ||
          chatResponse?.choices[0]?.message.content.length === 0
        ) {
          await databases.createDocument(
            DATABASES_ID,
            PERFORMANCE_ID,
            ID.unique(),
            {
              userId: user.$id,
              responseTime,
              status: "failed",
            }
          );
          return c.json({ error: "Failed to generate component" }, 500);
        }

        await databases.createDocument(
          DATABASES_ID,
          PERFORMANCE_ID,
          ID.unique(),
          {
            userId: user.$id,
            responseTime,
            status: "success",
          }
        );

        return c.json({ component: chatResponse.choices[0].message.content });
      } catch (error) {
        console.error("Gemini API Error:", error);
        return c.json({ error: "Failed to generate UI component" }, 500);
      }
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
        user.$id
      );

      const isFreePlan = profile.plan === "free";
      const isProPlan = profile.plan === "pro";

      const components = await databases.listDocuments(
        DATABASES_ID,
        COMPONENTS_ID,
        [Query.equal("userId", user.$id)]
      );

      if (isFreePlan && components.total >= 10) {
        return c.json(
          { error: "Your free plan allows for a maximum of 5 components" },
          403
        );
      } else if (!isProPlan && components.total >= 50) {
        return c.json(
          { error: "Your pro plan allows for a maximum of 10 components" },
          403
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
          code,
        }
      );

      return c.json({ data: savedComponent });
    }
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
      })
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
        query
      );

      return c.json({
        data: {
          ...components,
          nextCursor: components.documents.length
            ? components.documents[components.documents.length - 1].$id
            : null,
        },
      });
    }
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
      componentId
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
          code,
        }
      );

      return c.json({ data: savedComponent });
    }
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
