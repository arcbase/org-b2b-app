import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CompletedChecksTable } from "./completed-checks-table"
import { CompletedChecksTableSkeleton } from "./completed-checks-table-skeleton"

export default function CompletedChecksPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-[#007AFF] mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-semibold">Completed Background Checks</h1>
        <p className="text-muted-foreground mt-2">
          The following agents have recently completed their background checks
        </p>
      </div>

      <Suspense fallback={<CompletedChecksTableSkeleton />}>
        <CompletedChecksTable />
      </Suspense>
    </div>
  )
}
