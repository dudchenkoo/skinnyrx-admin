"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDownIcon, ArrowRightIcon } from "lucide-react"

export type Order = {
  productName: string
  orderId: string
  patientName: string
  gender: "male" | "female"
  email: string
  state: string
  subscriptionStatus: string
  onHoldReason: string
  inOnHold: string
  fulfillmentStatus: string
  orderDate: string
  lastWeightUpdate: string
  // Extended columns from spreadsheet
  dob: string
  timeScreened: string
  ctStatus: string
  ctRemarks: string
  assignedCT: string
  month: string
  assignedProvider: string
  providerRemarks: string
  visitType: string
  called: string
  providerStatus: string
}

function SortableHeader({ column, label }: { column: any; label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDownIcon className="ml-1 size-3" />
    </Button>
  )
}

function GenderIcon({ gender }: { gender: "male" | "female" }) {
  if (gender === "female") {
    return (
      <span className="flex size-7 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-xs">
        ♀
      </span>
    )
  }
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">
      ♂
    </span>
  )
}

const statusStyles: Record<string, string> = {
  "Incomplete Intake Form": "bg-orange-100 text-orange-700 border-orange-200",
  "Subscription On Hold": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Denied Check": "bg-red-100 text-red-700 border-red-200",
  "Sent to Pharmacy": "bg-purple-100 text-purple-700 border-purple-200",
  "Completed Intake Form": "bg-green-100 text-green-700 border-green-200",
  "Charged": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Approved": "bg-green-100 text-green-700 border-green-200",
  "On hold": "bg-yellow-100 text-yellow-700 border-yellow-200",
}

const fulfillmentStyles: Record<string, string> = {
  "Shipment Pending": "bg-orange-100 text-orange-700 border-orange-200",
  "Shipped": "bg-green-100 text-green-700 border-green-200",
}

function StatusBadge({ status }: { status: string }) {
  if (!status || status === "-") return <span className="text-muted-foreground">-</span>
  const style = statusStyles[status] ?? "bg-muted text-muted-foreground"
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${style}`}>
      {status}
    </span>
  )
}

function FulfillmentBadge({ status }: { status: string }) {
  if (!status || status === "-") return <span className="text-muted-foreground">-</span>
  const style = fulfillmentStyles[status] ?? "bg-muted text-muted-foreground"
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${style}`}>
      {status}
    </span>
  )
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => <SortableHeader column={column} label="Order" />,
    cell: ({ row }) => (
      <div className="min-w-[180px]">
        <p className="text-sm font-medium leading-tight">{row.original.productName}</p>
        <p className="text-xs text-muted-foreground">{row.original.orderId}</p>
      </div>
    ),
  },
  {
    accessorKey: "patientName",
    header: ({ column }) => <SortableHeader column={column} label="Patient" />,
    cell: ({ row }) => (
      <div className="min-w-[120px]">
        <p className="text-sm font-medium leading-tight">{row.original.patientName}</p>
        <p className="text-xs text-muted-foreground">{row.original.gender}</p>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} label="Email" />,
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap max-w-[220px] truncate block">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("state")}</span>,
    filterFn: "equals",
  },
  {
    accessorKey: "subscriptionStatus",
    header: ({ column }) => <SortableHeader column={column} label="Subscription Status" />,
    cell: ({ row }) => <StatusBadge status={row.getValue("subscriptionStatus")} />,
    filterFn: "equals",
  },
  {
    accessorKey: "onHoldReason",
    header: "On hold reason",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("onHoldReason") || "-"}</span>,
  },
  {
    accessorKey: "inOnHold",
    header: "In on hold",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("inOnHold") || "-"}</span>,
  },
  {
    accessorKey: "fulfillmentStatus",
    header: "Fulfillment Status",
    cell: ({ row }) => <FulfillmentBadge status={row.getValue("fulfillmentStatus")} />,
    filterFn: "equals",
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => <SortableHeader column={column} label="Order Date" />,
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("orderDate")}</span>,
  },
  {
    accessorKey: "lastWeightUpdate",
    header: "Last weight update",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("lastWeightUpdate")}</span>,
  },
  // Extended columns (hidden by default)
  {
    accessorKey: "dob",
    header: "DOB",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("dob")}</span>,
  },
  {
    accessorKey: "timeScreened",
    header: "Time Screened",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("timeScreened")}</span>,
  },
  {
    accessorKey: "ctStatus",
    header: "CT Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("ctStatus")} />,
  },
  {
    accessorKey: "ctRemarks",
    header: "CT Remarks",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap max-w-[200px] truncate block">{row.getValue("ctRemarks") || "-"}</span>
    ),
  },
  {
    accessorKey: "assignedCT",
    header: "Assigned CT",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("assignedCT")}</span>,
  },
  {
    accessorKey: "month",
    header: "Month #",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap max-w-[160px] truncate block">{row.getValue("month")}</span>
    ),
  },
  {
    accessorKey: "assignedProvider",
    header: "Assigned Provider",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("assignedProvider")}</span>,
  },
  {
    accessorKey: "providerRemarks",
    header: "Provider Remarks",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("providerRemarks") || "-"}</span>,
  },
  {
    accessorKey: "visitType",
    header: "Visit Type",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("visitType")}</span>,
  },
  {
    accessorKey: "called",
    header: "Called?",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("called")}</span>,
  },
  {
    accessorKey: "providerStatus",
    header: "Provider Status",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue("providerStatus") || "-"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
        View <ArrowRightIcon className="ml-1 size-3" />
      </Button>
    ),
    enableHiding: false,
  },
]

// Columns hidden by default (spreadsheet extras)
export const defaultHiddenColumns: Record<string, boolean> = {
  onHoldReason: false,
  inOnHold: false,
  fulfillmentStatus: false,
  dob: false,
  timeScreened: false,
  ctStatus: false,
  ctRemarks: false,
  assignedCT: false,
  month: false,
  assignedProvider: false,
  providerRemarks: false,
  visitType: false,
  called: false,
  providerStatus: false,
}
