"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, AlertTriangle, CheckCircle, X, MessageCircle, Users } from "lucide-react"
import type { ModerationItem } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

/**
 * Community Moderation Component
 *
 * Features:
 * - Content moderation queue
 * - User management tools
 * - Pod moderation
 * - Report handling
 * - Automated moderation alerts
 */
export function CommunityModeration() {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchModerationItems()
  }, [])

  const fetchModerationItems = async () => {
    try {
      const response = await fetch("/api/admin/moderation")
      if (!response.ok) throw new Error("Failed to fetch moderation items")
      const data = await response.json()
      setModerationItems(data)
    } catch (error) {
      console.error("Error fetching moderation items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerationAction = async (itemId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/admin/moderation/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) throw new Error("Failed to process moderation action")

      toast({
        title: "Action Completed",
        description: `Item has been ${action}d successfully.`,
      })

      fetchModerationItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process moderation action. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user_report":
        return <AlertTriangle className="h-4 w-4" />
      case "content_flag":
        return <MessageCircle className="h-4 w-4" />
      case "pod_issue":
        return <Users className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div>Loading moderation queue...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Community Moderation
        </CardTitle>
        <CardDescription>Review and moderate community content and user reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {moderationItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="flex-shrink-0 mt-1">{getTypeIcon(item.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{item.title}</h4>
                  <Badge variant={getPriorityColor(item.priority)}>{item.priority} priority</Badge>
                  <Badge variant="outline">{item.type.replace("_", " ")}</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

                {item.reportedUser && (
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={item.reportedUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {item.reportedUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Reported user: {item.reportedUser.name}</span>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Reported {item.createdAt} by {item.reporterName}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleModerationAction(item.id, "approve")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleModerationAction(item.id, "reject")}>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>

        {moderationItems.length === 0 && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Items to Review</h3>
            <p className="text-sm text-muted-foreground">All community content is up to date and properly moderated</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
