"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { User, Building, Calendar, MapPin, Shield } from "lucide-react"

interface AgentDetailsProps {
  agent: {
    agent_id: number
    agent_name: string
    agent_firm_id: number
    linked_b2b_partner_firm_id: number
    linked_b2b_partner_firm_name: string
    email: string
    phone: string
    portal_access_status: string
    portal_account_creation_date: string | null
    last_login_date: string | null
    status: string
    // Add state licensing information
    state_licenses?: StateLicense[]
  }
}

// Define the state license type
interface StateLicense {
  state: string
  status: "Active" | "Pending" | "Expired" | "Not Appointed"
  expiration_date: string | null
  appointment_status: "Appointed" | "Not Appointed" | "Pending"
}

export function AgentDetails({ agent }: AgentDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(agent)

  // Mock state licensing data if not provided
  const stateLicenses: StateLicense[] = agent.state_licenses || [
    { state: "CA", status: "Active", expiration_date: "2024-12-31", appointment_status: "Appointed" },
    { state: "NY", status: "Active", expiration_date: "2024-10-15", appointment_status: "Appointed" },
    { state: "TX", status: "Active", expiration_date: "2024-11-20", appointment_status: "Appointed" },
    { state: "FL", status: "Pending", expiration_date: null, appointment_status: "Pending" },
    { state: "IL", status: "Not Appointed", expiration_date: null, appointment_status: "Not Appointed" },
    { state: "WA", status: "Expired", expiration_date: "2024-01-15", appointment_status: "Not Appointed" },
    { state: "CO", status: "Active", expiration_date: "2024-09-30", appointment_status: "Not Appointed" },
    { state: "AZ", status: "Not Appointed", expiration_date: null, appointment_status: "Not Appointed" },
    { state: "GA", status: "Active", expiration_date: "2025-02-28", appointment_status: "Appointed" },
    { state: "NC", status: "Not Appointed", expiration_date: null, appointment_status: "Not Appointed" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the data to the database here
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#007AFF]" />
          <h2 className="text-lg font-medium">{agent.agent_name}</h2>
          <StatusBadge status={agent.status as any} />
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 tabs-responsive">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
          <TabsTrigger value="states">State Appointments</TabsTrigger>
          <TabsTrigger value="firm">Firm</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent_name">Agent Name</Label>
                <Input
                  id="agent_name"
                  name="agent_name"
                  value={formData.agent_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linked_b2b_partner_firm_name">B2B Partner Firm</Label>
                <Input
                  id="linked_b2b_partner_firm_name"
                  name="linked_b2b_partner_firm_name"
                  value={formData.linked_b2b_partner_firm_name}
                  onChange={handleChange}
                  disabled={true}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portal_access_status">Portal Access Status</Label>
                <Input
                  id="portal_access_status"
                  name="portal_access_status"
                  value={formData.portal_access_status}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="licensing" className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-[#007AFF]" />
            <h3 className="text-md font-medium">Licensing & Appointments</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#007AFF]" />
                  <h4 className="text-sm font-medium">AML Certification</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Expiry Date:</p>
                <p className="text-sm font-medium">2024-12-31</p>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#007AFF]" />
                  <h4 className="text-sm font-medium">E&O Insurance</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Expiry Date:</p>
                <p className="text-sm font-medium">2024-10-15</p>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#007AFF]" />
                  <h4 className="text-sm font-medium">Appointment Status</h4>
                </div>
                <StatusBadge status="Approved" />
              </div>
              <p className="text-sm text-muted-foreground">Appointment with {agent.linked_b2b_partner_firm_name}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="states" className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-[#007AFF]" />
            <h3 className="text-md font-medium">State Appointments</h3>
          </div>

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
              {stateLicenses.map((license, index) => (
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

          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="mr-2">
              Request New License
            </Button>
            <Button>Request Appointment</Button>
          </div>
        </TabsContent>
        <TabsContent value="firm" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-[#007AFF]" />
              <h3 className="text-md font-medium">B2B Partner Firm</h3>
            </div>
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-[#007AFF]" />
                <h4 className="text-sm font-medium">{agent.linked_b2b_partner_firm_name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This agent is directly associated with {agent.linked_b2b_partner_firm_name}.
              </p>
              <Button variant="outline" size="sm">
                View Partner Firm Details
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
