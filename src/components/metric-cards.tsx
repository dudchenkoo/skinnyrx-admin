"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const allMetrics = [
  { id: "approved_cc", label: "Approved CC Orders", value: 5586, percent: null, status: "default" as const },
  { id: "sub_on_hold", label: "Subscription on hold", value: 203, percent: "3.63%", status: "warning" as const },
  { id: "approved_doc", label: "Approved By Doctor", value: 169, percent: "3.03%", status: "default" as const },
  { id: "waiting_nurse", label: "Waiting Nurse Approval", value: 218, percent: "3.90%", status: "warning" as const },
  { id: "waiting_doc", label: "Waiting Doctor Approval", value: 48, percent: "0.86%", status: "warning" as const },
  { id: "on_hold", label: "On hold", value: 9, percent: "0.16%", status: "default" as const },
  { id: "incomplete", label: "Intake Incomplete Orders", value: 856, percent: "15.32%", status: "destructive" as const },
  { id: "cancel_refund", label: "Cancel/Refund", value: 451, percent: "8.07%", status: "destructive" as const },
  { id: "new_intakes", label: "New Completed Intakes", value: 218, percent: "3.90%", status: "default" as const },
  { id: "new_prescriptions", label: "New Completed Prescriptions", value: 169, percent: "3.03%", status: "default" as const },
]

const defaultSlots = [
  "approved_cc",
  "sub_on_hold",
  "approved_doc",
  "waiting_nurse",
  "incomplete",
  "cancel_refund",
]

const percentColor = {
  default: "text-muted-foreground",
  warning: "text-amber-600 font-medium",
  destructive: "text-red-500 font-medium",
}

export function MetricCards() {
  const [slots, setSlots] = React.useState(defaultSlots)

  const updateSlot = (index: number, metricId: string) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = metricId
      return next
    })
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {slots.map((slotId, index) => {
        const metric = allMetrics.find((m) => m.id === slotId)!
        return (
          <div
            key={index}
            className="rounded-lg border bg-card p-3 space-y-1"
          >
            <Select
              value={slotId}
              onValueChange={(v) => v && updateSlot(index, v)}
            >
              <SelectTrigger className="h-auto border-0 p-0 shadow-none text-xs text-muted-foreground font-medium [&>svg]:size-3 [&>svg]:text-muted-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[220px]">
                {allMetrics.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-2xl font-bold tracking-tight">{metric.value.toLocaleString()}</p>
            {metric.percent && (
              <p className={`text-[11px] ${percentColor[metric.status]}`}>
                {metric.percent} of total
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
