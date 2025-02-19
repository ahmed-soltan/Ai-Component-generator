import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import plans from "@/features/home/server/route";
import component from "@/features/component/server/route";

export const runtime = "edge";

const app = new Hono()
  .basePath("/api")
  .route("/auth", auth)
  .route("/plans", plans)
  .route("/component", component);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;