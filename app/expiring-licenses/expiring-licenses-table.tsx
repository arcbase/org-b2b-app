"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

// This would come from your database in a real app
const mockExpiringLicenses = [
  {
    license_id: 2,
    agent_name: "Sarah Johnson",
    agent_id: 2,
    firm_name: "Global Advisors Inc",
    firm_id: 2,
    license_state: "NY",
    license_expiration_date: "2024-05-15", // 21 days from today (assuming today is April 24)
    status: "Approved",
    actionable_alerts: "Renew",
    days_remaining: 21,
  },
  {
    license_id: 6,
    agent_name: "Michael Chen",
    agent_id: 6,
    firm_name: "Acme Financial Services",
    firm_id: 1,
    license_state: "CA",
    license_expiration_date: "2024-05-10", // 16 days from today
    status: "Approved",
    actionable_alerts: "Renew",
    days_remaining: 16,
  },
  {
    license_id: 7,
    agent_name: "Jessica Williams",
    agent_id: 7,
    firm_name: "Premier Financial Group",
    firm_id: 3,
    license_state: "TX",
    license_expiration_date: "2024-05-05", // 11 days from today
    status: "Approved",
    actionable_alerts: "Renew",
    days_remaining: 11,
  },
  {
    license_id: 8,
    agent_name: "Robert Taylor",
    agent_id: 8,
    firm_name: "Cornerstone Wealth Management",
    firm_id: 5,
    license_state: "IL",
    license_expiration_date: "2024-05-20", // 26 days from today
    status: "Approved",
    actionable_alerts: "Renew",
    days_remaining: 26,
  },
  {
    license_id: 9,
    agent_name: "Amanda Martinez",
    agent_id: 9,
    firm_name: "Global Advisors Inc",
    firm_id: 2,
    license_state: "FL",
    license_expiration_date: "2024-05-02", // 8 days from today
    status: "Approved",
    actionable_alerts: "Renew",
    days_remaining: 8,
  },
]

type ExpiringLicense = (typeof mockExpiringLicenses)[0]

export function ExpiringLicensesTable() {
  const router = useRouter()
  const [selectedLicense, setSelectedLicense] = useState<ExpiringLicense | null>(null)
  const [slideOverOpen, setSlideOverOpen] = useState(false)

  const columns: ColumnDef<ExpiringLicense>[] = [
    {
      accessorKey: "agent_name",
      header: "Agent Name",
    },
    {
      accessorKey: "license_state",
      header: "License State",
    },
    {
      accessorKey: "license_expiration_date",
      header: "Expiration Date",
      cell: ({ row }) => {
        const date = row.getValue("license_expiration_date") as string
        return new Date(date).toLocaleDateString()
      },
    },
    {
      accessorKey: "days_remaining",
      header: "Days Remaining",
      cell: ({ row }) => {
        const days = row.getValue("days_remaining") as number
        return (
          <div className="flex items-center gap-1">
            <span>{days} days</span>
            {days <= 10 && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
        )
      },
    },
    {
      accessorKey: "firm_name",
      header: "Firm",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-[#007AFF]"
              onClick={() => {
                router.push(`/licensing/${row.original.license_id}`)
              }}
            >
              View Details
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={mockExpiringLicenses} />
    </>
  )
}
