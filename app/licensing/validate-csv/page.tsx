import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CSVUploadForm } from "./csv-upload-form"
import { CSVUploadSkeleton } from "./csv-upload-skeleton"

export default function ValidateCSVPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/licensing" className="inline-flex items-center text-[#007AFF] mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Licensing
        </Link>
        <h1 className="text-3xl font-semibold">Validate Agent Licensing</h1>
        <p className="text-muted-foreground mt-2">
          Upload a CSV file to validate agent licensing status and determine if appointments are needed
        </p>
      </div>

      <Suspense fallback={<CSVUploadSkeleton />}>
        <CSVUploadForm />
      </Suspense>
    </div>
  )
}
