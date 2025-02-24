import { COMPONENTS_ID, DATABASES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { Query } from "node-appwrite";

const app = new Hono().get("/", sessionMiddleware, async (c) => {
  const user = c.get("user");
  const databases = c.get("databases");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  type AnalyticsData = {
    component_name: Record<string, number>;
    jsFramework: Record<string, number>;
    cssFramework: Record<string, number>;
    layout: Record<string, number>;
    theme: Record<string, number>;
    prompt_length: number;
    created_at: string;
  };

  const components = await databases.listDocuments(
    DATABASES_ID,
    COMPONENTS_ID,
    [Query.equal("userId", user.$id)]
  );

  const analytics: AnalyticsData = {
    component_name: {},
    jsFramework: {},
    cssFramework: {},
    layout: {},
    theme: {},
    prompt_length: 0,
    created_at: new Date().toISOString(),
  };

  components.documents.forEach((doc) => {
    analytics.component_name[doc.componentName] =
      (analytics.component_name[doc.componentName] || 0) + 1;
    analytics.jsFramework[doc.jsFramework] =
      (analytics.jsFramework[doc.jsFramework] || 0) + 1;
    analytics.cssFramework[doc.cssFramework] =
      (analytics.cssFramework[doc.cssFramework] || 0) + 1;
    analytics.layout[doc.layout] = (analytics.layout[doc.layout] || 0) + 1;
    analytics.theme[doc.theme] = (analytics.theme[doc.theme] || 0) + 1;
    analytics.prompt_length += doc.prompt;
  });

  if (components.documents.length > 0) {
    analytics.prompt_length /= components.total;
  }

  return c.json({  ...analytics, total: components.total });
});

export default app;
