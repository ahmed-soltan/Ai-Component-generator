import { DATABASES_ID, PERFORMANCE_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { Query } from "node-appwrite";

const app = new Hono().get("/", sessionMiddleware, async (c) => {
  const user = c.get("user");
  const databases = c.get("databases");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const response = await databases.listDocuments(
    DATABASES_ID,
    PERFORMANCE_ID,
    [Query.equal("userId", user.$id)]
  );

  const responseTimes = response.documents.map((doc) => ({
    responseTime: doc.responseTime,
    status: doc.status, 
    timestamp: doc.timestamp,
  }));

  if (responseTimes.length === 0) {
    return c.json({
      message: "No analytics data available",
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      failureRate: 0,
      responseTimes: [],
    });
  }

  const totalRequests = responseTimes.length;
  const successfulRequests = responseTimes.filter((r) => r.status === "success").length;
  const failedRequests = totalRequests - successfulRequests;
  const failureRate = (failedRequests / totalRequests) * 100;

  const successfulResponseTimes = responseTimes
    .filter((r) => r.status === "success")
    .map((r) => r.responseTime);

  const averageResponseTime =
    successfulResponseTimes.length > 0
      ? successfulResponseTimes.reduce((a, b) => a + b, 0) / successfulResponseTimes.length
      : 0;

  const minResponseTime = successfulResponseTimes.length > 0 ? Math.min(...successfulResponseTimes) : 0;
  const maxResponseTime = successfulResponseTimes.length > 0 ? Math.max(...successfulResponseTimes) : 0;

  return c.json({
    totalRequests,
    successfulRequests,
    failedRequests,
    averageResponseTime: Math.round(averageResponseTime),
    minResponseTime,
    maxResponseTime,
    failureRate: parseFloat(failureRate.toFixed(2)),
    responseTimes, 
  });
});

export default app;
