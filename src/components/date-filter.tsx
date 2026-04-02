"use client"

import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const presets = [
  { label: "All time", getValue: () => undefined },
  { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: "Yesterday", getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
  { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: "Current month", getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: "Last month", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
]

export function DateFilter() {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)
  const [activePreset, setActivePreset] = React.useState("All time")
  const [open, setOpen] = React.useState(false)

  const displayLabel = activePreset !== "Custom"
    ? activePreset
    : range?.from
      ? range.to
        ? `${format(range.from, "MMM d")} - ${format(range.to, "MMM d")}`
        : format(range.from, "MMM d, yyyy")
      : "Pick a date"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" size="sm" className="h-8 text-xs font-normal bg-card" />}>
        <span className="text-muted-foreground mr-1.5">Overview for</span>
        {displayLabel}
        <CalendarIcon className="ml-1.5 size-3.5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-row" align="end">
        <div className="p-2">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(newRange) => {
              setRange(newRange)
              setActivePreset("Custom")
            }}
            numberOfMonths={1}
          />
          <div className="flex justify-end px-2 pb-2">
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={() => setOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
        <div className="border-l p-2 flex flex-col gap-0.5 min-w-[140px]">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant={activePreset === preset.label ? "default" : "ghost"}
              size="sm"
              className="justify-start h-8 text-xs"
              onClick={() => {
                setActivePreset(preset.label)
                setRange(preset.getValue())
                if (preset.label === "All time") setOpen(false)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
