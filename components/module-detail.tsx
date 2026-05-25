"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Download, Star, Clock, Brain, MessageSquare, CheckCircle, Play } from "lucide-react"
import type { Module } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

/**
 * Module Detail Component
 *
 * Features:
 * - Comprehensive module content display
 * - Progress tracking and completion
 * - AI-powered insights (placeholder)
 * - Journaling functionality
 * - PDF download capability
 * - Interactive learning elements
 * - XP earning system
 */
interface ModuleDetailProps {
  moduleId: string
}

export function ModuleDetail({ moduleId }: ModuleDetailProps) {
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [journalEntry, setJournalEntry] = useState("")
  const [currentProgress, setCurrentProgress] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchModule()
  }, [moduleId])

  const fetchModule = async () => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`)
      if (!response.ok) throw new Error("Failed to fetch module")
      const data = await response.json()
      setModule(data)
      setCurrentProgress(data.progress)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load module. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProgressUpdate = async (newProgress: number) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      })

      if (!response.ok) throw new Error("Failed to update progress")

      setCurrentProgress(newProgress)
      toast({
        title: "Progress Updated",
        description: `Module progress updated to ${newProgress}%`,
      })

      // Award XP if module completed
      if (newProgress === 100 && module) {
        toast({
          title: "Module Completed! 🎉",
          description: `You earned ${module.xpReward} XP!`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadPDF = async () => {
    try {
      // TODO: Implement actual PDF generation
      toast({
        title: "PDF Download",
        description: "PDF download will be available soon!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveJournalEntry = async () => {
    try {
      const response = await fetch(`/api/modules/${moduleId}/journal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry: journalEntry }),
      })

      if (!response.ok) throw new Error("Failed to save journal entry")

      toast({
        title: "Journal Saved",
        description: "Your reflection has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading module...</div>
  }

  if (!module) {
    return <div>Module not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{module.title}</h1>
            <p className="text-lg text-muted-foreground">{module.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              onClick={() => handleProgressUpdate(currentProgress < 100 ? currentProgress + 25 : 100)}
              disabled={currentProgress === 100}
            >
              {currentProgress === 100 ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Continue Learning
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Module Meta */}
        <div className="flex flex-wrap gap-2">
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
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {module.estimatedTime}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-3" />
        </div>
      </div>

      {/* Module Content Tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Module Content
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: module.content }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Personalized recommendations based on your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Learning Recommendation</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on your progress, we recommend focusing on practical exercises to reinforce the concepts
                    you've learned.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Strength Areas</h4>
                  <p className="text-sm text-muted-foreground">
                    You show strong understanding in theoretical concepts. Consider applying these to real-world
                    scenarios.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete the reflection exercise and consider discussing your insights with your learning pod.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Learning Journal
              </CardTitle>
              <CardDescription>Reflect on your learning experience and key takeaways</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What did you learn from this module? How will you apply these concepts in your daily life?"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-32"
              />
              <Button onClick={saveJournalEntry} disabled={!journalEntry.trim()}>
                Save Reflection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>Supplementary materials to enhance your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Recommended Reading</h4>
                    <p className="text-sm text-muted-foreground">
                      "Resilience: The Science of Mastering Life's Greatest Challenges"
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Practice Exercises</h4>
                    <p className="text-sm text-muted-foreground">Interactive exercises to reinforce learning</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Start
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Video Tutorial</h4>
                    <p className="text-sm text-muted-foreground">15-minute video explaining key concepts</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Watch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
