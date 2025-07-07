"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, BookOpen, Clock } from "lucide-react"
import type { Module } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

/**
 * Module Management Component
 *
 * Features:
 * - CRUD operations for modules
 * - Module status management
 * - Content editing interface
 * - Publishing workflow
 * - Analytics integration
 */
export function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/admin/modules")
      if (!response.ok) throw new Error("Failed to fetch modules")
      const data = await response.json()
      setModules(data)
    } catch (error) {
      console.error("Error fetching modules:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return

    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete module")

      toast({
        title: "Module Deleted",
        description: "The module has been successfully deleted.",
      })

      fetchModules()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete module. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleModuleStatus = async (moduleId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"

    try {
      const response = await fetch(`/api/admin/modules/${moduleId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update module status")

      toast({
        title: "Status Updated",
        description: `Module ${newStatus === "published" ? "published" : "unpublished"} successfully.`,
      })

      fetchModules()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update module status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading modules...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Module Management
            </CardTitle>
            <CardDescription>Create, edit, and manage curriculum modules</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Module
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{module.title}</h4>
                  <Badge variant={module.status === "published" ? "default" : "secondary"}>{module.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{module.category}</span>
                  <span>•</span>
                  <span>{module.difficulty}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {module.estimatedTime}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleModuleStatus(module.id, module.status)}>
                  {module.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteModule(module.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Modules Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first module to get started</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Module
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
