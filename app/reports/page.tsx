import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, FileText, PieChart, Users } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Reports</h1>
        <p className="text-muted-foreground mt-2">View and generate reports for your operations</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Agents by Status</CardTitle>
                <PieChart className="h-4 w-4 text-[#007AFF]" />
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Chart Visualization</p>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Last updated: Today</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Licenses by State</CardTitle>
                <BarChart className="h-4 w-4 text-[#007AFF]" />
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Chart Visualization</p>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Last updated: Today</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Expiring Licenses</CardTitle>
                <FileText className="h-4 w-4 text-[#007AFF]" />
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Chart Visualization</p>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Last updated: Today</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Reports generated in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <FileText className="h-5 w-5 text-[#007AFF]" />
                    <div>
                      <p className="font-medium">Monthly Agent Status Report</p>
                      <p className="text-sm text-muted-foreground">Generated on April 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-[#007AFF]">View</button>
                    <button className="text-sm text-[#007AFF]">Download</button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <FileText className="h-5 w-5 text-[#007AFF]" />
                    <div>
                      <p className="font-medium">License Expiration Summary</p>
                      <p className="text-sm text-muted-foreground">Generated on April 10, 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-[#007AFF]">View</button>
                    <button className="text-sm text-[#007AFF]">Download</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="h-5 w-5 text-[#007AFF]" />
                    <div>
                      <p className="font-medium">Advisor Portal Activity</p>
                      <p className="text-sm text-muted-foreground">Generated on April 5, 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-[#007AFF]">View</button>
                    <button className="text-sm text-[#007AFF]">Download</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Reports</CardTitle>
              <CardDescription>Generate and view agent-related reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Agent Status Report</CardTitle>
                    <Users className="h-4 w-4 text-[#007AFF]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Summary of all agents by status, firm, and state
                    </p>
                    <button className="text-sm text-[#007AFF]">Generate Report</button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Agent Onboarding</CardTitle>
                    <Users className="h-4 w-4 text-[#007AFF]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Track agent onboarding progress and completion rates
                    </p>
                    <button className="text-sm text-[#007AFF]">Generate Report</button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Agent Compliance</CardTitle>
                    <Users className="h-4 w-4 text-[#007AFF]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Compliance status for AML, E&O, and background checks
                    </p>
                    <button className="text-sm text-[#007AFF]">Generate Report</button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licensing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Licensing Reports</CardTitle>
              <CardDescription>Generate and view licensing-related reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">License Expiration</CardTitle>
                    <FileText className="h-4 w-4 text-[#007AFF]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Licenses expiring in the next 30, 60, and 90 days
                    </p>
                    <button className="text-sm text-[#007AFF]">Generate Report</button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">License by State</CardTitle>
                    <FileText className="h-4 w-4 text-[#007AFF]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Breakdown of licenses by state and status</p>
                    <button className="text-sm text-[#007AFF]">Generate Report</button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Appointment Status</CardTitle>
                    <FileText className="h-4 w-4 text-[#007AFF]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Summary of appointment statuses across all agents
                    </p>
                    <button className="text-sm text-[#007AFF]">Generate Report</button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Create and save custom reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[300px] border-2 border-dashed rounded-md">
                <div className="text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Create Custom Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select data fields and filters to create a custom report
                  </p>
                  <button className="px-4 py-2 bg-[#007AFF] text-white rounded-md hover:bg-[#0056b3]">
                    Create New Report
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
