import { Building, Users, UserCheck, FileText } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AlertsCard } from "@/components/dashboard/alerts-card"

// Mock data - in a real app, this would come from the database
const mockActivities = [
  {
    id: "1",
    action: "Updated license for",
    entity: "John Smith (Agent)",
    user: "Admin User",
    time: "2 hours ago",
  },
  {
    id: "2",
    action: "Added new",
    entity: "Acme Financial (Firm)",
    user: "Admin User",
    time: "5 hours ago",
  },
  {
    id: "3",
    action: "Approved appointment for",
    entity: "Sarah Johnson (Agent)",
    user: "Admin User",
    time: "Yesterday",
  },
  {
    id: "4",
    action: "Updated status for",
    entity: "Global Advisors (Advisor Firm)",
    user: "Admin User",
    time: "2 days ago",
  },
]

const mockAlerts = [
  {
    id: "1",
    type: "warning",
    message: "License expiring in 30 days",
    entity: "5 Agents",
    link: "/expiring-licenses",
  },
  {
    id: "2",
    type: "warning",
    message: "E&O Insurance expiring soon",
    entity: "3 Agents",
    link: "/expiring-insurance",
  },
  {
    id: "3",
    type: "success",
    message: "Background checks completed",
    entity: "7 Agents",
    link: "/completed-checks",
  },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-semibold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Firms" value="24" icon={<Building />} description="+2 this month" />
        <StatsCard title="Total Agents" value="156" icon={<Users />} description="+12 this month" />
        <StatsCard title="Active Advisors" value="87" icon={<UserCheck />} description="92% active rate" />
        <StatsCard title="Pending Licenses" value="18" icon={<FileText />} description="5 require action" />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <RecentActivity activities={mockActivities} />
        <AlertsCard alerts={mockAlerts} />
      </div>
    </div>
  )
}
