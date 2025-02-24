"use client"

import { Loader2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useGetGenerationAnalytics } from "../api/use-get-analytics"

const chartConfig = {
  Components: {
    label: "Components",
    color: "hsl(var(--chart-1))",
  },
  "JS Frameworks": {
    label: "JS Frameworks",
    color: "hsl(var(--chart-2))",
  },
  "CSS Frameworks": {
    label: "CSS Frameworks",
    color: "hsl(var(--chart-3))",
  },
  Themes: {
    label: "Themes",
    color: "hsl(var(--chart-4))",
  },
  Layouts: {
    label: "Layouts",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function GenerationBarChart() {
  const { data, isLoading } = useGetGenerationAnalytics();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-5" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">Failed to load data</p>
      </div>
    );
  }

  const formatChartData = (category: Record<string, number>, label: string) => {
    return Object.entries(category || {}).map(([key, value]) => ({
      name: `${label}: ${key}`,
      value,
    }));
  };

  const chartData = [
    ...formatChartData(data.jsFramework, "JS Framework"),
    ...formatChartData(data.cssFramework, "CSS Framework"),
    ...formatChartData(data.theme, "Theme"),
    ...formatChartData(data.layout, "Layout"),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Framework & Layout Analytics</CardTitle>
        <CardDescription>Usage breakdown of frameworks, themes, and layouts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={8}>
              <LabelList
                dataKey="value"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total usage for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
