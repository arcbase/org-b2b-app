import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ExpiringInsuranceTable } from "./expiring-insurance-table"
import { ExpiringInsuranceTableSkeleton } from "./expiring-insurance-table-skeleton"

export default function ExpiringInsurancePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-[#007AFF] mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-semibold">E&O Insurance Expiring Soon</h1>
        <p className="text-muted-foreground mt-2">
          The following agents have E&O insurance policies that will expire soon
        </p>
      </div>

      <Suspense fallback={<ExpiringInsuranceTableSkeleton />}>
        <ExpiringInsuranceTable />
      </Suspense>
    </div>
  )
}
