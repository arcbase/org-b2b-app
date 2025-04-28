"use client"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"

type Agent = {
  agent_id: number
  agent_name: string
  agent_external_id: string
  npn: string
  email: string
  resident_state: string
  firm_name: string
  firm_id: number
  status: string
}

interface AgentsTableProps {
  agents: Agent[]
}

export function AgentsTable({ agents }: AgentsTableProps) {
  const router = useRouter()

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "agent_name",
      header: "Agent Name",
    },
    {
      accessorKey: "agent_external_id",
      header: "External ID",
    },
    {
      accessorKey: "npn",
      header: "NPN",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "resident_state",
      header: "Resident State",
    },
    {
      accessorKey: "linked_b2b_partner_firm_name",
      header: "B2B Partner Firm",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <StatusBadge status={status as any} />
      },
    },
  ]

  const handleRowClick = (agent: Agent) => {
    router.push(`/agents/${agent.agent_id}`)
  }

  return <DataTable columns={columns} data={agents} onRowClick={handleRowClick} />
}
