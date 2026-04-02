"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { hour: "00:00", completions: 5 },
  { hour: "01:00", completions: 50 },
  { hour: "02:00", completions: 200 },
  { hour: "03:00", completions: 175 },
  { hour: "04:00", completions: 165 },
  { hour: "05:00", completions: 185 },
  { hour: "06:00", completions: 170 },
  { hour: "07:00", completions: 135 },
  { hour: "08:00", completions: 155 },
  { hour: "09:00", completions: 170 },
  { hour: "10:00", completions: 185 },
  { hour: "11:00", completions: 175 },
  { hour: "12:00", completions: 135 },
  { hour: "13:00", completions: 155 },
  { hour: "14:00", completions: 120 },
  { hour: "15:00", completions: 60 },
  { hour: "16:00", completions: 10 },
  { hour: "17:00", completions: 3 },
  { hour: "18:00", completions: 2 },
  { hour: "19:00", completions: 2 },
  { hour: "20:00", completions: 2 },
  { hour: "21:00", completions: 2 },
  { hour: "22:00", completions: 2 },
  { hour: "23:00", completions: 2 },
]

const chartConfig = {
  completions: {
    label: "Completions",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function IntakeFormChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[180px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="hour"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="completions"
          fill="var(--color-completions)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
