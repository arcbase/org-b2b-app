"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { SlideOver } from "@/components/slide-over"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"

// Mock data - in a real app, this would come from the database
const mockAgents = [
  {
    agent_id: 1,
    agent_name: "John Smith",
    license_state: "CA",
    expiration_date: "2024-05-15",
    days_remaining: 21,
    completion_date: "2024-04-18",
    status: "Active",
  },
  {
    agent_id: 2,
    agent_name: "Sarah Johnson",
    license_state: "NY",
    expiration_date: "2024-05-10",
    days_remaining: 16,
    completion_date: "2024-04-19",
    status: "Active",
  },
  {
    agent_id: 3,
    agent_name: "Michael Brown",
    license_state: "TX",
    expiration_date: "2024-05-05",
    days_remaining: 11,
    completion_date: "2024-04-20",
    status: "Active",
  },
  {
    agent_id: 4,
    agent_name: "Emily Davis",
    license_state: "FL",
    expiration_date: "2024-05-20",
    days_remaining: 26,
    completion_date: "2024-04-17",
    status: "Active",
  },
  {
    agent_id: 5,
    agent_name: "David Wilson",
    license_state: "IL",
    expiration_date: "2024-05-02",
    days_remaining: 8,
    completion_date: "2024-04-16",
    status: "Active",
  },
  {
    agent_id: 6,
    agent_name: "Jennifer Adams",
    license_state: "WA",
    expiration_date: "2024-05-25",
    days_remaining: 31,
    completion_date: "2024-04-15",
    status: "Active",
  },
  {
    agent_id: 7,
    agent_name: "Robert Chen",
    license_state: "OR",
    expiration_date: "2024-05-18",
    days_remaining: 24,
    completion_date: "2024-04-14",
    status: "Active",
  },
]

type Alert = {
  id: string
  type: "warning" | "success"
  message: string
  entity: string
  link?: string
}

interface AlertsCardProps {
  alerts: Alert[]
}

export function AlertsCard({ alerts }: AlertsCardProps) {
  const router = useRouter()

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [slideOverOpen, setSlideOverOpen] = useState(false)

  // We no longer need this function as we're handling clicks directly in the onClick
  // of each alert item

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-4 rounded-lg p-3 ${
                alert.type === "warning" ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"
              } cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => {
                setSelectedAlert(alert)
                setSlideOverOpen(true)
              }}
            >
              {alert.type === "warning" ? (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{alert.message}</p>
                <p className="text-sm text-muted-foreground">{alert.entity}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedAlert && (
          <SlideOver open={slideOverOpen} onClose={() => setSlideOverOpen(false)} title={selectedAlert.message}>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {selectedAlert.type === "warning" ? (
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
                <h2 className="text-lg font-medium">{selectedAlert.message}</h2>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">Affected Entities</h3>
                <p className="text-sm">{selectedAlert.entity}</p>
              </div>

              {selectedAlert.type === "warning" && selectedAlert.message.includes("License") && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Expiring Licenses</h3>
                  <div className="rounded-md border">
                    <div className="p-4 bg-gray-50 border-b">
                      <div className="grid grid-cols-3 gap-4 font-medium text-sm">
                        <div>Agent Name</div>
                        <div>License State</div>
                        <div>Expiration Date</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {mockAgents.slice(0, 5).map((agent) => (
                        <div key={agent.agent_id} className="p-4 hover:bg-gray-50">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="font-medium">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/agents/${agent.agent_id}`)
                                  setSlideOverOpen(false)
                                }}
                                className="text-[#007AFF] hover:underline text-left font-medium"
                              >
                                {agent.agent_name}
                              </button>
                            </div>
                            <div>{agent.license_state}</div>
                            <div>{new Date(agent.expiration_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">Take Action</Button>
                </div>
              )}

              {selectedAlert.type === "warning" && selectedAlert.message.includes("Insurance") && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Expiring E&O Insurance</h3>
                  <div className="rounded-md border">
                    <div className="p-4 bg-gray-50 border-b">
                      <div className="grid grid-cols-3 gap-4 font-medium text-sm">
                        <div>Agent Name</div>
                        <div>Expiration Date</div>
                        <div>Days Remaining</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {mockAgents.slice(0, 3).map((agent) => (
                        <div key={agent.agent_id} className="p-4 hover:bg-gray-50">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="font-medium">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/agents/${agent.agent_id}`)
                                  setSlideOverOpen(false)
                                }}
                                className="text-[#007AFF] hover:underline text-left font-medium"
                              >
                                {agent.agent_name}
                              </button>
                            </div>
                            <div>{new Date(agent.expiration_date).toLocaleDateString()}</div>
                            <div>{agent.days_remaining} days</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">Send Reminders</Button>
                </div>
              )}

              {selectedAlert.type === "success" && selectedAlert.message.includes("Background") && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Completed Background Checks</h3>
                  <div className="rounded-md border">
                    <div className="p-4 bg-gray-50 border-b">
                      <div className="grid grid-cols-3 gap-4 font-medium text-sm">
                        <div>Agent Name</div>
                        <div>Completion Date</div>
                        <div>Status</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {mockAgents.map((agent) => (
                        <div key={agent.agent_id} className="p-4 hover:bg-gray-50">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="font-medium">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/agents/${agent.agent_id}`)
                                  setSlideOverOpen(false)
                                }}
                                className="text-[#007AFF] hover:underline text-left font-medium"
                              >
                                {agent.agent_name}
                              </button>
                            </div>
                            <div>{new Date(agent.completion_date).toLocaleDateString()}</div>
                            <div>
                              <StatusBadge status={agent.status as any} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">View All</Button>
                </div>
              )}

              {selectedAlert.link && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push(selectedAlert.link!)
                      setSlideOverOpen(false)
                    }}
                  >
                    View Full Report
                  </Button>
                </div>
              )}
            </div>
          </SlideOver>
        )}
      </CardContent>
    </Card>
  )
}
