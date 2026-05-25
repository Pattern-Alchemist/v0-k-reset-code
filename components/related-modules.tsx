"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Star, Clock } from "lucide-react"
import Link from "next/link"
import type { Module } from "@/lib/types"

/**
 * Related Modules Component
 *
 * Features:
 * - Display modules related to current module
 * - Recommendation algorithm based on category/tags
 * - Progress indicators
 * - Quick access to related content
 */
interface RelatedModulesProps {
  moduleId: string
}

export function RelatedModules({ moduleId }: RelatedModulesProps) {
  const [relatedModules, setRelatedModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedModules()
  }, [moduleId])

  const fetchRelatedModules = async () => {
    try {
      const response = await fetch(`/api/modules/${moduleId}/related`)
      if (!response.ok) throw new Error("Failed to fetch related modules")
      const data = await response.json()
      setRelatedModules(data)
    } catch (error) {
      console.error("Error fetching related modules:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading related modules...</div>
  }

  if (relatedModules.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Related Modules</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {relatedModules.map((module) => (
          <Card key={module.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base line-clamp-2">{module.title}</CardTitle>
              <CardDescription className="line-clamp-2">{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {module.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {module.difficulty}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {module.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {module.xpReward} XP
                </div>
              </div>

              <Button asChild size="sm" className="w-full">
                <Link href={`/curriculum/${module.id}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Module
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
