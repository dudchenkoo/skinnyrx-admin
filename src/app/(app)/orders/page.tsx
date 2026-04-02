"use client"

import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserMenu } from "@/components/user-menu"
import { columns, defaultHiddenColumns, type Order } from "./columns"
import { DataTable } from "./data-table"
import { OrderDetail } from "./order-detail"

const statusTabs: Record<string, string[]> = {
  pending: ["Incomplete Intake Form", "Subscription On Hold", "On hold", "Denied Check"],
  ready: ["Completed Intake Form", "Approved"],
  done: ["Sent to Pharmacy", "Charged"],
}

type TabKey = "pending" | "ready" | "done"

const products = [
  "Semaglutide", "Semaglutide Bundle (4 Months)", "Semaglutide Tablets (4 Months)",
  "Semaglutide Oral Bundle (12 Months)", "Semaglutide Bundle (12 Months)",
  "Semaglutide Injectable Microdose Monthly", "Tirzepatide Injectable Microdose Monthly",
]
const statuses = [
  "Incomplete Intake Form", "Completed Intake Form", "Subscription On Hold",
  "Sent to Pharmacy", "Charged", "Denied Check", "Approved", "On hold",
]
const fulfillments = ["-", "-", "-", "-", "Shipment Pending", "Shipped"]
const states = ["FL", "AL", "CO", "GA", "MI", "NY", "VA", "AR", "TX", "CA"]
const firstNames = [
  "Marie", "John", "Sarah", "James", "Emma", "Robert", "Lisa", "Michael",
  "Jennifer", "David", "Jessica", "William", "Amanda", "Thomas", "Ashley",
  "Daniel", "Nicole", "Andrew", "Stephanie", "Chris", "Megan", "Brian",
  "Rachel", "Kevin", "Laura", "Jason", "Amber", "Ryan", "Tiffany", "Mark",
]
const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas",
  "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Clark",
]
const ctNames = ["Janel", "Eduardo", "Roxanne", "Maria", "Tyler", ""]
const providerNames = ["Theresa", "Kimberli", "No NP", "Dr. Wilson", "Dr. Lee", ""]
const months = ["SQ M1", "SQ M2", "TZP SQ M2 - JN", "TZP Tablets 4mg (30 ct) - JN", "SQ M1+ M2+ Zofran", ""]
const weightUpdates = ["No data", "0 days", "1 day", "2 days", "5 days", "7+ days"]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const orders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const r = (offset: number) => seededRandom(i * 13 + offset)
  const pick = <T,>(arr: T[], offset: number) => arr[Math.floor(r(offset) * arr.length)]
  const status = pick(statuses, 1)
  const hasProvider = status === "Approved" || status === "Sent to Pharmacy" || status === "Charged"
  const day = Math.floor(r(2) * 28) + 1
  const month = Math.floor(r(3) * 3) + 2
  return {
    productName: pick(products, 0),
    orderId: String(75100 - i),
    patientName: `${pick(firstNames, 4)} ${pick(lastNames, 5)}`,
    gender: r(6) > 0.45 ? "female" as const : "male" as const,
    email: `${pick(firstNames, 4).toLowerCase()}.${pick(lastNames, 5).toLowerCase()}@skinnyrx.com`,
    state: pick(states, 7),
    subscriptionStatus: status,
    onHoldReason: status === "On hold" ? pick(["Missing documents", "Payment issue", "No ID"], 8) : "-",
    inOnHold: status === "On hold" ? `${Math.floor(r(9) * 5) + 1} days` : "-",
    fulfillmentStatus: hasProvider ? pick(fulfillments, 10) : "-",
    orderDate: `0${month}/0${day}/2026`.replace(/0(\d{2})/g, "$1"),
    lastWeightUpdate: pick(weightUpdates, 11),
    dob: `0${Math.floor(r(12) * 9) + 1}/0${Math.floor(r(13) * 28) + 1}/${1970 + Math.floor(r(14) * 30)}`,
    timeScreened: hasProvider ? `${Math.floor(r(15) * 12) + 8}:${String(Math.floor(r(16) * 60)).padStart(2, "0")} AM` : "",
    ctStatus: hasProvider ? "Approved" : "",
    ctRemarks: hasProvider ? pick(["Tirzepatide SQ Monthly - Refill", "Tirzepatide Tablets Monthly - Refill", "Semaglutide SQ Monthly"], 17) : "",
    assignedCT: hasProvider ? pick(ctNames, 18) : "",
    month: hasProvider ? pick(months, 19) : "",
    assignedProvider: hasProvider ? pick(providerNames, 20) : "",
    providerRemarks: "",
    visitType: "Asynchronous",
    called: hasProvider ? "Asynchronous" : "",
    providerStatus: "",
  }
})


export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [activeTab, setActiveTab] = React.useState<TabKey>("pending")

  const filteredOrders = orders.filter((o) =>
    statusTabs[activeTab].includes(o.subscriptionStatus)
  )

  const counts = {
    pending: orders.filter((o) => statusTabs.pending.includes(o.subscriptionStatus)).length,
    ready: orders.filter((o) => statusTabs.ready.includes(o.subscriptionStatus)).length,
    done: orders.filter((o) => statusTabs.done.includes(o.subscriptionStatus)).length,
  }

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 px-4 bg-card border-b">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Tabs value={activeTab} onValueChange={(v) => v && setActiveTab(v as TabKey)}>
            <TabsList>
              <TabsTrigger value="pending">
                Pending
                <span className="ml-1.5 text-muted-foreground">{counts.pending}</span>
              </TabsTrigger>
              <TabsTrigger value="ready">
                Ready for Doctor
                <span className="ml-1.5 text-muted-foreground">{counts.ready}</span>
              </TabsTrigger>
              <TabsTrigger value="done">
                Done
                <span className="ml-1.5 text-muted-foreground">{counts.done}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <UserMenu />
      </header>
      <div className="flex flex-1 flex-col p-4 overflow-hidden">
        <DataTable
          key={activeTab}
          columns={columns}
          data={filteredOrders}
          defaultHiddenColumns={defaultHiddenColumns}
          onRowClick={(row) => setSelectedOrder(row as Order)}
        />
      </div>
      <OrderDetail
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  )
}
