"use client"

import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NoDataMessageProps {
  entityName: string
  entityNamePlural: string
  addNewAction?: () => void
}

export function NoDataMessage({ entityName, entityNamePlural, addNewAction }: NoDataMessageProps) {
  return (
    <div className="bg-white rounded-md border p-8 text-center">
      <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">No {entityNamePlural} Found</h2>
      <p className="text-gray-500 mb-6">
        The database doesn't have any {entityName.toLowerCase()} data yet. You need to initialize and seed the database
        first.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/admin">
          <Button variant="outline">Go to Admin Page</Button>
        </Link>
        {addNewAction && <Button onClick={addNewAction}>Add {entityName} Manually</Button>}
      </div>
    </div>
  )
}
