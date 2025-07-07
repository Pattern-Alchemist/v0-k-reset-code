"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star, Download, MessageCircle, Smartphone, Globe } from "lucide-react"
import Link from "next/link"
import type { Module } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

/**
 * Curriculum Grid Component
 *
 * Features:
 * - Displays modules in a responsive grid
 * - Shows XP, progress, and difficulty
 * - Multiple access channel indicators
 * - Gamification elements (badges, progress bars)
 * - Quick actions for each module
 * - Loading and error states
 */
export function CurriculumGrid() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules")
      if (!response.ok) throw new Error("Failed to fetch modules")
      const data = await response.json()
      setModules(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load modules. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading modules...</div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  )
}

function ModuleCard({ module }: { module: Module }) {
  const { toast } = useToast()

  const handleQuickAccess = (channel: string) => {
    toast({
      title: `Opening in ${channel}`,
      description: `Module "${module.title}" will open in ${channel}`,
    })
    // TODO: Implement actual channel integrations
  }

  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {module.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{module.description}</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {module.estimatedTime}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary">{module.category}</Badge>
          <Badge
            variant={
              module.difficulty === "Beginner"
                ? "default"
                : module.difficulty === "Intermediate"
                  ? "secondary"
                  : "destructive"
            }
          >
            {module.difficulty}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {module.xpReward} XP
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{module.progress}%</span>
          </div>
          <Progress value={module.progress} className="h-2" />
        </div>

        {/* Access Channels */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Access via:</span>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => handleQuickAccess("Web")}
              title="Access on Web"
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => handleQuickAccess("WhatsApp")}
              title="Access via WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => handleQuickAccess("Mobile")}
              title="Access on Mobile"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => handleQuickAccess("PDF")}
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Action */}
        <Button asChild className="w-full">
          <Link href={`/curriculum/${module.id}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            {module.progress > 0 ? "Continue Learning" : "Start Module"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
