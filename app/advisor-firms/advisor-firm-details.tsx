"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { Building, Users, LinkIcon, Save } from "lucide-react"
import { EditableField } from "@/components/editable-field"
import { EditableSelect } from "@/components/editable-select"
import { updateEntity } from "@/app/actions/update-entity"
import { useToast } from "@/hooks/use-toast"

interface AdvisorFirmDetailsProps {
  advisorFirm: {
    advisor_firm_id: number
    advisor_firm_name: string
    firm_external_id: string
    linked_b2b_partner_firm_id: number
    linked_b2b_partner_firm_name: string
    primary_contact_name: string
    primary_contact_email: string
    phone: string
    address: string
    advisors_count: number
    status: string
    portal_access_status: string
  }
}

export function AdvisorFirmDetails({ advisorFirm }: AdvisorFirmDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(advisorFirm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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
      const result = await updateEntity("advisor-firms", advisorFirm.advisor_firm_id, formData)

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
    setFormData(advisorFirm)
    setIsEditing(false)
  }

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
    { value: "Review", label: "Review" },
  ]

  const portalAccessOptions = [
    { value: "Enabled", label: "Enabled" },
    { value: "Disabled", label: "Disabled" },
    { value: "Pending", label: "Pending" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-[#007AFF]" />
          <h2 className="text-lg font-medium">{advisorFirm.advisor_firm_name}</h2>
          <StatusBadge status={advisorFirm.status as any} />
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
          <TabsTrigger value="advisors">Advisors</TabsTrigger>
          <TabsTrigger value="partner">Partner Firm</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <EditableField
                label="Advisor Firm Name"
                name="advisor_firm_name"
                value={formData.advisor_firm_name}
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
                label="Primary Contact"
                name="primary_contact_name"
                value={formData.primary_contact_name}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <EditableField
                label="Email"
                name="primary_contact_email"
                type="email"
                value={formData.primary_contact_email}
                onChange={handleChange}
                isEditing={isEditing}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <EditableField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <EditableField
                label="Advisors Count"
                name="advisors_count"
                type="number"
                value={formData.advisors_count.toString()}
                onChange={handleChange}
                isEditing={isEditing}
                min={0}
              />
            </div>
            <EditableField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              isEditing={isEditing}
            />
            <div className="grid grid-cols-2 gap-4">
              <EditableSelect
                label="Status"
                name="status"
                value={formData.status}
                options={statusOptions}
                onChange={(value) => handleSelectChange("status", value)}
                isEditing={isEditing}
                required
              />
              <EditableSelect
                label="Portal Access Status"
                name="portal_access_status"
                value={formData.portal_access_status}
                options={portalAccessOptions}
                onChange={(value) => handleSelectChange("portal_access_status", value)}
                isEditing={isEditing}
              />
            </div>
          </form>
        </TabsContent>
        <TabsContent value="advisors" className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-[#007AFF]" />
            <h3 className="text-md font-medium">Associated Advisors</h3>
          </div>
          <div className="rounded-md border">
            {advisorFirm.advisors_count > 0 ? (
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  This advisor firm has {advisorFirm.advisors_count} associated advisors.
                </p>
                <Button variant="outline" size="sm">
                  View All Advisors
                </Button>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">No advisors associated with this firm yet.</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="partner" className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="h-5 w-5 text-[#007AFF]" />
            <h3 className="text-md font-medium">Linked B2B Partner Firm</h3>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-[#007AFF]" />
              <h4 className="text-sm font-medium">{advisorFirm.linked_b2b_partner_firm_name}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This advisor firm is linked to {advisorFirm.linked_b2b_partner_firm_name} as their B2B partner.
            </p>
            <Button variant="outline" size="sm">
              View Partner Firm Details
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
