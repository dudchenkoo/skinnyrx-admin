"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "Approved By Doc", value: 3.03 },
  { category: "Waiting Nurse", value: 3.9 },
  { category: "Waiting Doctor", value: 0.86 },
  { category: "Incomplete Intakes", value: 15.32 },
]

const chartConfig = {
  value: {
    label: "Percentage",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function CompletionMetricsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[4, 4, 0, 0]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label={{ position: "top", fontSize: 12, formatter: (v: any) => `${v} %` }}
        />
      </BarChart>
    </ChartContainer>
  )
}
