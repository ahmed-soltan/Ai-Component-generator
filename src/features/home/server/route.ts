import { DATABASES_ID, PLANS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";

const app = new Hono().get("/", sessionMiddleware, async (c) => {
  const databases = c.get("databases");

  const plans = await databases.listDocuments(DATABASES_ID, PLANS_ID);

  return c.json({ data: plans });
});

export default app;
