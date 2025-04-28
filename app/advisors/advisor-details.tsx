"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { User, Building, Calendar, LinkIcon, Save } from "lucide-react"
import { EditableField } from "@/components/editable-field"
import { EditableSelect } from "@/components/editable-select"
import { updateEntity } from "@/app/actions/update-entity"
import { useToast } from "@/hooks/use-toast"

interface AdvisorDetailsProps {
  advisor: {
    advisor_id: number
    advisor_name: string
    advisor_firm_id: number
    advisor_firm_name: string
    linked_b2b_partner_firm_id: number
    linked_b2b_partner_firm_name: string
    email: string
    phone: string
    portal_access_status: string
    portal_account_creation_date: string | null
    last_login_date: string | null
    status: string
  }
}

export function AdvisorDetails({ advisor }: AdvisorDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(advisor)
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
      const result = await updateEntity("advisors", advisor.advisor_id, formData)

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
    setFormData(advisor)
    setIsEditing(false)
  }

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
    { value: "Review", label: "Review" },
  ]

  const portalAccessOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#007AFF]" />
          <h2 className="text-lg font-medium">{advisor.advisor_name}</h2>
          <StatusBadge status={advisor.status as any} />
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
          <TabsTrigger value="portal">Portal Access</TabsTrigger>
          <TabsTrigger value="firm">Firm</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <EditableField
                label="Advisor Name"
                name="advisor_name"
                value={formData.advisor_name}
                onChange={handleChange}
                isEditing={isEditing}
                required
              />
              <EditableField
                label="Advisor Firm"
                name="advisor_firm_name"
                value={formData.advisor_firm_name}
                onChange={handleChange}
                isEditing={isEditing}
                disabled={true}
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
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </div>
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
        <TabsContent value="portal" className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-[#007AFF]" />
            <h3 className="text-md font-medium">Portal Access Information</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground mb-1">Portal Account Creation Date:</p>
              <p className="text-sm font-medium">
                {advisor.portal_account_creation_date
                  ? new Date(advisor.portal_account_creation_date).toLocaleDateString()
                  : "Not created yet"}
              </p>
            </div>
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground mb-1">Last Login Date:</p>
              <p className="text-sm font-medium">
                {advisor.last_login_date ? new Date(advisor.last_login_date).toLocaleDateString() : "Never logged in"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Reset Password
              </Button>
              {advisor.portal_access_status === "Active" ? (
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                  Disable Access
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="text-green-500 border-green-200 hover:bg-green-50">
                  Enable Access
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="firm" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-[#007AFF]" />
              <h3 className="text-md font-medium">Advisor Firm</h3>
            </div>
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-[#007AFF]" />
                <h4 className="text-sm font-medium">{advisor.advisor_firm_name}</h4>
              </div>
              <Button variant="outline" size="sm">
                View Firm Details
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4 mt-6">
              <LinkIcon className="h-5 w-5 text-[#007AFF]" />
              <h3 className="text-md font-medium">Linked B2B Partner Firm</h3>
            </div>
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-[#007AFF]" />
                <h4 className="text-sm font-medium">{advisor.linked_b2b_partner_firm_name}</h4>
              </div>
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
