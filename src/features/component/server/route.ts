import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { Mistral } from "@mistralai/mistralai";
import { zValidator } from "@hono/zod-validator";

import { COMPONENTS_ID, DATABASES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createComponentSchema, saveComponentSchema, themes } from "../schema";


const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

const app = new Hono()
  .post(
    "/generate-ui",
    zValidator("json", createComponentSchema),
    async (c) => {
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

      if (!prompt) {
        return c.json({ error: "Prompt is required" }, 400);
      }

      // Construct the detailed prompt for AI
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
      \\\` \`\`\`jsx  \`\`\`html  \`\`\`typescript
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

        const chatResponse = await client.chat.complete({
          model: "mistral-large-latest",
          messages: [{ role: "user", content: detailedPrompt }],
        });

        if (
          !chatResponse?.choices ||
          !chatResponse?.choices[0]?.message.content ||
          chatResponse?.choices[0]?.message.content.length === 0
        ) {
          return c.json({ error: "Failed to generate component" }, 500);
        }

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

      const { name, jsFramework, cssFramework, layout, theme, prompt, radius, shadow , code } =
        c.req.valid("json");

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
          code
        }
      );

      return c.json({ data: savedComponent });
    }


  )
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projects = await databases.listDocuments(
      DATABASES_ID,
      COMPONENTS_ID,
      [Query.equal("userId", user.$id)]
    );

    return c.json({ data: projects });
  })
  .get("/:componentId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { componentId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await databases.getDocument(
      DATABASES_ID,
      COMPONENTS_ID,
      componentId
    );

    return c.json({ data: project });
  });

export default app;
