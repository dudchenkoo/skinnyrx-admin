"use client"

import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { type DateRange } from "react-day-picker"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  FilterIcon,
  XIcon,
  ColumnsIcon,
} from "lucide-react"
import { ColumnManager } from "./column-manager"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  defaultHiddenColumns?: Record<string, boolean>
  onRowClick?: (row: TData) => void
}

const columnLabels: Record<string, string> = {
  productName: "Order",
  patientName: "Patient",
  email: "Email",
  state: "State",
  subscriptionStatus: "Subscription Status",
  onHoldReason: "On hold reason",
  inOnHold: "In on hold",
  fulfillmentStatus: "Fulfillment Status",
  orderDate: "Order Date",
  lastWeightUpdate: "Last weight update",
  dob: "DOB",
  timeScreened: "Time Screened",
  ctStatus: "CT Status",
  ctRemarks: "CT Remarks",
  assignedCT: "Assigned CT",
  month: "Month #",
  assignedProvider: "Assigned Provider",
  providerRemarks: "Provider Remarks",
  visitType: "Visit Type",
  called: "Called?",
  providerStatus: "Provider Status",
}


type FilterGroup = {
  title: string
  filters: { key: string; label: string; placeholder: string; options: string[] }[]
}

const filterGroups: FilterGroup[] = [
  {
    title: "Order",
    filters: [
      { key: "subscriptionStatus", label: "Status", placeholder: "All statuses", options: ["Incomplete Intake Form", "Completed Intake Form", "Subscription On Hold", "Sent to Pharmacy", "Charged", "Denied Check", "Approved", "On hold"] },
      { key: "fulfillmentStatus", label: "Fulfillment", placeholder: "All fulfillment", options: ["Shipment Pending", "Shipped"] },
      { key: "product", label: "Product", placeholder: "All products", options: ["Semaglutide", "Tirzepatide", "Semaglutide Bundle", "Semaglutide Tablets"] },
      { key: "state", label: "State", placeholder: "All states", options: ["AL", "AR", "CO", "FL", "GA", "MI", "NY", "VA"] },
    ],
  },
  {
    title: "Clinical",
    filters: [
      { key: "patientStatus", label: "Patient status", placeholder: "All", options: ["Active", "Inactive"] },
      { key: "visitType", label: "Visit status", placeholder: "All", options: ["Asynchronous", "Synchronous"] },
      { key: "syncAsync", label: "Sync/Async", placeholder: "All", options: ["Synchronous", "Asynchronous"] },
    ],
  },
  {
    title: "Hold & Cancellation",
    filters: [
      { key: "holdStatus", label: "Hold status", placeholder: "All", options: ["On Hold", "Not On Hold"] },
      { key: "onHoldReason", label: "On hold reason", placeholder: "All reasons", options: ["Missing documents", "Payment issue", "No ID", "Other"] },
      { key: "scheduleCancellation", label: "Schedule Cancellation", placeholder: "All", options: ["Scheduled", "Not Scheduled"] },
    ],
  },
  {
    title: "Other",
    filters: [
      { key: "lastWeightUpdate", label: "Last weight update", placeholder: "All", options: ["No data", "0 days", "1 day", "7+ days", "30+ days"] },
    ],
  },
]

const allFilters = filterGroups.flatMap((g) => g.filters)

const selectClass = "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultHiddenColumns = {},
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(defaultHiddenColumns)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [datePreset, setDatePreset] = React.useState("All time")
  const [dateRangeValue, setDateRangeValue] = React.useState<DateRange | undefined>(undefined)
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({})
  const [columnOrder, setColumnOrder] = React.useState<string[]>(
    columns.map((c) => (c as any).accessorKey ?? c.id ?? "")
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  })

  const extraFilterCount = Object.values(filterValues).filter((v) => v && v !== "all").length
  const hasActiveFilters = columnFilters.length > 0 || globalFilter.length > 0 || datePreset !== "All time" || extraFilterCount > 0
  const activeFilterCount = columnFilters.length + extraFilterCount + (datePreset !== "All time" ? 1 : 0)

  const resetFilters = () => {
    setColumnFilters([])
    setGlobalFilter("")
    setDatePreset("All time")
    setDateRangeValue(undefined)
    setFilterValues({})
  }

  const datePresets = [
    { label: "All time", getValue: () => undefined },
    { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
    { label: "Yesterday", getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
    { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
    { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
    { label: "Current month", getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
    { label: "Last month", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  ]

  const dateDisplayLabel = datePreset !== "Custom"
    ? datePreset
    : dateRangeValue?.from
      ? dateRangeValue.to
        ? `${format(dateRangeValue.from, "MMM d")} - ${format(dateRangeValue.to, "MMM d")}`
        : format(dateRangeValue.from, "MMM d, yyyy")
      : "All time"

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Header bar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">
            {table.getFilteredRowModel().rows.length.toLocaleString()} Orders{" "}
            <span className="text-sm font-normal text-muted-foreground">Total</span>
          </h2>
          {hasActiveFilters && (
            <Button
              variant="link"
              size="sm"
              className="text-xs text-primary underline h-auto p-0"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 h-8 w-[200px] text-sm bg-card"
            />
          </div>
          <Button
            variant={hasActiveFilters ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs bg-card"
            onClick={() => setFilterOpen(true)}
          >
            <FilterIcon className="mr-1.5 size-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1.5 flex size-4 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 bg-card"
            onClick={() => setColumnsOpen(true)}
          >
            <ColumnsIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Filter drawer */}
      <Drawer direction="right" open={filterOpen} onOpenChange={setFilterOpen}>
        <DrawerContent>
          <div className="w-full flex flex-col h-full" data-vaul-no-drag>
            <DrawerHeader className="shrink-0">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-base">Filters</DrawerTitle>
                {hasActiveFilters && (
                  <span className="text-xs text-muted-foreground">{activeFilterCount} active</span>
                )}
              </div>
            </DrawerHeader>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                {datePreset !== "All time" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                    {dateDisplayLabel}
                    <button onClick={() => { setDatePreset("All time"); setDateRangeValue(undefined) }} className="hover:text-primary/70">
                      <XIcon className="size-3" />
                    </button>
                  </span>
                )}
                {allFilters.map((f) => {
                  const val = filterValues[f.key]
                  if (!val || val === "all") return null
                  return (
                    <span key={f.key} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                      {val}
                      <button
                        onClick={() => {
                          setFilterValues((prev) => ({ ...prev, [f.key]: "all" }))
                          const colIds = table.getAllColumns().map((c) => c.id)
                          if (colIds.includes(f.key)) {
                            table.getColumn(f.key)?.setFilterValue(undefined)
                          }
                        }}
                        className="hover:text-primary/70"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}

            {/* Scrollable filters */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-5">

              {filterGroups.map((group) => (
                <div key={group.title}>
                  <Separator className="mb-3" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{group.title}</p>
                  <div className="space-y-3">
                    {group.filters.map((filter) => {
                      const val = filterValues[filter.key] ?? "all"
                      const isActive = val !== "all"
                      return (
                        <div key={filter.key} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-muted-foreground">{filter.label}</label>
                            {isActive && (
                              <span className="size-1.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <select
                            className={selectClass}
                            value={val}
                            onChange={(e) => {
                              const value = e.target.value
                              setFilterValues((prev) => ({ ...prev, [filter.key]: value }))
                              const colIds = table.getAllColumns().map((c) => c.id)
                              if (colIds.includes(filter.key)) {
                                table.getColumn(filter.key)?.setFilterValue(value === "all" ? undefined : value)
                              }
                            }}
                          >
                            <option value="all">{filter.placeholder}</option>
                            {filter.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky footer */}
            <div className="shrink-0 border-t bg-card p-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  resetFilters()
                  setFilterOpen(false)
                }}
              >
                <XIcon className="mr-1.5 size-3.5" />
                Reset all
              </Button>
              <Button
                className="flex-1"
                onClick={() => setFilterOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Column manager drawer */}
      <ColumnManager
        open={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        columnOrder={columnOrder}
        columnVisibility={columnVisibility}
        onColumnOrderChange={setColumnOrder}
        onColumnVisibilityChange={(id, visible) => {
          setColumnVisibility((prev) => ({ ...prev, [id]: visible }))
        }}
      />

      {/* Table */}
      <div className="flex-1 min-h-0 rounded-md border bg-card overflow-auto [&_[data-slot=table-container]]:overflow-visible">
        <Table>
          <TableHeader className="sticky top-0 z-30 bg-card [&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isFirst = header.column.id === "productName"
                  const isLast = header.column.id === "actions"
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        isFirst
                          ? "sticky left-0 z-20 bg-card after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border"
                          : isLast
                            ? "sticky right-0 z-20 bg-card before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border"
                            : ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isFirst = cell.column.id === "productName"
                    const isLast = cell.column.id === "actions"
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          isFirst
                            ? "sticky left-0 z-10 bg-card after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border"
                            : isLast
                              ? "sticky right-0 z-10 bg-card before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border"
                              : ""
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between shrink-0">
        <p className="text-xs text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">Rows</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-7 w-[60px] text-xs bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[15, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeftIcon className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="size-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRightIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
