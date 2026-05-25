import { Suspense } from "react"
import { CurriculumGrid } from "@/components/curriculum-grid"
import { CurriculumFilters } from "@/components/curriculum-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Curriculum Page Component
 *
 * Features:
 * - Module grid with filtering and sorting
 * - Search functionality
 * - Category and difficulty filters
 * - Gamified module cards with XP and progress
 * - Multiple access channel indicators
 * - Loading states with Suspense
 */
export default function CurriculumPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Curriculum</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive collection of resilience and leadership modules
        </p>
      </div>

      <Suspense fallback={<FiltersSkeleton />}>
        <CurriculumFilters />
      </Suspense>

      <Suspense fallback={<GridSkeleton />}>
        <CurriculumGrid />
      </Suspense>
    </div>
  )
}

function FiltersSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

function GridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full mb-4" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-2 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
