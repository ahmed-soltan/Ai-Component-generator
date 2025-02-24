import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetPerformanceMetrics = () => {
  const query = useQuery({
    queryKey: ["performance"],
    queryFn: async () => {
      const response = await client.api.performance.$get();
      if (!response.ok) {
        return null;
      }

      const {
        averageResponseTime,
        totalRequests,
        failedRequests,
        maxResponseTime,
        successfulRequests,
        failureRate,
        minResponseTime,
        responseTimes,
      } = await response.json();

      return {
        averageResponseTime,
        totalRequests,
        failedRequests,
        maxResponseTime,
        successfulRequests,
        failureRate,
        minResponseTime,
        responseTimes,
      };
    },
  });

  return query;
};
