"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { useRouter } from "next/navigation"

type Advisor = {
  advisor_id: number
  advisor_name: string
  advisor_firm_id: number
  advisor_firm_name: string
  email: string
  phone: string
  portal_access_status: string
  status: string
}

interface AdvisorsTableProps {
  advisors: Advisor[]
}

export function AdvisorsTable({ advisors }: AdvisorsTableProps) {
  const router = useRouter()
  const handleRowClick = (advisor: Advisor) => {
    router.push(`/advisors/${advisor.advisor_id}`)
  }

  const columns: ColumnDef<Advisor>[] = [
    {
      accessorKey: "advisor_name",
      header: "Advisor Name",
    },
    {
      accessorKey: "advisor_firm_name",
      header: "Advisor Firm",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "portal_access_status",
      header: "Portal Access",
      cell: ({ row }) => {
        const status = row.getValue("portal_access_status") as string
        return <StatusBadge status={status as any} />
      },
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

  return (
    <>
      <DataTable columns={columns} data={advisors} onRowClick={handleRowClick} />
    </>
  )
}
