import { Suspense } from "react"
import { ModuleDetail } from "@/components/module-detail"
import { RelatedModules } from "@/components/related-modules"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Module Detail Page Component
 *
 * Features:
 * - Detailed module content display
 * - Progress tracking and XP earning
 * - AI-powered insights (placeholder)
 * - Journaling functionality
 * - PDF download capability
 * - Related modules suggestions
 * - Multiple access channel options
 */
interface ModulePageProps {
  params: {
    id: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  return (
    <div className="space-y-8">
      <Suspense fallback={<ModuleDetailSkeleton />}>
        <ModuleDetail moduleId={params.id} />
      </Suspense>

      <Suspense fallback={<RelatedModulesSkeleton />}>
        <RelatedModules moduleId={params.id} />
      </Suspense>
    </div>
  )
}

function ModuleDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>

      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  )
}

function RelatedModulesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
