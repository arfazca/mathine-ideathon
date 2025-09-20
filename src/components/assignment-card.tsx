"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Calendar, Clock, BookOpen } from "lucide-react"

interface Assignment {
  id: string
  title: string
  type: string
  dueDate: string
  status: string
  priority: "low" | "medium" | "high"
  description: string
}

interface AssignmentCardProps {
  assignment: Assignment
  courseColor: string
}

export function AssignmentCard({ assignment, courseColor }: AssignmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntilDue = (dateString: string) => {
    const today = new Date()
    const dueDate = new Date(dateString)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `${diffDays} days left`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const daysLeft = getDaysUntilDue(assignment.dueDate)
  const isUrgent = daysLeft === "Due today" || daysLeft === "Due tomorrow" || daysLeft === "Overdue"

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-dropdown-trigger]")) {
      return
    }
    router.push(`/assignment/${assignment.id}`)
  }

  return (
    <Card
      className={`min-w-80 bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-pointer ${isUrgent ? "ring-1 ring-red-500/30" : ""}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 rounded-full" style={{ backgroundColor: courseColor }} />
            <div>
              <h3 className="font-semibold text-card-foreground text-balance">{assignment.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{assignment.type}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" data-dropdown-trigger>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem
                className="text-card-foreground hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/assignment/${assignment.id}`)
                }}
              >
                View Assignment
              </DropdownMenuItem>
              <DropdownMenuItem className="text-card-foreground hover:bg-accent">Mark as Complete</DropdownMenuItem>
              <DropdownMenuItem className="text-card-foreground hover:bg-accent">Edit Assignment</DropdownMenuItem>
              <DropdownMenuItem className="text-card-foreground hover:bg-accent">Set Reminder</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
              >
                {isExpanded ? "Hide Details" : "Show Details"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-card-foreground">{formatDate(assignment.dueDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={`text-sm ${isUrgent ? "text-red-400 font-medium" : "text-muted-foreground"}`}>
              {daysLeft}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getPriorityColor(assignment.priority)}`}>
              {assignment.priority.toUpperCase()} PRIORITY
            </Badge>
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              {assignment.status.toUpperCase()}
            </Badge>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-pretty">{assignment.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
