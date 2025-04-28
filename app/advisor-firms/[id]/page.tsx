import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AdvisorFirmDetails } from "../advisor-firm-details"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"

// Get advisor firm data from the database
async function getAdvisorFirmById(id: string) {
  try {
    const result = await sql`
      SELECT af.*, f.firm_name as linked_b2b_partner_firm_name 
      FROM advisor_firms af
      LEFT JOIN firms f ON af.linked_b2b_partner_firm_id = f.firm_id
      WHERE af.advisor_firm_id = ${Number.parseInt(id)}
    `

    // Handle different result formats
    const rows = Array.isArray(result) ? result : result?.rows || []
    return rows.length > 0 ? rows[0] : null
  } catch (error) {
    console.error("Error fetching advisor firm:", error)
    return null
  }
}

export default async function AdvisorFirmDetailsPage({ params }: { params: { id: string } }) {
  const advisorFirm = await getAdvisorFirmById(params.id)

  if (!advisorFirm) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/advisor-firms" className="inline-flex items-center text-[#007AFF] mb-4 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Advisor Firms
      </Link>
      <div className="bg-white p-8 rounded-md shadow-sm">
        <AdvisorFirmDetails advisorFirm={advisorFirm} />
      </div>
    </div>
  )
}
