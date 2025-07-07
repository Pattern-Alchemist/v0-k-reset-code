"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Flame, Users, BookOpen, MessageCircle } from "lucide-react"
import type { Achievement } from "@/lib/types"

/**
 * Achievements Badges Component
 *
 * Features:
 * - Display earned badges
 * - Progress towards locked achievements
 * - Achievement categories
 * - Visual badge representations
 * - Tooltips with achievement descriptions
 */
export function AchievementsBadges() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements")
      if (!response.ok) throw new Error("Failed to fetch achievements")
      const data = await response.json()
      setAchievements(data)
    } catch (error) {
      console.error("Error fetching achievements:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case "learning":
        return BookOpen
      case "streak":
        return Flame
      case "community":
        return Users
      case "discussion":
        return MessageCircle
      case "milestone":
        return Target
      default:
        return Trophy
    }
  }

  if (loading) {
    return <div>Loading achievements...</div>
  }

  const earnedAchievements = achievements.filter((a) => a.earned)
  const lockedAchievements = achievements.filter((a) => !a.earned)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earned Badges */}
        <div>
          <h4 className="font-medium mb-3">Earned Badges ({earnedAchievements.length})</h4>
          <div className="grid grid-cols-3 gap-3">
            {earnedAchievements.map((achievement) => {
              const IconComponent = getAchievementIcon(achievement.category)
              return (
                <div key={achievement.id} className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{achievement.name}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress Towards Locked Achievements */}
        <div>
          <h4 className="font-medium mb-3">In Progress</h4>
          <div className="space-y-3">
            {lockedAchievements.slice(0, 3).map((achievement) => {
              const IconComponent = getAchievementIcon(achievement.category)
              return (
                <div key={achievement.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Achievement Categories */}
        <div>
          <h4 className="font-medium mb-3">Categories</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Learning ({achievements.filter((a) => a.category === "learning").length})</Badge>
            <Badge variant="outline">Streaks ({achievements.filter((a) => a.category === "streak").length})</Badge>
            <Badge variant="outline">Community ({achievements.filter((a) => a.category === "community").length})</Badge>
            <Badge variant="outline">
              Milestones ({achievements.filter((a) => a.category === "milestone").length})
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
