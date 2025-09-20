"use client"

import { useState, useEffect } from "react"
import { CourseSelector } from "@/components/course-selector"
import { AssignmentCard } from "@/components/assignment-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Calendar, Clock, TrendingUp } from "lucide-react"

interface Course {
  id: string
  name: string
  code: string
  color: string
}

interface Assignment {
  id: string
  title: string
  type: string
  dueDate: string
  status: string
  priority: "low" | "medium" | "high"
  description: string
}

interface ApiResponse {
  courses?: Course[]
  course?: Course
  assignments?: Assignment[]
  totalAssignments?: number
}

export default function AssignmentDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalAssignments, setTotalAssignments] = useState(0)

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/assignments")
        const data: ApiResponse = await response.json()
        if (data.courses) {
          setCourses(data.courses)
          setTotalAssignments(data.totalAssignments || 0)
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Fetch assignments when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const fetchAssignments = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/assignments?courseId=${selectedCourse}`)
          const data: ApiResponse = await response.json()
          if (data.assignments && data.course) {
            setAssignments(data.assignments)
            setCurrentCourse(data.course)
          }
        } catch (error) {
          console.error("Failed to fetch assignments:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchAssignments()
    } else {
      setAssignments([])
      setCurrentCourse(null)
    }
  }, [selectedCourse])

  const getUpcomingCount = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return assignments.filter((assignment) => {
      const dueDate = new Date(assignment.dueDate)
      return dueDate >= today && dueDate <= nextWeek
    }).length
  }

  const getOverdueCount = () => {
    const today = new Date()
    return assignments.filter((assignment) => {
      const dueDate = new Date(assignment.dueDate)
      return dueDate < today
    }).length
  }

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header with Theme Toggle */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Assignment Dashboard</h1>
            <p className="text-muted-foreground text-pretty">
              Track and manage your semester assignments across all courses
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{courses.length}</p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{totalAssignments}</p>
                  <p className="text-sm text-muted-foreground">Total Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{getUpcomingCount()}</p>
                  <p className="text-sm text-muted-foreground">Due This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{getOverdueCount()}</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Select Course</h2>
          <CourseSelector courses={courses} selectedCourse={selectedCourse} onCourseChange={setSelectedCourse} />
        </div>

        {/* Assignments Timeline */}
        {selectedCourse && currentCourse && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentCourse.color }} />
              <h2 className="text-2xl font-semibold text-foreground">
                {currentCourse.code} - {currentCourse.name}
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading assignments...</p>
              </div>
            ) : assignments.length > 0 ? (
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-max">
                  {assignments.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} courseColor={currentCourse.color} />
                  ))}
                </div>
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-card-foreground mb-2">No assignments found</h3>
                  <p className="text-muted-foreground">This course doesn&apos;t have any assignments yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Welcome Message */}
        {!selectedCourse && (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-card-foreground mb-4 text-balance">
                Welcome to Your Assignment Dashboard
              </h3>
              <p className="text-muted-foreground text-pretty max-w-md mx-auto">
                Select a course from the dropdown above to view all assignments organized by their due dates in a
                horizontal timeline.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}