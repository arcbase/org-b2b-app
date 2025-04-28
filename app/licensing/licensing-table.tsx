"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

type License = {
  license_id: number
  agent_name: string
  agent_id: number
  firm_name: string
  firm_id: number
  license_state: string
  license_expiration_date: string
  status: string
  actionable_alerts: string | null
}

interface LicensingTableProps {
  licenses: License[]
}

export function LicensingTable({ licenses }: LicensingTableProps) {
  const router = useRouter()

  const columns: ColumnDef<License>[] = [
    {
      accessorKey: "agent_name",
      header: "Agent Name",
    },
    {
      accessorKey: "firm_name",
      header: "Firm",
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
        if (!date) return "N/A"

        const formattedDate = new Date(date).toLocaleDateString()

        // Check if expiration is within 30 days
        const expirationDate = new Date(date)
        const today = new Date()
        const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiration <= 30 && daysUntilExpiration > 0) {
          return (
            <div className="flex items-center gap-1">
              <span>{formattedDate}</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          )
        }

        return formattedDate
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
    {
      id: "actions",
      cell: ({ row }) => {
        const license = row.original

        return (
          <div className="flex justify-end">
            {license.actionable_alerts && (
              <Button variant="outline" size="sm" className="mr-2 text-xs">
                {license.actionable_alerts}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    router.push(`/licensing/${license.license_id}`)
                  }}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>Edit License</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={licenses} />
    </>
  )
}
