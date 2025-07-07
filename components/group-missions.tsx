"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Users, Clock, Trophy, CheckCircle, Play } from "lucide-react"
import type { GroupMission } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

/**
 * Group Missions Component
 *
 * Features:
 * - Display active group missions
 * - Mission progress tracking
 * - Team collaboration features
 * - Reward system
 * - Mission completion status
 */
export function GroupMissions() {
  const [missions, setMissions] = useState<GroupMission[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchGroupMissions()
  }, [])

  const fetchGroupMissions = async () => {
    try {
      const response = await fetch("/api/missions")
      if (!response.ok) throw new Error("Failed to fetch missions")
      const data = await response.json()
      setMissions(data)
    } catch (error) {
      console.error("Error fetching missions:", error)
    } finally {
      setLoading(false)
    }
  }

  const joinMission = async (missionId: string) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/join`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to join mission")

      toast({
        title: "Mission Joined",
        description: "You have successfully joined the group mission!",
      })

      fetchGroupMissions()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join mission. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getMissionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "upcoming":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return <div>Loading group missions...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Group Missions
        </CardTitle>
        <CardDescription>Collaborate with your pod to complete challenges and earn rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missions.map((mission) => (
            <Card key={mission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{mission.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{mission.description}</p>
                    </div>
                    <Badge variant={getMissionStatusColor(mission.status)}>{mission.status}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {mission.participants}/{mission.maxParticipants} participants
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {mission.timeRemaining}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {mission.xpReward} XP
                    </div>
                  </div>

                  {mission.status === "active" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{mission.progress}%</span>
                      </div>
                      <Progress value={mission.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mission.podName && (
                        <Badge variant="outline" className="text-xs">
                          Pod: {mission.podName}
                        </Badge>
                      )}
                      {mission.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {mission.difficulty}
                        </Badge>
                      )}
                    </div>

                    {mission.status === "active" && !mission.isParticipant && (
                      <Button
                        size="sm"
                        onClick={() => joinMission(mission.id)}
                        disabled={mission.participants >= mission.maxParticipants}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Join Mission
                      </Button>
                    )}

                    {mission.status === "completed" && (
                      <Button size="sm" variant="outline" disabled>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Completed
                      </Button>
                    )}

                    {mission.isParticipant && mission.status === "active" && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {missions.length === 0 && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Active Missions</h3>
            <p className="text-sm text-muted-foreground">New group missions will appear here when available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
