"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

// This would come from your database in a real app
const mockExpiringInsurance = [
  {
    agent_id: 2,
    agent_name: "Sarah Johnson",
    agent_external_id: "SJ-002",
    npn: "87654321",
    email: "sarah.johnson@example.com",
    resident_state: "NY",
    firm_name: "Global Advisors Inc",
    firm_id: 2,
    status: "Active",
    phone: "555-987-6543",
    residential_address: "789 Broadway, New York, NY 10003",
    business_address: "101 Park Ave, New York, NY 10178",
    aml_expiry_date: "2025-03-15",
    eo_expiry_date: "2024-05-22",
    appointment_status: "Approved",
    days_remaining: 28,
  },
  {
    agent_id: 3,
    agent_name: "Michael Brown",
    agent_external_id: "MB-003",
    npn: "23456789",
    email: "michael.brown@example.com",
    resident_state: "TX",
    firm_name: "Premier Financial Group",
    firm_id: 3,
    status: "Active",
    phone: "555-456-7890",
    residential_address: "321 Oak St, Austin, TX 78701",
    business_address: "555 Congress Ave, Austin, TX 78701",
    aml_expiry_date: "2024-11-10",
    eo_expiry_date: "2024-05-15",
    appointment_status: "Approved",
    days_remaining: 21,
  },
  {
    agent_id: 4,
    agent_name: "Emily Davis",
    agent_external_id: "ED-004",
    npn: "34567890",
    email: "emily.davis@example.com",
    resident_state: "FL",
    firm_name: "Elite Insurance Partners",
    firm_id: 4,
    status: "Active",
    phone: "555-789-0123",
    residential_address: "987 Palm Dr, Miami, FL 33139",
    business_address: "888 Biscayne Blvd, Miami, FL 33132",
    aml_expiry_date: "2024-08-05",
    eo_expiry_date: "2024-05-05",
    appointment_status: "Approved",
    days_remaining: 11,
  },
]

type Agent = (typeof mockExpiringInsurance)[0]

export function ExpiringInsuranceTable() {
  const router = useRouter()

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "agent_name",
      header: "Agent Name",
    },
    {
      accessorKey: "eo_expiry_date",
      header: "E&O Expiration Date",
      cell: ({ row }) => {
        const date = row.getValue("eo_expiry_date") as string
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
            {days <= 15 && <AlertTriangle className="h-4 w-4 text-red-500" />}
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
                router.push(`/agents/${row.original.agent_id}`)
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
      <DataTable columns={columns} data={mockExpiringInsurance} />
    </>
  )
}
