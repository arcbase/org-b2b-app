import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Activity = {
  id: string
  action: string
  entity: string
  user: string
  time: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.action} <span className="font-semibold">{activity.entity}</span>
                </p>
                <p className="text-sm text-muted-foreground">By {activity.user}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
