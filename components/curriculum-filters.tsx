"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

/**
 * Curriculum Filters Component
 *
 * Features:
 * - Search functionality
 * - Category filtering
 * - Difficulty level filtering
 * - Tag-based filtering
 * - Active filters display
 * - Clear filters option
 */
export function CurriculumFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const categories = [
    "Resilience Building",
    "Leadership Skills",
    "Communication",
    "Problem Solving",
    "Emotional Intelligence",
    "Team Building",
  ]

  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  const availableTags = [
    "Self-Awareness",
    "Stress Management",
    "Decision Making",
    "Conflict Resolution",
    "Public Speaking",
    "Active Listening",
    "Critical Thinking",
    "Empathy",
    "Collaboration",
    "Time Management",
  ]

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedTags([])
  }

  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedTags.length > 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search and Main Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty.toLowerCase()}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && <Badge variant="secondary">Search: "{searchTerm}"</Badge>}
              {selectedCategory !== "all" && (
                <Badge variant="secondary">
                  Category:{" "}
                  {selectedCategory.replace("-", " ").charAt(0).toUpperCase() +
                    selectedCategory.replace("-", " ").slice(1)}
                </Badge>
              )}
              {selectedDifficulty !== "all" && (
                <Badge variant="secondary">
                  Difficulty: {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                </Badge>
              )}
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  Tag: {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
