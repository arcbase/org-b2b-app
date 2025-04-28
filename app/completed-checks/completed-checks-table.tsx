"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// This would come from your database in a real app
const mockCompletedChecks = [
  {
    agent_id: 10,
    agent_name: "Jennifer Adams",
    agent_external_id: "JA-010",
    npn: "12345670",
    email: "jennifer.adams@example.com",
    resident_state: "CA",
    firm_name: "Acme Financial Services",
    firm_id: 1,
    status: "Active",
    phone: "555-111-2233",
    residential_address: "123 Pine St, San Francisco, CA 94111",
    business_address: "456 Market St, San Francisco, CA 94105",
    aml_expiry_date: "2025-04-15",
    eo_expiry_date: "2025-03-10",
    appointment_status: "Approved",
    background_check_completion_date: "2024-04-20",
  },
  {
    agent_id: 11,
    agent_name: "Carlos Rodriguez",
    agent_external_id: "CR-011",
    npn: "23456781",
    email: "carlos.rodriguez@example.com",
    resident_state: "TX",
    firm_name: "Premier Financial Group",
    firm_id: 3,
    status: "Active",
    phone: "555-222-3344",
    residential_address: "789 Oak St, Austin, TX 78701",
    business_address: "555 Congress Ave, Austin, TX 78701",
    aml_expiry_date: "2025-05-20",
    eo_expiry_date: "2025-02-15",
    appointment_status: "Approved",
    background_check_completion_date: "2024-04-19",
  },
  {
    agent_id: 12,
    agent_name: "Michelle Park",
    agent_external_id: "MP-012",
    npn: "34567892",
    email: "michelle.park@example.com",
    resident_state: "NY",
    firm_name: "Global Advisors Inc",
    firm_id: 2,
    status: "Active",
    phone: "555-333-4455",
    residential_address: "123 Broadway, New York, NY 10003",
    business_address: "101 Park Ave, New York, NY 10178",
    aml_expiry_date: "2025-03-25",
    eo_expiry_date: "2025-01-20",
    appointment_status: "Approved",
    background_check_completion_date: "2024-04-18",
  },
  {
    agent_id: 13,
    agent_name: "David Thompson",
    agent_external_id: "DT-013",
    npn: "45678903",
    email: "david.thompson@example.com",
    resident_state: "IL",
    firm_name: "Cornerstone Wealth Management",
    firm_id: 5,
    status: "Active",
    phone: "555-444-5566",
    residential_address: "456 Michigan Ave, Chicago, IL 60611",
    business_address: "233 S Wacker Dr, Chicago, IL 60606",
    aml_expiry_date: "2025-06-10",
    eo_expiry_date: "2025-04-05",
    appointment_status: "Approved",
    background_check_completion_date: "2024-04-17",
  },
  {
    agent_id: 14,
    agent_name: "Lisa Wilson",
    agent_external_id: "LW-014",
    npn: "56789014",
    email: "lisa.wilson@example.com",
    resident_state: "FL",
    firm_name: "Elite Insurance Partners",
    firm_id: 4,
    status: "Active",
    phone: "555-555-6677",
    residential_address: "987 Palm Dr, Miami, FL 33139",
    business_address: "888 Biscayne Blvd, Miami, FL 33132",
    aml_expiry_date: "2025-05-15",
    eo_expiry_date: "2025-03-20",
    appointment_status: "Approved",
    background_check_completion_date: "2024-04-16",
  },
  {
    agent_id: 15,
    agent_name: "Robert Chen",
    agent_external_id: "RC-015",
    npn: "67890125",
    email: "robert.chen@example.com",
    resident_state: "WA",
    firm_name: "Future Planning Associates",
    firm_id: 5,
    status: "Active",
    phone: "555-666-7788",
    residential_address: "123 Pine St, Seattle, WA 98101",
    business_address: "890 Future Dr, Seattle, WA 98101",
    aml_expiry_date: "2025-04-25",
    eo_expiry_date: "2025-02-10",
    appointment_status: "Approved",
    background_check_completion_date: "2024-04-15",
  },
  {
    agent_id: 16,
    agent_name: "Sarah Miller",
    agent_external_id: "SM-016",
    npn: "78901236",
    email: "sarah.miller@example.com",
    resident_state: "MA",
    firm_name: "Wealth Advisors Group",
    firm_id: 1,
    status: "Active",
    phone: "555-777-8899",
    residential_address: "456 Beacon St, Boston, MA 02116",
    business_address: "789 Wealth Ave, Boston, MA 02110",
    aml_expiry_date: "2025-06-05",
    eo_expiry_date: "2025-05-15",
    appointment_status: "Approved",
    background_check_completion_date: "2024-04-14",
  },
]

type Agent = (typeof mockCompletedChecks)[0]

export function CompletedChecksTable() {
  const router = useRouter()

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "agent_name",
      header: "Agent Name",
    },
    {
      accessorKey: "background_check_completion_date",
      header: "Completion Date",
      cell: ({ row }) => {
        const date = row.getValue("background_check_completion_date") as string
        return new Date(date).toLocaleDateString()
      },
    },
    {
      accessorKey: "firm_name",
      header: "Firm",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className="flex items-center gap-1">
            <StatusBadge status={status as any} />
            <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
          </div>
        )
      },
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
      <DataTable columns={columns} data={mockCompletedChecks} />
    </>
  )
}
