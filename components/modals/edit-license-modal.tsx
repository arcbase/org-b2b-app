"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateStateLicense } from "@/app/actions/update-state-license"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { formatDateForInput } from "@/lib/utils/date-helpers"

interface StateLicense {
  id: number
  agent_id: number
  state: string
  status: string
  expiration_date: string | null
  appointment_status: string
}

interface EditLicenseModalProps {
  license: StateLicense
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditLicenseModal({ license, open, onOpenChange, onSuccess }: EditLicenseModalProps) {
  const [formData, setFormData] = useState<Partial<StateLicense>>({
    status: license.status,
    expiration_date: license.expiration_date,
    appointment_status: license.appointment_status,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await updateStateLicense(license.id, formData)

      if (result.success) {
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        })
        onOpenChange(false)
        if (onSuccess) onSuccess()
      } else {
        setError(result.message || "Failed to update license")
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        })
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit License for {license.state}</DialogTitle>
          <DialogDescription>Update the license details for this state.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">License Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Not Appointed">Not Appointed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Input
                id="expiration_date"
                type="date"
                value={formatDateForInput(formData.expiration_date)}
                onChange={(e) => handleChange("expiration_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_status">Appointment Status</Label>
              <Select
                value={formData.appointment_status}
                onValueChange={(value) => handleChange("appointment_status", value)}
              >
                <SelectTrigger id="appointment_status">
                  <SelectValue placeholder="Select appointment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Appointed">Appointed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Not Appointed">Not Appointed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
