import { z } from "zod";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";

import { createAdminClient } from "@/lib/appwrite";
import { loginSchema, registerSchema } from "../schemas";

import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASES_ID, PREFERENCES_ID, PROFILES_ID } from "@/config";

const app = new Hono()
  .post("/sign-in", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/sign-up", zValidator("json", registerSchema), async (c) => {
    const { email, password, username: name } = c.req.valid("json");

    const { account, databases } = await createAdminClient();

    const user = await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    await databases.createDocument(DATABASES_ID, PROFILES_ID, user.$id, {
      name,
      email,
      userId: user.$id,
    });

    await databases.createDocument(
      DATABASES_ID,
      PREFERENCES_ID,
      user.$id,
      {
        userId: user.$id,
      }
    )

    return c.json({ success: true });
  })
  .post("/sign-out", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);

    await account.deleteSession("current");

    return c.json({ success: true });
  })
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const userId = user.$id;

    const profile = await databases.getDocument(
      DATABASES_ID,
      PROFILES_ID,
      userId
    );

    const preferences = await databases.getDocument(
      DATABASES_ID,
      PREFERENCES_ID,
      userId
    )

    return c.json({ data: { ...user, profile , preferences } });
  })
  .patch(
    "/profile",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        name: z.string(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { name } = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.updateDocument(DATABASES_ID, PROFILES_ID, user.$id, {
        name,
      });

      return c.json({ data: "success" });
    }
  );

export default app;
