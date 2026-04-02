"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { GripVerticalIcon, EyeIcon, EyeOffIcon } from "lucide-react"

type ColumnItem = {
  id: string
  label: string
  visible: boolean
}

function SortableColumn({
  item,
  onToggle,
}: {
  item: ColumnItem
  onToggle: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border bg-card px-3 py-2"
    >
      <button
        className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <span className={`flex-1 text-sm ${item.visible ? "text-foreground" : "text-muted-foreground"}`}>
        {item.label}
      </span>
      <button
        onClick={onToggle}
        className={`${item.visible ? "text-primary" : "text-muted-foreground/40"} hover:text-primary`}
      >
        {item.visible ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
      </button>
    </div>
  )
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
  actions: "Actions",
}

export function ColumnManager({
  open,
  onClose,
  columnOrder,
  columnVisibility,
  onColumnOrderChange,
  onColumnVisibilityChange,
}: {
  open: boolean
  onClose: () => void
  columnOrder: string[]
  columnVisibility: Record<string, boolean>
  onColumnOrderChange: (order: string[]) => void
  onColumnVisibilityChange: (id: string, visible: boolean) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const items: ColumnItem[] = columnOrder
    .filter((id) => id !== "actions")
    .map((id) => ({
      id,
      label: columnLabels[id] ?? id,
      visible: columnVisibility[id] !== false,
    }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string)
      const newIndex = columnOrder.indexOf(over.id as string)
      onColumnOrderChange(arrayMove(columnOrder, oldIndex, newIndex))
    }
  }

  const visibleCount = items.filter((i) => i.visible).length

  return (
    <Drawer direction="right" open={open} onOpenChange={onClose}>
      <DrawerContent>
        <div className="w-full flex flex-col h-full" data-vaul-no-drag>
          <DrawerHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-base">Columns</DrawerTitle>
              <span className="text-xs text-muted-foreground">{visibleCount} visible</span>
            </div>
            <p className="text-xs text-muted-foreground">Drag to reorder. Toggle visibility.</p>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <SortableColumn
                      key={item.id}
                      item={item}
                      onToggle={() => onColumnVisibilityChange(item.id, !item.visible)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
          <div className="shrink-0 border-t bg-card p-4">
            <Button className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
