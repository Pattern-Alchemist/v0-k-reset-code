import { Suspense } from "react"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { RecentActivity } from "@/components/recent-activity"
import { AchievementsBadges } from "@/components/achievements-badges"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Progress Page Component
 *
 * Features:
 * - User level and XP display
 * - Learning streaks tracking
 * - Achievement badges showcase
 * - Recent activity feed
 * - Progress statistics
 * - Gamification elements
 */
export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and celebrate your achievements</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<ProgressDashboardSkeleton />}>
            <ProgressDashboard />
          </Suspense>

          <Suspense fallback={<RecentActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<AchievementsSkeleton />}>
            <AchievementsBadges />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProgressDashboardSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecentActivitySkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function AchievementsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-2" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
