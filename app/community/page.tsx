import { Suspense } from "react"
import { CommunityHub } from "@/components/community-hub"
import { LearningPods } from "@/components/learning-pods"
import { Leaderboard } from "@/components/leaderboard"
import { GroupMissions } from "@/components/group-missions"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Community Page Component
 *
 * Features:
 * - Learning pods with member management
 * - Group missions and challenges
 * - Community leaderboard
 * - Peer chat and messaging
 * - Referral and invite system
 * - Community events and activities
 */
export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with fellow learners, join pods, and participate in group challenges
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<LearningPodsSkeleton />}>
            <LearningPods />
          </Suspense>

          <Suspense fallback={<GroupMissionsSkeleton />}>
            <GroupMissions />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<LeaderboardSkeleton />}>
            <Leaderboard />
          </Suspense>

          <Suspense fallback={<CommunityHubSkeleton />}>
            <CommunityHub />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function LearningPodsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-3" />
                <div className="flex -space-x-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-8 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function GroupMissionsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function LeaderboardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CommunityHubSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
