"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileUp, AlertTriangle, CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { processCSVFile, type ValidationResult } from "@/app/actions/process-csv"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function CSVUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ValidationResult[] | null>(null)
  const [summary, setSummary] = useState<{ total: number; licensed: number; needsAppointment: number } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submission triggered", { file })

    if (!file) {
      setError("Please select a CSV file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("csvFile", file)

      const response = await processCSVFile(formData)

      if (response.success) {
        setResults(response.results)
        setSummary(response.summary)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError("An error occurred while processing the file")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const exportToCSV = () => {
    if (!results) return

    // Create CSV content
    const headers = [
      "Policy Number",
      "Agent Name",
      "Agent ID",
      "State",
      "Licensed",
      "License Status",
      "Expiration Date",
      "Needs Appointment",
      "Application Date",
    ]
    const csvRows = [headers]

    results.forEach((result) => {
      csvRows.push([
        result.policyNumber,
        result.agentName,
        result.agentId.toString(),
        result.state,
        result.isLicensed ? "Yes" : "No",
        result.licenseStatus || "N/A",
        result.expirationDate || "N/A",
        result.needsAppointment ? "Yes" : "No",
        result.applicationDate,
      ])
    })

    const csvContent = csvRows.map((row) => row.join(",")).join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "licensing_validation_results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>Upload a CSV file containing policy data to validate agent licensing status</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 bg-gray-50">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop your CSV file here, or click to browse</p>
              <input
                type="file"
                id="csvFile"
                name="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById("csvFile")?.click()}>
                <FileUp className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              {file && <p className="mt-2 text-sm font-medium">Selected file: {file.name}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!file || isUploading}
                onClick={(e) => {
                  e.preventDefault()
                  handleSubmit(e)
                }}
              >
                {isUploading ? "Processing..." : "Validate Licensing"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {results && results.length > 0 && summary && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Validation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold">{summary.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-700">Licensed Agents</p>
                  <p className="text-2xl font-bold text-green-700">{summary.licensed}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-md">
                  <p className="text-sm text-amber-700">Needs Appointment</p>
                  <p className="text-2xl font-bold text-amber-700">{summary.needsAppointment}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Licensing Status</p>
                <Progress value={(summary.licensed / summary.total) * 100} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{Math.round((summary.licensed / summary.total) * 100)}% Licensed</span>
                  <span>{Math.round((summary.needsAppointment / summary.total) * 100)}% Need Appointment</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Policies ({summary.total})</TabsTrigger>
              <TabsTrigger value="licensed">Licensed ({summary.licensed})</TabsTrigger>
              <TabsTrigger value="needs-appointment">Needs Appointment ({summary.needsAppointment})</TabsTrigger>
              <TabsTrigger value="incomplete">
                Incomplete Data ({results.filter((r) => r.licenseStatus === "Incomplete Data").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ResultsTable results={results} />
            </TabsContent>

            <TabsContent value="licensed" className="mt-4">
              <ResultsTable results={results.filter((r) => r.isLicensed)} />
            </TabsContent>

            <TabsContent value="needs-appointment" className="mt-4">
              <ResultsTable results={results.filter((r) => r.needsAppointment)} />
            </TabsContent>

            <TabsContent value="incomplete" className="mt-4">
              <ResultsTable results={results.filter((r) => r.licenseStatus === "Incomplete Data")} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

function ResultsTable({ results }: { results: ValidationResult[] }) {
  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Policy Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action Needed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{result.policyNumber}</td>
                <td className="px-4 py-3 text-sm font-medium">{result.agentName}</td>
                <td className="px-4 py-3 text-sm">{result.agentId}</td>
                <td className="px-4 py-3 text-sm">{result.state}</td>
                <td className="px-4 py-3 text-sm">{new Date(result.applicationDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">
                  {result.licenseStatus ? (
                    <StatusBadge status={result.licenseStatus as any} />
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                      Not Found
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {result.expirationDate ? new Date(result.expirationDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {result.licenseStatus === "Incomplete Data" ? (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-700 font-medium">Missing Required Data</span>
                    </div>
                  ) : result.needsAppointment ? (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-amber-700 font-medium">Needs Appointment</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-700 font-medium">Licensed</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
