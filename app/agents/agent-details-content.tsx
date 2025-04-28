"use client"

import { ArrowLeft, User, Building, Shield } from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AgentDetailsContentProps {
  agent: {
    agent_id: number
    agent_name: string
    agent_external_id: string
    npn: string
    email: string
    resident_state: string
    firm_name: string
    firm_id: number
    status: string
    phone: string
    residential_address: string
    business_address: string
    aml_expiry_date: string
    eo_expiry_date: string
    appointment_status: string
    advisor_firm_name: string
    linked_b2b_partner_firm_name: string
    portal_access_status: string
    portal_account_creation_date: string | null
    last_login_date: string | null
    state_licenses?: StateLicense[]
  }
}

// Define the state license type
interface StateLicense {
  id: number
  state: string
  status: "Active" | "Pending" | "Expired" | "Not Appointed"
  expiration_date: string | null
  appointment_status: "Appointed" | "Not Appointed" | "Pending"
}

export function AgentDetailsContent({ agent }: AgentDetailsContentProps) {
  return (
    <div className="space-y-6">
      <Link href="/agents" className="inline-flex items-center text-[#007AFF] hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Agents
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#007AFF]" />
          <h1 className="text-2xl font-semibold">{agent.agent_name}</h1>
          <StatusBadge status={agent.status as any} className="text-sm px-3 py-1" />
        </div>
        <Button>Edit Agent</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Information Card */}
        <div className="bg-white p-6 rounded-md shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-[#007AFF]" />
            <h2 className="text-lg font-medium">Basic Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">External ID</p>
              <p className="font-medium">{agent.agent_external_id}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">NPN</p>
              <p className="font-medium">{agent.npn}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{agent.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{agent.phone}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Resident State</p>
              <p className="font-medium">{agent.resident_state}</p>
            </div>
          </div>
        </div>

        {/* Firm Information Card */}
        <div className="bg-white p-6 rounded-md shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-[#007AFF]" />
            <h2 className="text-lg font-medium">Firm Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Advisor Firm</p>
              <p className="font-medium">{agent.advisor_firm_name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">B2B Partner Firm</p>
              <p className="font-medium">{agent.linked_b2b_partner_firm_name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Appointment Status</p>
              <div className="mt-1">
                <StatusBadge status={agent.appointment_status as any} />
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Information Card */}
        <div className="bg-white p-6 rounded-md shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-[#007AFF]" />
            <h2 className="text-lg font-medium">Compliance Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">AML Expiry Date</p>
              <p className="font-medium">{new Date(agent.aml_expiry_date).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">E&O Expiry Date</p>
              <p className="font-medium">{new Date(agent.eo_expiry_date).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Portal Access</p>
              <div className="mt-1">
                <StatusBadge status={agent.portal_access_status as any} />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="font-medium">
                {agent.last_login_date ? new Date(agent.last_login_date).toLocaleDateString() : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="state-appointments">State Appointments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-md shadow-sm border">
                <h3 className="text-lg font-medium mb-4">Residential Address</h3>
                <p>{agent.residential_address}</p>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm border">
                <h3 className="text-lg font-medium mb-4">Business Address</h3>
                <p>{agent.business_address}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="state-appointments" className="pt-6">
            <div className="bg-white p-6 rounded-md shadow-sm border">
              <h3 className="text-lg font-medium mb-4">State Appointments</h3>

              {agent.state_licenses && agent.state_licenses.length > 0 ? (
                <div className="rounded-md border">
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="grid grid-cols-4 gap-4 font-medium text-sm">
                      <div>State</div>
                      <div>License Status</div>
                      <div>Expiration Date</div>
                      <div>Appointment Status</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {agent.state_licenses.map((license, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="font-medium">{license.state}</div>
                          <div>
                            <StatusBadge status={license.status} />
                          </div>
                          <div>
                            {license.expiration_date ? (
                              <span>
                                {new Date(license.expiration_date).toLocaleDateString()}
                                {new Date(license.expiration_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) &&
                                  new Date(license.expiration_date) > new Date() && (
                                    <span className="ml-2 text-amber-600 text-xs">(Expiring soon)</span>
                                  )}
                              </span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </div>
                          <div>
                            {license.appointment_status === "Appointed" ? (
                              <span className="text-green-600 font-medium">Appointed</span>
                            ) : license.appointment_status === "Pending" ? (
                              <span className="text-amber-600 font-medium">Pending</span>
                            ) : (
                              <span className="text-gray-500">Not Appointed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No state appointments found for this agent.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="pt-6">
            <div className="bg-white p-6 rounded-md shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Documents</h3>
              <p className="text-muted-foreground">No documents uploaded for this agent yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="pt-6">
            <div className="bg-white p-6 rounded-md shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Activity History</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Agent status changed to Active</p>
                    <p className="text-xs text-muted-foreground">Apr 10, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New license added for NY state</p>
                    <p className="text-xs text-muted-foreground">Mar 15, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
