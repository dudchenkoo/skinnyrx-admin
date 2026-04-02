"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  LayoutGridIcon,
  ListChecksIcon,
  CalendarIcon,
  UsersIcon,
  LinkIcon,
  ClipboardListIcon,
  BarChart3Icon,
  HeadphonesIcon,
  UserPlusIcon,
  SettingsIcon,
} from "lucide-react"
import Link from "next/link"

const data = {
  user: {
    name: "test Admin",
    role: "Admin",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutGridIcon />,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: <ListChecksIcon />,
    },
    {
      title: "Appointments",
      url: "#",
      icon: <CalendarIcon />,
      badge: 51,
    },
    {
      title: "Patients",
      url: "#",
      icon: <UsersIcon />,
    },
    {
      title: "Payment Links",
      url: "#",
      icon: <LinkIcon />,
    },
    {
      title: "Medical",
      url: "#",
      icon: <ClipboardListIcon />,
      items: [
        { title: "Medications", url: "#" },
        { title: "Doctor Statistics", url: "#" },
        { title: "Prescriptions", url: "#" },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <BarChart3Icon />,
      items: [
        { title: "Metrics", url: "#" },
        { title: "Quiz Metrics", url: "#" },
        { title: "Charged Non Prescribed", url: "#" },
        { title: "Prescribed Without Tracking", url: "#" },
        { title: "Cancellation report", url: "#" },
        { title: "User Cancellation Flow", url: "#" },
        { title: "Pop-up metrics", url: "#" },
        { title: "On Hold Reasons", url: "#" },
      ],
    },
    {
      title: "Customer Service",
      url: "#",
      icon: <HeadphonesIcon />,
      items: [
        { title: "Outbound Sales", url: "#" },
        { title: "Agent Reports", url: "#" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Create Order",
      url: "#",
      icon: <UserPlusIcon />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <SettingsIcon />,
      items: [
        { title: "Users", url: "#" },
        { title: "Roles", url: "#" },
        { title: "Note Templates", url: "#" },
        { title: "Permissions", url: "#" },
        { title: "Products", url: "#" },
        { title: "Schedule Configs", url: "#" },
        { title: "My Account", url: "#" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <img src="/logo.png" alt="SkinnyRx" className="size-8 rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SkinnyRx</span>
                <span className="truncate text-xs">Admin Panel</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
        <SidebarSeparator />
        <NavSecondary items={data.navSecondary} pathname={pathname} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
