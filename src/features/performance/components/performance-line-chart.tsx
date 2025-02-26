"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineProps,
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetPerformanceMetrics } from "../api/use-get-performance-metrics";
import { useCurrent } from "@/features/auth/api/use-current";

const chartConfig = {
  responseTime: {
    label: "Response Time (ms)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const PerformanceLineChart = () => {
  const { data, isLoading, error } = useGetPerformanceMetrics();
  const { data: user, isLoading: isLoadingUser } = useCurrent();

  if (isLoading) return <div>Loading performance data...</div>;
  if (error || !data) return <div>Error loading performance data.</div>;

  // Transform responseTimes array into chart data format
  const chartData = data.responseTimes.map((item, index) => ({
    time: `#${index + 1}`, // Request index (can replace with timestamps)
    responseTime: item.responseTime, // Response time in ms
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time Metrics</CardTitle>
        <CardDescription>Track response times over requests</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer
            width="100%"
            height={200}
            className={"h-[500px]"}
          >
            <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke={chartConfig.responseTime.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Avg Response Time: {data.averageResponseTime}ms{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Min: {data.minResponseTime}ms | Max: {data.maxResponseTime}ms | Total
          Requests: {data.totalRequests}
        </div>
      </CardFooter>
    </Card>
  );
};
