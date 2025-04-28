"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { useRouter } from "next/navigation"

type Firm = {
  firm_id: number
  firm_name: string
  firm_external_id: string
  email: string
  tin: string
  firm_npn: string
  status: string
  address?: string
}

interface FirmsTableProps {
  firms: Firm[]
}

export function FirmsTable({ firms }: FirmsTableProps) {
  const router = useRouter()

  const columns: ColumnDef<Firm>[] = [
    {
      accessorKey: "firm_name",
      header: "Firm Name",
    },
    {
      accessorKey: "firm_external_id",
      header: "External ID",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "tin",
      header: "TIN",
    },
    {
      accessorKey: "firm_npn",
      header: "NPN",
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

  const handleRowClick = (firm: Firm) => {
    router.push(`/firms/${firm.firm_id}`)
  }

  return (
    <>
      <DataTable columns={columns} data={firms} onRowClick={handleRowClick} />
    </>
  )
}
