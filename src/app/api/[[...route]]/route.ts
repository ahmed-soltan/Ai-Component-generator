import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import plans from "@/features/home/server/route";
import settings from "@/features/settings/server/route";
import component from "@/features/component/server/route";
import performance from "@/features/performance/server/route";
import subscription from "@/features/subscription/server/route";
import generation from "@/features/generation-analytics/server/route";

export const runtime = "edge";

const app = new Hono()
  .basePath("/api")
  .route("/auth", auth)
  .route("/plans", plans)
  .route("/settings", settings)
  .route("/component", component)
  .route("/generation", generation)
  .route("/performance", performance)
  .route("/subscription", subscription)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
