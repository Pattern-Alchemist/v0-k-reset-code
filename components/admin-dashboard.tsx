"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, TrendingUp, MessageCircle } from "lucide-react"
import type { AdminStats } from "@/lib/types"

/**
 * Admin Dashboard Component
 *
 * Features:
 * - Platform statistics overview
 * - User engagement metrics
 * - Content management stats
 * - Community moderation overview
 * - System health indicators
 */
export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (!response.ok) throw new Error("Failed to fetch admin stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching admin stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return <div>Loading admin dashboard...</div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+{stats.newUsersThisWeek} this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalModules}</div>
          <p className="text-xs text-muted-foreground">{stats.publishedModules} published</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.engagementRate}%</div>
          <p className="text-xs text-muted-foreground">+{stats.engagementGrowth}% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Learning Pods</CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activePods}</div>
          <p className="text-xs text-muted-foreground">{stats.totalPods} total pods</p>
        </CardContent>
      </Card>
    </div>
  )
}
