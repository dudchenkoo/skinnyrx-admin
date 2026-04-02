"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { PillIcon, SaveIcon, XIcon, ClockIcon, Maximize2Icon, Minimize2Icon } from "lucide-react"

const drawerWidths = {
  sm: "24rem",
  md: "32rem",
  lg: "42rem",
} as const

type DrawerSize = keyof typeof drawerWidths
import { toast } from "sonner"
import type { Order } from "./columns"

const selectClass = "flex h-8 w-full rounded-md border border-input bg-card px-2 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

// Options
const genderOptions = ["male", "female"]
const stateOptions = ["AL", "AR", "CA", "CO", "FL", "GA", "MI", "NY", "TX", "VA"]
const subscriptionStatusOptions = ["Incomplete Intake Form", "Completed Intake Form", "Subscription On Hold", "Sent to Pharmacy", "Charged", "Denied Check", "Approved", "On hold"]
const fulfillmentOptions = ["-", "Shipment Pending", "Shipped"]
const ctStatusOptions = ["", "Approved", "On hold", "Denied"]
const ctNameOptions = ["", "Janel", "Eduardo", "Roxanne", "Maria", "Tyler"]
const providerNameOptions = ["", "Theresa", "Kimberli", "No NP", "Dr. Wilson", "Dr. Lee"]
const visitTypeOptions = ["Asynchronous", "Synchronous"]
const calledOptions = ["", "Asynchronous", "Synchronous"]
const holdReasonOptions = ["-", "Missing documents", "Payment issue", "No ID", "Other"]
const providerStatusOptions = ["", "Pending", "Completed", "Rejected"]
const medications = [
  "Semaglutide 0.25mg", "Semaglutide 0.5mg", "Semaglutide 1mg", "Semaglutide 2.4mg",
  "Tirzepatide 2.5mg", "Tirzepatide 5mg", "Tirzepatide 7.5mg", "Tirzepatide 10mg",
  "Tirzepatide 12.5mg", "Tirzepatide 15mg",
]
const frequencies = ["Once weekly", "Twice weekly", "Once daily", "Twice daily", "As needed"]
const durations = ["1 month", "2 months", "3 months", "4 months", "6 months", "12 months"]
const routes = ["Subcutaneous injection", "Oral tablet"]

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

// Mock activity
const mockActivity = [
  { time: "Apr 2, 2026 10:30 AM", user: "Janel", action: "Changed CT Status to Approved" },
  { time: "Apr 2, 2026 10:15 AM", user: "System", action: "Intake form completed" },
  { time: "Apr 1, 2026 3:45 PM", user: "Roxanne", action: "Assigned CT to Janel" },
  { time: "Apr 1, 2026 2:00 PM", user: "System", action: "Order created" },
]

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? "bg-muted text-muted-foreground"
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${style}`}>
      {status}
    </span>
  )
}

function EditableSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <select className={selectClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt || "—"}</option>
        ))}
      </select>
    </div>
  )
}

export function OrderDetail({
  order,
  open,
  onClose,
}: {
  order: Order | null
  open: boolean
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [drawerSize, setDrawerSize] = React.useState<DrawerSize>("sm")
  const [edits, setEdits] = React.useState<Record<string, string>>({})
  const isDirty = Object.keys(edits).length > 0

  const getVal = (key: string, original: string) => key in edits ? edits[key] : original
  const setVal = (key: string, value: string, original: string) => {
    if (value === original) {
      setEdits((prev) => { const next = { ...prev }; delete next[key]; return next })
    } else {
      setEdits((prev) => ({ ...prev, [key]: value }))
    }
  }

  const handleSave = () => {
    toast.success("Order updated", {
      description: `${Object.keys(edits).length} field(s) saved for Order #${order?.orderId}`,
    })
    setEdits({})
  }

  const [medication, setMedication] = React.useState("")
  const [dosage, setDosage] = React.useState("")
  const [frequency, setFrequency] = React.useState("")
  const [duration, setDuration] = React.useState("")
  const [route, setRoute] = React.useState("")
  const [refills, setRefills] = React.useState("0")
  const [notes, setNotes] = React.useState("")

  const resetForm = () => {
    setMedication(""); setDosage(""); setFrequency("")
    setDuration(""); setRoute(""); setRefills("0"); setNotes("")
  }

  const handleClose = () => {
    setActiveTab("overview")
    setDrawerSize("sm")
    setEdits({})
    resetForm()
    onClose()
  }

  const cycleSize = () => {
    setDrawerSize((prev) => prev === "sm" ? "md" : prev === "md" ? "lg" : "sm")
  }

  const handlePrescribe = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Prescription created", {
      description: `${medication} prescribed for ${order?.patientName} — Order #${order?.orderId}`,
    })
    handleClose()
  }

  if (!order) return null

  return (
    <Drawer direction="right" open={open} onOpenChange={handleClose}>
      <DrawerContent style={{ "--drawer-width": drawerWidths[drawerSize] } as React.CSSProperties} className="transition-[max-width] duration-200">
        <div className="w-full flex flex-col h-full" data-vaul-no-drag>
          <DrawerTitle className="sr-only">Order #{order.orderId}</DrawerTitle>
          {/* Compact header — always visible */}
          <div className="shrink-0 border-b bg-card px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold leading-tight">{order.patientName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.productName} — #{order.orderId}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <StatusBadge status={order.subscriptionStatus} />
                <Button variant="ghost" size="icon" className="size-7" onClick={cycleSize} title={`Size: ${drawerSize.toUpperCase()}`}>
                  {drawerSize === "lg" ? <Minimize2Icon className="size-3.5" /> : <Maximize2Icon className="size-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="size-7" onClick={handleClose}>
                  <XIcon className="size-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => v && setActiveTab(v)} className="mt-3">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="edit" className="flex-1">
                  Edit
                  {isDirty && <span className="ml-1 size-1.5 rounded-full bg-primary" />}
                </TabsTrigger>
                <TabsTrigger value="prescribe" className="flex-1">Prescribe</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "overview" && (
              <div className="space-y-5 p-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Patient</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name" value={order.patientName} />
                    <Field label="Gender" value={order.gender} />
                    <Field label="DOB" value={order.dob} />
                    <Field label="Email" value={order.email} />
                    <Field label="State" value={order.state} />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Order</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Order Date" value={order.orderDate} />
                    <Field label="Time Screened" value={order.timeScreened} />
                    <Field label="Month #" value={order.month} />
                    <Field label="Visit Type" value={order.visitType} />
                    <Field label="Called?" value={order.called} />
                    <Field label="Last weight update" value={order.lastWeightUpdate} />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Status</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Subscription Status</p>
                      <StatusBadge status={order.subscriptionStatus} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fulfillment Status</p>
                      {order.fulfillmentStatus && order.fulfillmentStatus !== "-"
                        ? <StatusBadge status={order.fulfillmentStatus} />
                        : <p className="text-sm font-medium">—</p>
                      }
                    </div>
                    <Field label="On hold reason" value={order.onHoldReason} />
                    <Field label="In on hold" value={order.inOnHold} />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Clinical</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="CT Status" value={order.ctStatus} />
                    <Field label="CT Remarks" value={order.ctRemarks} />
                    <Field label="Assigned CT" value={order.assignedCT} />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Provider</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Assigned Provider" value={order.assignedProvider} />
                    <Field label="Provider Remarks" value={order.providerRemarks} />
                    <Field label="Provider Status" value={order.providerStatus} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "edit" && (
              <div className="space-y-5 p-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Patient</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name" value={order.patientName} />
                    <EditableSelect label="Gender" value={getVal("gender", order.gender)} options={genderOptions} onChange={(v) => setVal("gender", v, order.gender)} />
                    <Field label="DOB" value={order.dob} />
                    <EditableSelect label="State" value={getVal("state", order.state)} options={stateOptions} onChange={(v) => setVal("state", v, order.state)} />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Status</p>
                  <div className="grid grid-cols-2 gap-3">
                    <EditableSelect label="Subscription Status" value={getVal("subscriptionStatus", order.subscriptionStatus)} options={subscriptionStatusOptions} onChange={(v) => setVal("subscriptionStatus", v, order.subscriptionStatus)} />
                    <EditableSelect label="Fulfillment Status" value={getVal("fulfillmentStatus", order.fulfillmentStatus)} options={fulfillmentOptions} onChange={(v) => setVal("fulfillmentStatus", v, order.fulfillmentStatus)} />
                    <EditableSelect label="On hold reason" value={getVal("onHoldReason", order.onHoldReason)} options={holdReasonOptions} onChange={(v) => setVal("onHoldReason", v, order.onHoldReason)} />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Clinical</p>
                  <div className="grid grid-cols-2 gap-3">
                    <EditableSelect label="CT Status" value={getVal("ctStatus", order.ctStatus)} options={ctStatusOptions} onChange={(v) => setVal("ctStatus", v, order.ctStatus)} />
                    <EditableSelect label="Assigned CT" value={getVal("assignedCT", order.assignedCT)} options={ctNameOptions} onChange={(v) => setVal("assignedCT", v, order.assignedCT)} />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Provider</p>
                  <div className="grid grid-cols-2 gap-3">
                    <EditableSelect label="Assigned Provider" value={getVal("assignedProvider", order.assignedProvider)} options={providerNameOptions} onChange={(v) => setVal("assignedProvider", v, order.assignedProvider)} />
                    <EditableSelect label="Provider Status" value={getVal("providerStatus", order.providerStatus)} options={providerStatusOptions} onChange={(v) => setVal("providerStatus", v, order.providerStatus)} />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Order</p>
                  <div className="grid grid-cols-2 gap-3">
                    <EditableSelect label="Visit Type" value={getVal("visitType", order.visitType)} options={visitTypeOptions} onChange={(v) => setVal("visitType", v, order.visitType)} />
                    <EditableSelect label="Called?" value={getVal("called", order.called)} options={calledOptions} onChange={(v) => setVal("called", v, order.called)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "prescribe" && (
              <form onSubmit={handlePrescribe} id="prescribe-form" className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label>Medication</Label>
                  <select className={selectClass} value={medication} onChange={(e) => setMedication(e.target.value)}>
                    <option value="" disabled>Select medication</option>
                    {medications.map((med) => (
                      <option key={med} value={med}>{med}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Dosage</Label>
                    <Input placeholder="e.g. 0.25 mL" value={dosage} onChange={(e) => setDosage(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Route</Label>
                    <select className={selectClass} value={route} onChange={(e) => setRoute(e.target.value)}>
                      <option value="" disabled>Select route</option>
                      {routes.map((r) => (<option key={r} value={r}>{r}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <select className={selectClass} value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                      <option value="" disabled>Select frequency</option>
                      {frequencies.map((f) => (<option key={f} value={f}>{f}</option>))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <select className={selectClass} value={duration} onChange={(e) => setDuration(e.target.value)}>
                      <option value="" disabled>Select duration</option>
                      {durations.map((d) => (<option key={d} value={d}>{d}</option>))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Refills</Label>
                  <Input type="number" min="0" max="12" value={refills} onChange={(e) => setRefills(e.target.value)} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Provider Notes</Label>
                  <Textarea placeholder="Additional instructions, allergies, contraindications..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                </div>
              </form>
            )}

            {activeTab === "activity" && (
              <div className="p-4">
                <div className="space-y-0">
                  {mockActivity.map((item, i) => (
                    <div key={i} className="relative flex gap-3 pb-6 last:pb-0">
                      {i < mockActivity.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
                      )}
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
                        <ClockIcon className="size-3 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm">{item.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.user} &middot; {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky footer — contextual */}
          {activeTab === "edit" && isDirty && (
            <div className="shrink-0 border-t bg-card p-4">
              <Button className="w-full" onClick={handleSave}>
                <SaveIcon className="mr-2 size-4" />
                Save Changes ({Object.keys(edits).length})
              </Button>
            </div>
          )}
          {activeTab === "prescribe" && (
            <div className="shrink-0 border-t bg-card p-4">
              <Button
                type="submit"
                form="prescribe-form"
                className="w-full"
                disabled={!medication || !frequency || !duration}
              >
                <PillIcon className="mr-2 size-4" />
                Prescribe Medication
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
