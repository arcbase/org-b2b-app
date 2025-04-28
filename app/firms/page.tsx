import { getDatabaseFirms } from "@/lib/use-database-firms"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FirmsTable } from "./firms-table"
import { FirmsTableSkeleton } from "./firms-table-skeleton"
import { NoDataMessage } from "@/components/no-data-message"
import { DataFetchError } from "@/components/data-fetch-error"
import { Suspense } from "react"

export default async function FirmsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Firms</h1>
        <Button className="bg-[#007AFF] hover:bg-[#0056b3]">
          <Plus className="mr-2 h-4 w-4" />
          Add New Firm
        </Button>
      </div>

      <Suspense fallback={<FirmsTableSkeleton />}>
        <FirmsTableContent />
      </Suspense>
    </div>
  )
}

async function FirmsTableContent() {
  const firms = await getDatabaseFirms()

  if ("error" in firms) {
    return <DataFetchError error={firms.error} entityName="Firms" />
  }

  if (firms.length === 0) {
    return <NoDataMessage entityName="Firm" entityNamePlural="Firms" />
  }

  return <FirmsTable firms={firms} />
}
