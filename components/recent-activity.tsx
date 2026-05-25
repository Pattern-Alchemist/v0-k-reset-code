"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MessageCircle, Trophy, Users, Clock } from "lucide-react"
import type { Activity } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

/**
 * Recent Activity Component
 *
 * Features:
 * - Timeline of user activities
 * - Module completions
 * - Community interactions
 * - Achievement unlocks
 * - Relative timestamps
 */
export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/activity")
      if (!response.ok) throw new Error("Failed to fetch activity")
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error("Error fetching activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "module_completed":
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case "achievement_unlocked":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "pod_joined":
        return <Users className="h-4 w-4 text-green-500" />
      case "discussion_posted":
        return <MessageCircle className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return <div>Loading activity...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                  {activity.xpEarned && (
                    <Badge variant="outline" className="text-xs">
                      +{activity.xpEarned} XP
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
