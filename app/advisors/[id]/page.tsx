import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AdvisorDetails } from "../advisor-details"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"

// Get advisor data from the database
async function getAdvisorById(id: string) {
  try {
    const result = await sql`
      SELECT a.*, af.advisor_firm_name, f.firm_name as linked_b2b_partner_firm_name
      FROM advisors a
      LEFT JOIN advisor_firms af ON a.advisor_firm_id = af.advisor_firm_id
      LEFT JOIN firms f ON af.linked_b2b_partner_firm_id = f.firm_id
      WHERE a.advisor_id = ${Number.parseInt(id)}
    `

    // Handle different result formats
    const rows = Array.isArray(result) ? result : result?.rows || []
    return rows.length > 0 ? rows[0] : null
  } catch (error) {
    console.error("Error fetching advisor:", error)
    return null
  }
}

export default async function AdvisorDetailsPage({ params }: { params: { id: string } }) {
  const advisor = await getAdvisorById(params.id)

  if (!advisor) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/advisors" className="inline-flex items-center text-[#007AFF] mb-4 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Advisors
      </Link>
      <div className="bg-white p-8 rounded-md shadow-sm">
        <AdvisorDetails advisor={advisor} />
      </div>
    </div>
  )
}
