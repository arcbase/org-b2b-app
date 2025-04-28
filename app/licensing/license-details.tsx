"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { Calendar, Shield, User, Building } from "lucide-react"

interface LicenseDetailsProps {
  license: {
    license_id: number
    agent_name: string
    agent_id: number
    firm_name: string
    firm_id: number
    license_state: string
    license_expiration_date: string
    status: string
    actionable_alerts: string | null
  }
}

export function LicenseDetails({ license }: LicenseDetailsProps) {
  const expirationDate = new Date(license.license_expiration_date)
  const today = new Date()
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const isExpiringSoon = daysUntilExpiration <= 30 && daysUntilExpiration > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#007AFF]" />
          <h2 className="text-lg font-medium">{license.license_state} License</h2>
          <StatusBadge status={license.status as any} />
        </div>
        <Button>Renew License</Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-md border p-4">
          <User className="h-5 w-5 text-[#007AFF]" />
          <div>
            <p className="text-sm text-muted-foreground">Agent</p>
            <p className="font-medium">{license.agent_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border p-4">
          <Building className="h-5 w-5 text-[#007AFF]" />
          <div>
            <p className="text-sm text-muted-foreground">Firm</p>
            <p className="font-medium">{license.firm_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border p-4">
          <Calendar className="h-5 w-5 text-[#007AFF]" />
          <div>
            <p className="text-sm text-muted-foreground">Expiration Date</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">{new Date(license.license_expiration_date).toLocaleDateString()}</p>
              {isExpiringSoon && (
                <div className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Expires in {daysUntilExpiration} days
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 tabs-responsive">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-md border p-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">License Approved</p>
                <p className="text-xs text-muted-foreground">Jan 15, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">License Requested</p>
                <p className="text-xs text-muted-foreground">Jan 10, 2024</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
