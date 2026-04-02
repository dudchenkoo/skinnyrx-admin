"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
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
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import {
  ArrowUpDownIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

type User = {
  role: string
  quantity: number
  avatars: string[]
  extra: number
}

const users: User[] = [
  { role: "Doctor", quantity: 67, avatars: ["T", "D", "T"], extra: 27 },
  { role: "Nurse", quantity: 36, avatars: ["NN", "TN", "AN"], extra: 27 },
  { role: "Admin", quantity: 35, avatars: ["DP", "S", "DL"], extra: 27 },
  { role: "Agent", quantity: 28, avatars: ["T", "AE", "AA"], extra: 5 },
]

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDownIcon className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue("role")}</span>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Quantity
        <ArrowUpDownIcon className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm">{row.getValue("quantity")}</span>,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
        View all {row.original.role}s <ArrowRightIcon className="ml-1 size-3" />
      </Button>
    ),
  },
]

export function UsersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <>
      <div className="space-y-3">
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedUser(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-16 text-center text-sm text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {table.getFilteredRowModel().rows.length} total
          </p>
          <div className="flex items-center gap-1">
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
          </div>
        </div>
      </div>

      <Drawer direction="right" open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DrawerContent>
          <div className="w-full overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="text-base">{selectedUser?.role}s</DrawerTitle>
            </DrawerHeader>
            {selectedUser && (
              <div className="space-y-4 px-4 pb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{selectedUser.quantity}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Team Members</p>
                  <div className="space-y-2">
                    {selectedUser.avatars.map((initials, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Avatar className="size-8 text-xs">
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{initials}</span>
                      </div>
                    ))}
                    {selectedUser.extra > 0 && (
                      <p className="text-xs text-muted-foreground">
                        +{selectedUser.extra} more
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
