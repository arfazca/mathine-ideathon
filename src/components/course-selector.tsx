"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Course {
  id: string
  name: string
  code: string
  color: string
}

interface CourseSelectorProps {
  courses: Course[]
  selectedCourse: string | null
  onCourseChange: (courseId: string) => void
}

export function CourseSelector({ courses, selectedCourse, onCourseChange }: CourseSelectorProps) {
  return (
    <div className="w-full max-w-md">
      <Select value={selectedCourse || ""} onValueChange={onCourseChange}>
        <SelectTrigger className="w-full bg-card border-border text-card-foreground">
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {courses.map((course) => (
            <SelectItem
              key={course.id}
              value={course.id}
              className="text-card-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }} />
                <div>
                  <div className="font-medium">{course.code}</div>
                  <div className="text-sm text-muted-foreground">{course.name}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}