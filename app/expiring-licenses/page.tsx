import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ExpiringLicensesTable } from "./expiring-licenses-table"
import { ExpiringLicensesTableSkeleton } from "./expiring-licenses-table-skeleton"

export default function ExpiringLicensesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-[#007AFF] mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-semibold">Licenses Expiring in 30 Days</h1>
        <p className="text-muted-foreground mt-2">
          The following agents have licenses that will expire within the next 30 days
        </p>
      </div>

      <Suspense fallback={<ExpiringLicensesTableSkeleton />}>
        <ExpiringLicensesTable />
      </Suspense>
    </div>
  )
}
