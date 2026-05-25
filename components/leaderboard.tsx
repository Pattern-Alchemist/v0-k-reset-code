"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, TrendingUp, Users, Calendar } from "lucide-react"
import type { LeaderboardEntry } from "@/lib/types"

/**
 * Leaderboard Component
 *
 * Features:
 * - Weekly and monthly leaderboards
 * - XP and level rankings
 * - Pod-based rankings
 * - Achievement counts
 * - User position highlighting
 */
export function Leaderboard() {
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  const fetchLeaderboards = async () => {
    try {
      const [weeklyResponse, monthlyResponse] = await Promise.all([
        fetch("/api/leaderboard/weekly"),
        fetch("/api/leaderboard/monthly"),
      ])

      if (!weeklyResponse.ok || !monthlyResponse.ok) {
        throw new Error("Failed to fetch leaderboards")
      }

      const weeklyData = await weeklyResponse.json()
      const monthlyData = await monthlyResponse.json()

      setWeeklyLeaderboard(weeklyData)
      setMonthlyLeaderboard(monthlyData)
    } catch (error) {
      console.error("Error fetching leaderboards:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const LeaderboardList = ({ entries }: { entries: LeaderboardEntry[] }) => (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={entry.userId}
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            entry.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
          }`}
        >
          <div className="flex-shrink-0 w-8 flex justify-center">{getRankIcon(index + 1)}</div>

          <Avatar className="w-10 h-10">
            <AvatarImage src={entry.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {entry.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{entry.name}</p>
              {entry.isCurrentUser && (
                <Badge variant="outline" className="text-xs">
                  You
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Level {entry.level}</span>
              <span>•</span>
              <span>{entry.xp} XP</span>
              {entry.podName && (
                <>
                  <span>•</span>
                  <span>{entry.podName}</span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-primary">{entry.weeklyXP || entry.monthlyXP}</div>
            <div className="text-xs text-muted-foreground">{entry.weeklyXP ? "Weekly XP" : "Monthly XP"}</div>
          </div>
        </div>
      ))}
    </div>
  )

  if (loading) {
    return <div>Loading leaderboard...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <LeaderboardList entries={weeklyLeaderboard} />
          </TabsContent>

          <TabsContent value="monthly">
            <LeaderboardList entries={monthlyLeaderboard} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
