"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

export function NavMain({
  items,
  pathname,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    badge?: number
    items?: {
      title: string
      url: string
    }[]
  }[]
  pathname: string
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.url !== "#" && pathname.startsWith(item.url)
          const hasActiveChild = item.items?.some((sub) => sub.url !== "#" && pathname.startsWith(sub.url))

          return item.items ? (
            <Collapsible
              key={item.title}
              defaultOpen={hasActiveChild}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} isActive={hasActiveChild} />}
              >
                {item.icon}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        isActive={subItem.url !== "#" && pathname.startsWith(subItem.url)}
                        render={<Link href={subItem.url} />}
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                render={<Link href={item.url} />}
              >
                {item.icon}
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-medium">
                    {item.badge}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
