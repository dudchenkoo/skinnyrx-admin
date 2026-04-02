"use client"

import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { DateFilter } from "@/components/date-filter"
import { DashboardCustomize } from "@/components/dashboard-customize"
import { UserMenu } from "@/components/user-menu"
import { MetricCards } from "@/components/metric-cards"
import { CombinedChart } from "@/components/combined-chart"
import { UsersTable } from "@/components/users-table"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Page() {
  const [visible, setVisible] = React.useState<Record<string, boolean>>({
    metrics: true,
    users: true,
    charts: true,
  })

  const toggle = (id: string) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 px-4 bg-card border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <DashboardCustomize visible={visible} onToggle={toggle} />
          <DateFilter />
          <UserMenu />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
        {visible.metrics && <MetricCards />}
        {visible.charts && (
          <div>
            <h2 className="text-sm font-medium mb-3">Charts</h2>
            <CombinedChart />
          </div>
        )}
        {visible.users && (
          <div>
            <h2 className="text-sm font-medium mb-3">Users</h2>
            <UsersTable />
          </div>
        )}
      </div>
    </>
  )
}
