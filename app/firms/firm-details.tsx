"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { Building, Users, FileText, Save, Plus, AlertCircle } from "lucide-react"
import { EditableField } from "@/components/editable-field"
import { EditableSelect } from "@/components/editable-select"
import { updateEntity } from "@/app/actions/update-entity"
import { useToast } from "@/hooks/use-toast"
import { InitialAgentSearchModal } from "@/components/modals/initial-agent-search-modal"
import { AgentSearchModal } from "@/components/modals/agent-search-modal"
import { AgentDetailsModal } from "@/components/modals/agent-details-modal"
import { type DistributorSearchResult, type DistributorDetails, createAgentForFirm } from "@/lib/api/agent-api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FirmDetailsProps {
  firm: {
    firm_id: number
    firm_name: string
    firm_external_id: string
    email: string
    tin: string
    firm_npn: string
    status: string
    address?: string
  }
}

interface Agent {
  agent_id: number
  agent_name: string
  agent_external_id: string
  npn: string
  email: string
  resident_state: string
  firm_id: number
  firm_name: string
  status: string
}

export function FirmDetails({ firm }: FirmDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(firm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Agent search and creation state
  const [isInitialSearchModalOpen, setIsInitialSearchModalOpen] = useState(false)
  const [isAgentSearchModalOpen, setIsAgentSearchModalOpen] = useState(false)
  const [isAgentDetailsModalOpen, setIsAgentDetailsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<DistributorSearchResult | null>(null)
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoadingAgents, setIsLoadingAgents] = useState(false)
  const [agentsError, setAgentsError] = useState<string | null>(null)

  // Fetch agents associated with this firm
  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    setIsLoadingAgents(true)
    setAgentsError(null)

    try {
      // In a real implementation, you would fetch agents from the API
      // For now, we'll simulate an empty list or a list with mock data
      const response = await fetch(`/api/firms/${firm.firm_id}/agents`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setAgents(data.agents || [])
    } catch (err) {
      console.error("Error fetching agents:", err)
      setAgentsError("Failed to load agents. Please try again.")
    } finally {
      setIsLoadingAgents(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateEntity("firms", firm.firm_id, formData)

      if (result.success) {
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        })
        setIsEditing(false)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData(firm)
    setIsEditing(false)
  }

  const handleInitialSearch = (term: string) => {
    setSearchTerm(term)
    setIsAgentSearchModalOpen(true)
  }

  const handleAgentSelect = (agent: DistributorSearchResult) => {
    setSelectedAgent(agent)
    setIsAgentSearchModalOpen(false)
    setIsAgentDetailsModalOpen(true)
  }

  const handleAgentConfirm = async (agentDetails: DistributorDetails) => {
    setIsCreatingAgent(true)

    try {
      // Extract relevant information from agent details
      const agentData = {
        firstName: agentDetails.firstName,
        middleName: agentDetails.middleName,
        lastName: agentDetails.lastName,
        nationalProducerNumber: agentDetails.nationalProducerNumber,
        taxId: agentDetails.taxId,
        birthDate: agentDetails.birthDate,
        externalId: agentDetails.distributorSellingAgreementList[0]?.externalId,
        email: agentDetails.distributorSellingAgreementList[0]?.activeDistributorSellingAgreementEmails[0]?.email,
        phone:
          agentDetails.distributorSellingAgreementList[0]?.activeDistributorSellingAgreementPhones[0]?.phone
            .phoneNumber,
        address:
          agentDetails.distributorSellingAgreementList[0]?.activeDistributorSellingAgreementAddresses[0]?.address,
        residentState:
          agentDetails.distributorSellingAgreementList[0]?.activeDistributorSellingAgreementAddresses[0]?.address
            ?.stateCode,
      }

      // Create the agent
      const result = await createAgentForFirm(firm.firm_id, agentData)

      if (result.success) {
        toast({
          variant: "success",
          title: "Success",
          description: "Agent successfully added to firm",
        })

        // Add the new agent to the local state to avoid a full refresh
        if (result.agent) {
          setAgents((prevAgents) => [...prevAgents, result.agent])
        } else {
          // If the agent data isn't returned, refresh the agents list
          fetchAgents()
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to add agent to firm",
        })
      }
    } catch (err) {
      console.error("Error creating agent:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while adding the agent to the firm",
      })
    } finally {
      setIsCreatingAgent(false)
      setIsAgentDetailsModalOpen(false)
      setSelectedAgent(null)
    }
  }

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
    { value: "Review", label: "Review" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-[#007AFF]" />
          <h2 className="text-lg font-medium">{firm.firm_name}</h2>
          <StatusBadge status={firm.status as any} />
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  Save
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 tabs-responsive">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <EditableField
                label="Firm Name"
                name="firm_name"
                value={formData.firm_name}
                onChange={handleChange}
                isEditing={isEditing}
                required
              />
              <EditableField
                label="External ID"
                name="firm_external_id"
                value={formData.firm_external_id}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <EditableField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                isEditing={isEditing}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
              <EditableField
                label="TIN"
                name="tin"
                value={formData.tin}
                onChange={handleChange}
                isEditing={isEditing}
                pattern="\d{2}-\d{7}|\d{9}"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <EditableField
                label="NPN"
                name="firm_npn"
                value={formData.firm_npn}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <EditableSelect
                label="Status"
                name="status"
                value={formData.status}
                options={statusOptions}
                onChange={(value) => handleSelectChange("status", value)}
                isEditing={isEditing}
                required
              />
            </div>
            <EditableField
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              isEditing={isEditing}
            />
          </form>
        </TabsContent>
        <TabsContent value="agents" className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#007AFF]" />
              <h3 className="text-md font-medium">Associated Agents</h3>
            </div>
            <Button className="bg-[#007AFF] hover:bg-[#0056b3]" onClick={() => setIsInitialSearchModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Agent to Firm
            </Button>
          </div>

          {isLoadingAgents ? (
            <div className="rounded-md border p-8 flex justify-center items-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#007AFF] border-t-transparent"></div>
              <span className="ml-2">Loading agents...</span>
            </div>
          ) : agentsError ? (
            <div className="rounded-md border p-4 bg-red-50 text-red-700 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error loading agents</p>
                <p className="text-sm">{agentsError}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={fetchAgents}>
                  Retry
                </Button>
              </div>
            </div>
          ) : agents.length === 0 ? (
            <div className="rounded-md border">
              <div className="p-8 text-center text-muted-foreground">No agents associated with this firm yet.</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>External ID</TableHead>
                    <TableHead>NPN</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Resident State</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.agent_id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{agent.agent_name}</TableCell>
                      <TableCell>{agent.agent_external_id}</TableCell>
                      <TableCell>{agent.npn}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>{agent.resident_state}</TableCell>
                      <TableCell>
                        <StatusBadge status={agent.status as any} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        <TabsContent value="documents" className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-[#007AFF]" />
            <h3 className="text-md font-medium">Documents</h3>
          </div>
          <div className="rounded-md border">
            <div className="p-8 text-center text-muted-foreground">No documents uploaded for this firm yet.</div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Initial Agent Search Modal */}
      <InitialAgentSearchModal
        open={isInitialSearchModalOpen}
        onOpenChange={setIsInitialSearchModalOpen}
        onSearch={handleInitialSearch}
      />

      {/* Agent Search Results Modal */}
      <AgentSearchModal
        open={isAgentSearchModalOpen}
        onOpenChange={setIsAgentSearchModalOpen}
        onAgentSelect={handleAgentSelect}
        initialSearchTerm={searchTerm}
      />

      {/* Agent Details Modal */}
      <AgentDetailsModal
        open={isAgentDetailsModalOpen}
        onOpenChange={setIsAgentDetailsModalOpen}
        selectedAgent={selectedAgent}
        onConfirm={handleAgentConfirm}
      />
    </div>
  )
}
