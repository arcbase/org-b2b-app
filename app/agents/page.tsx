import { getDatabaseAgents } from "@/lib/use-database-agents"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AgentsTable } from "./agents-table"
import { AgentsTableSkeleton } from "./agents-table-skeleton"
import { NoDataMessage } from "@/components/no-data-message"
import { DataFetchError } from "@/components/data-fetch-error"
import { Suspense } from "react"

export default async function AgentsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Agents</h1>
        <Button className="bg-[#007AFF] hover:bg-[#0056b3]">
          <Plus className="mr-2 h-4 w-4" />
          Add New Agent
        </Button>
      </div>

      <Suspense fallback={<AgentsTableSkeleton />}>
        <AgentsTableContent />
      </Suspense>
    </div>
  )
}

async function AgentsTableContent() {
  const agents = await getDatabaseAgents()

  if ("error" in agents) {
    return <DataFetchError error={agents.error} entityName="Agents" />
  }

  if (agents.length === 0) {
    return <NoDataMessage entityName="Agent" entityNamePlural="Agents" />
  }

  return <AgentsTable agents={agents} />
}
