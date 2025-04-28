import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LicenseDetails } from "../license-details"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"

// Get license data from the database
async function getLicenseById(id: string) {
  try {
    const result = await sql`
      SELECT * FROM licenses WHERE license_id = ${Number.parseInt(id)}
    `

    // Handle different result formats
    const rows = Array.isArray(result) ? result : result?.rows || []
    return rows.length > 0 ? rows[0] : null
  } catch (error) {
    console.error("Error fetching license:", error)
    return null
  }
}

export default async function LicenseDetailsPage({ params }: { params: { id: string } }) {
  const license = await getLicenseById(params.id)

  if (!license) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/licensing" className="inline-flex items-center text-[#007AFF] mb-4 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Licensing
      </Link>
      <div className="bg-white p-8 rounded-md shadow-sm">
        <LicenseDetails license={license} />
      </div>
    </div>
  )
}
