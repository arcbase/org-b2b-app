import { getFirmById } from "@/lib/use-database-firms"
import { FirmDetails } from "@/app/firms/firm-details"
import { notFound } from "next/navigation"

interface FirmPageProps {
  params: {
    id: string
  }
}

export default async function FirmPage({ params }: FirmPageProps) {
  const firmId = Number.parseInt(params.id, 10)

  if (isNaN(firmId)) {
    notFound()
  }

  const firm = await getFirmById(firmId)

  if (!firm || "error" in firm) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <FirmDetails firm={firm} />
    </div>
  )
}
