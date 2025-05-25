"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetPerformanceMetrics } from "../api/use-get-performance-metrics";
import { PremiumCard } from "@/components/premium-card";

const chartConfig = {
  responseTime: {
    label: "Response Time (ms)",
    color: "hsl(var(--chart-1))",
  },
  status: {
    label: "Success (1) / Failed (0)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const PerformanceBarChart = () => {
  const { data, isLoading, error } = useGetPerformanceMetrics();

  if (isLoading) return <div>Loading performance data...</div>;
  if (error || !data) return <div>Error loading performance data.</div>;

  const displayCount = 10;

  const recentData = data.responseTimes.slice(-displayCount);

  const chartData = recentData.map((item, index) => ({
    time: `#${index + 1}`, 
    responseTime: item.responseTime, 
    status: item.status === "success" ? 1 : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Response Times & Success Rate</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} width={600} height={300}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickLine={false} tickMargin={10} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar
              dataKey="responseTime"
              fill={chartConfig.responseTime.color}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="status"
              fill={chartConfig.status.color}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Avg Response Time: {data.averageResponseTime}ms{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total: {data.totalRequests} | Failed: {data.failedRequests} | Min:{" "}
          {data.minResponseTime}ms | Max: {data.maxResponseTime}ms
        </div>
      </CardFooter>
    </Card>
  );
};
