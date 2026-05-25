"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, Flame, Trophy, BookOpen, Users, Star } from "lucide-react"
import type { UserProgress } from "@/lib/types"

/**
 * Progress Dashboard Component
 *
 * Features:
 * - User level and XP display
 * - Learning streak tracking
 * - Progress statistics
 * - Achievement overview
 * - Weekly/monthly goals
 * - Gamification elements
 */
export function ProgressDashboard() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProgress()
  }, [])

  const fetchUserProgress = async () => {
    try {
      const response = await fetch("/api/progress")
      if (!response.ok) throw new Error("Failed to fetch progress")
      const data = await response.json()
      setUserProgress(data)
    } catch (error) {
      console.error("Error fetching progress:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !userProgress) {
    return <div>Loading progress...</div>
  }

  const progressToNextLevel = ((userProgress.currentXP % 1000) / 1000) * 100

  return (
    <div className="space-y-6">
      {/* Level and XP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Level {userProgress.level}
          </CardTitle>
          <CardDescription>{1000 - (userProgress.currentXP % 1000)} XP to next level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userProgress.level + 1}</span>
              <span>{Math.round(progressToNextLevel)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{userProgress.currentXP % 1000} XP</span>
              <span>1000 XP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{userProgress.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{userProgress.modulesCompleted}</p>
                <p className="text-sm text-muted-foreground">Modules Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{userProgress.totalXP}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{userProgress.podRank}</p>
                <p className="text-sm text-muted-foreground">Pod Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Complete 3 modules</span>
              <span>{userProgress.weeklyGoals.modulesCompleted}/3</span>
            </div>
            <Progress value={(userProgress.weeklyGoals.modulesCompleted / 3) * 100} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Maintain 7-day streak</span>
              <span>{Math.min(userProgress.currentStreak, 7)}/7</span>
            </div>
            <Progress value={(Math.min(userProgress.currentStreak, 7) / 7) * 100} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Participate in pod discussions</span>
              <span>{userProgress.weeklyGoals.podParticipation}/5</span>
            </div>
            <Progress value={(userProgress.weeklyGoals.podParticipation / 5) * 100} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
