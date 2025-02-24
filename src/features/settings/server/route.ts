import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { DATABASES_ID, PREFERENCES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono().patch(
  "/update-preferences",
  sessionMiddleware,
  zValidator(
    "json",
    z.object({
      default_jsFramework: z.string(),
      default_cssFramework: z.string(),
      default_layout: z.string(),
      default_theme: z.string(),
      default_radius: z.string(),
      default_shadow: z.string(),
    })
  ),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const preferences = c.req.valid("json");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.updateDocument(
      DATABASES_ID,
      PREFERENCES_ID,
      user.$id,
      {
        ...preferences,
      }
    );

    return c.json({ message: "Preferences updated successfully" });
  }
);

export default app;
