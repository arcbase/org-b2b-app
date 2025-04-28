"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Save, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ApiConfiguration() {
  const [useMockApi, setUseMockApi] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Load the current setting from localStorage on component mount
  useEffect(() => {
    const storedValue = localStorage.getItem("USE_MOCK_API")
    if (storedValue !== null) {
      setUseMockApi(storedValue === "true")
    } else {
      // Default to false (real API) if not set
      setUseMockApi(false)
      localStorage.setItem("USE_MOCK_API", "false")
    }
  }, [])

  const handleSaveConfig = async () => {
    setIsSaving(true)
    try {
      // Save the setting to localStorage
      localStorage.setItem("USE_MOCK_API", useMockApi.toString())

      // Show success toast
      toast({
        variant: "success",
        title: "Configuration saved",
        description: `API mode set to ${useMockApi ? "Mock API" : "Real API"}`,
      })

      // Reload the page to apply the changes
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Error saving API configuration:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save API configuration",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#007AFF]" />
          API Configuration
        </CardTitle>
        <CardDescription>Configure the API mode for agent search and retrieval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="use-mock-api" className="text-base font-medium">
                Use Mock API
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, the application will use mock data instead of making real API calls
              </p>
            </div>
            <Switch id="use-mock-api" checked={useMockApi} onCheckedChange={setUseMockApi} />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Changing this setting will reload the page. Make sure you have saved any unsaved
              work.
            </p>
          </div>

          <Button onClick={handleSaveConfig} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
