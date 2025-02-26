import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASES_ID, PREFERENCES_ID, PROFILES_ID } from "@/config";

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

    const userId = user.$id;

    const profile = await databases.getDocument(
      DATABASES_ID,
      PROFILES_ID,
      userId
    );

    const isFreePlan = profile.plan === "free";
    const isRestrictedFramework = preferences.default_jsFramework !== "react";
    const isRestrictedTheme = preferences.default_theme !== "earthy";

    if (isFreePlan && (isRestrictedFramework || isRestrictedTheme)) {
      return c.json({ error: "Your plan does not support this feature" }, 403);
    }

    await databases.updateDocument(DATABASES_ID, PREFERENCES_ID, user.$id, {
      ...preferences,
    });

    return c.json({ message: "Preferences updated successfully" });
  }
);

export default app;
