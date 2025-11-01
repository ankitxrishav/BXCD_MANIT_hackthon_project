
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MessageSquare, Smile, PenSquare } from "lucide-react"

const activities = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Chat with AI companion",
    time: "2 hours ago",
  },
  {
    icon: <Smile className="h-5 w-5" />,
    description: "Logged mood: Happy",
    time: "1 day ago",
  },
  {
    icon: <PenSquare className="h-5 w-5" />,
    description: "Journal entry completed",
    time: "3 days ago",
  },
    {
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Chat with AI companion",
    time: "4 days ago",
  },
]

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>An overview of your recent interactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                {activity.icon}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium leading-none">{activity.description}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
