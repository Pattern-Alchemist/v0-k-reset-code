"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Users, Plus, MessageCircle, UserPlus, Crown, Calendar } from "lucide-react"
import type { LearningPod } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

/**
 * Learning Pods Component
 *
 * Features:
 * - Display user's learning pods
 * - Create new pods
 * - Join existing pods
 * - View pod members
 * - Pod activity tracking
 * - Invite system
 */
export function LearningPods() {
  const [pods, setPods] = useState<LearningPod[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteCode, setInviteCode] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchLearningPods()
  }, [])

  const fetchLearningPods = async () => {
    try {
      const response = await fetch("/api/pods")
      if (!response.ok) throw new Error("Failed to fetch pods")
      const data = await response.json()
      setPods(data)
    } catch (error) {
      console.error("Error fetching pods:", error)
    } finally {
      setLoading(false)
    }
  }

  const createPod = async () => {
    try {
      const response = await fetch("/api/pods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Learning Pod" }),
      })

      if (!response.ok) throw new Error("Failed to create pod")

      toast({
        title: "Pod Created",
        description: "Your new learning pod has been created successfully!",
      })

      fetchLearningPods()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create pod. Please try again.",
        variant: "destructive",
      })
    }
  }

  const joinPod = async () => {
    if (!inviteCode.trim()) return

    try {
      const response = await fetch("/api/pods/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      })

      if (!response.ok) throw new Error("Failed to join pod")

      toast({
        title: "Pod Joined",
        description: "You have successfully joined the learning pod!",
      })

      setInviteCode("")
      fetchLearningPods()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join pod. Please check the invite code.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading learning pods...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Learning Pods
            </CardTitle>
            <CardDescription>Collaborate and learn with your peers</CardDescription>
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Pod
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Learning Pod</DialogTitle>
                  <DialogDescription>Enter the invite code to join an existing learning pod</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter invite code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                  <Button onClick={joinPod} className="w-full">
                    Join Pod
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={createPod} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Pod
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {pods.map((pod) => (
            <Card key={pod.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{pod.name}</h4>
                      <p className="text-sm text-muted-foreground">{pod.members.length} members</p>
                    </div>
                    <Badge variant={pod.isActive ? "default" : "secondary"}>
                      {pod.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex -space-x-2">
                    {pod.members.slice(0, 5).map((member, index) => (
                      <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {pod.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{pod.members.length - 5}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last active {pod.lastActivity}
                    </div>
                    {pod.isLeader && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Crown className="h-3 w-3" />
                        Leader
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Open Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pods.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Learning Pods Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create or join a learning pod to start collaborating with peers
            </p>
            <Button onClick={createPod}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Pod
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
