"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, UserPlus, Calendar, Megaphone, Heart, Share } from "lucide-react"

/**
 * Community Hub Component
 *
 * Features:
 * - Quick community actions
 * - Referral system
 * - Community events
 * - Social features
 * - Engagement tools
 */
export function CommunityHub() {
  const handleReferFriend = () => {
    // TODO: Implement referral system
    navigator.clipboard.writeText("https://k-reset.app/invite/abc123")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Community Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <MessageCircle className="mr-2 h-4 w-4" />
          Join Global Chat
        </Button>

        <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleReferFriend}>
          <UserPlus className="mr-2 h-4 w-4" />
          Refer a Friend
        </Button>

        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Upcoming Events
        </Button>

        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Megaphone className="mr-2 h-4 w-4" />
          Community Updates
        </Button>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active Members</span>
              <Badge variant="secondary">1,247</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Learning Pods</span>
              <Badge variant="secondary">89</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed Missions</span>
              <Badge variant="secondary">156</Badge>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Community Love</h4>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>2.1k</span>
            </div>
            <div className="flex items-center gap-1">
              <Share className="h-4 w-4 text-blue-500" />
              <span>847</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span>3.2k</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
