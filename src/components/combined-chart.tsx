"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SlidersHorizontalIcon } from "lucide-react"

const allCharts = [
  {
    id: "completion",
    label: "Completion Metrics",
    data: [
      { key: "Approved By Doc", value: 3.03 },
      { key: "Waiting Nurse", value: 3.9 },
      { key: "Waiting Doctor", value: 0.86 },
      { key: "Incomplete Intakes", value: 15.32 },
    ],
    type: "bar" as const,
    yDomain: undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    labelFormatter: (v: any) => `${v} %`,
  },
  {
    id: "intake",
    label: "Intake Form Completion",
    data: [
      { key: "00:00", value: 5 }, { key: "01:00", value: 50 }, { key: "02:00", value: 200 },
      { key: "03:00", value: 175 }, { key: "04:00", value: 165 }, { key: "05:00", value: 185 },
      { key: "06:00", value: 170 }, { key: "07:00", value: 135 }, { key: "08:00", value: 155 },
      { key: "09:00", value: 170 }, { key: "10:00", value: 185 }, { key: "11:00", value: 175 },
      { key: "12:00", value: 135 }, { key: "13:00", value: 155 }, { key: "14:00", value: 120 },
      { key: "15:00", value: 60 }, { key: "16:00", value: 10 }, { key: "17:00", value: 3 },
      { key: "18:00", value: 2 }, { key: "19:00", value: 2 }, { key: "20:00", value: 2 },
      { key: "21:00", value: 2 }, { key: "22:00", value: 2 }, { key: "23:00", value: 2 },
    ],
    type: "bar" as const,
  },
  {
    id: "prescriptions",
    label: "Prescription Completion",
    data: [
      { key: "Approved", value: 169 }, { key: "Pending", value: 48 },
      { key: "Denied", value: 12 }, { key: "On Hold", value: 9 },
    ],
    type: "bar" as const,
  },
  {
    id: "orders-trend",
    label: "Orders Trend",
    data: [
      { key: "Mon", value: 120 }, { key: "Tue", value: 150 }, { key: "Wed", value: 180 },
      { key: "Thu", value: 140 }, { key: "Fri", value: 200 }, { key: "Sat", value: 90 },
      { key: "Sun", value: 60 },
    ],
    type: "line" as const,
  },
  {
    id: "cancellations",
    label: "Cancellations",
    data: [
      { key: "Mon", value: 8 }, { key: "Tue", value: 12 }, { key: "Wed", value: 6 },
      { key: "Thu", value: 15 }, { key: "Fri", value: 10 }, { key: "Sat", value: 4 },
      { key: "Sun", value: 3 },
    ],
    type: "line" as const,
  },
]

const defaultVisible = ["completion", "intake"]

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function CombinedChart() {
  const [visibleCharts, setVisibleCharts] = React.useState<string[]>(defaultVisible)

  const toggle = (id: string) => {
    setVisibleCharts((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev
        return prev.filter((c) => c !== id)
      }
      return [...prev, id]
    })
  }

  const charts = allCharts.filter((c) => visibleCharts.includes(c.id))
  const activeTab = charts[0]?.id ?? "completion"

  return (
    <Tabs defaultValue={activeTab} className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <TabsList>
          {charts.map((chart) => (
            <TabsTrigger key={chart.id} value={chart.id}>
              {chart.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 text-xs" />}>
            <SlidersHorizontalIcon className="mr-1.5 size-3.5" />
            Customize
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Visible charts</DropdownMenuLabel>
              {allCharts.map((chart) => (
                <DropdownMenuCheckboxItem
                  key={chart.id}
                  className="text-xs"
                  checked={visibleCharts.includes(chart.id)}
                  onCheckedChange={() => toggle(chart.id)}
                >
                  {chart.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {charts.map((chart) => (
        <TabsContent key={chart.id} value={chart.id}>
          <ChartContainer config={chartConfig} className="!aspect-auto h-[140px] w-full">
            {chart.type === "line" ? (
              <LineChart data={chart.data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="key" tickLine={false} tickMargin={10} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chart.data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="key" tickLine={false} tickMargin={10} axisLine={false} fontSize={12} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  domain={chart.yDomain}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  radius={[4, 4, 0, 0]}
                  label={chart.labelFormatter ? { position: "top", fontSize: 12, formatter: chart.labelFormatter } : undefined}
                />
              </BarChart>
            )}
          </ChartContainer>
        </TabsContent>
      ))}
    </Tabs>
  )
}
