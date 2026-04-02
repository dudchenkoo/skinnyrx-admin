"use client"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SlidersHorizontalIcon } from "lucide-react"

export type DashboardBlock = {
  id: string
  label: string
}

const blocks: DashboardBlock[] = [
  { id: "metrics", label: "Metrics" },
  { id: "users", label: "Users" },
  { id: "charts", label: "Charts" },
]

export function DashboardCustomize({
  visible,
  onToggle,
}: {
  visible: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 text-xs bg-card" />}>
        <SlidersHorizontalIcon className="mr-1.5 size-3.5" />
        Customize
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {blocks.map((block) => (
          <DropdownMenuCheckboxItem
            key={block.id}
            checked={visible[block.id] !== false}
            onCheckedChange={() => onToggle(block.id)}
          >
            {block.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
