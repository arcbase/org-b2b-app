"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { useRouter } from "next/navigation"

type AdvisorFirm = {
  advisor_firm_id: number
  advisor_firm_name: string
  firm_external_id: string
  linked_b2b_partner_firm_id: number
  linked_b2b_partner_firm_name: string
  primary_contact_name: string
  primary_contact_email: string
  phone: string
  address: string
  advisors_count: number
  status: string
  portal_access_status: string
}

interface AdvisorFirmsTableProps {
  advisorFirms: AdvisorFirm[]
}

export function AdvisorFirmsTable({ advisorFirms }: AdvisorFirmsTableProps) {
  const router = useRouter()
  const handleRowClick = (advisorFirm: AdvisorFirm) => {
    router.push(`/advisor-firms/${advisorFirm.advisor_firm_id}`)
  }

  const columns: ColumnDef<AdvisorFirm>[] = [
    {
      accessorKey: "advisor_firm_name",
      header: "Advisor Firm Name",
    },
    {
      accessorKey: "firm_external_id",
      header: "External ID",
    },
    {
      accessorKey: "primary_contact_name",
      header: "Primary Contact",
    },
    {
      accessorKey: "primary_contact_email",
      header: "Email",
    },
    {
      accessorKey: "advisors_count",
      header: "Advisors Count",
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
      <DataTable columns={columns} data={advisorFirms} onRowClick={handleRowClick} />
    </>
  )
}
