import { Suspense } from "react"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ModuleManagement } from "@/components/module-management"
import { CommunityModeration } from "@/components/community-moderation"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield } from "lucide-react"

/**
 * Admin Page Component
 *
 * Features:
 * - Module CRUD operations
 * - Category management
 * - Community moderation tools
 * - User management
 * - Analytics and reporting
 * - Role-based access control
 *
 * Note: In production, this should be protected by authentication
 * and role-based access control middleware
 */
export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage curriculum, community, and platform settings</p>
        </div>
      </div>

      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboard />
      </Suspense>

      <div className="grid lg:grid-cols-2 gap-6">
        <Suspense fallback={<ModuleManagementSkeleton />}>
          <ModuleManagement />
        </Suspense>

        <Suspense fallback={<CommunityModerationSkeleton />}>
          <CommunityModeration />
        </Suspense>
      </div>
    </div>
  )
}

function AdminDashboardSkeleton() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
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

function ModuleManagementSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded">
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CommunityModerationSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
