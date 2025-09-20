import { NextResponse } from "next/server"

// Mock data for 4 courses with assignments
const assignmentsData = {
  courses: [
    {
      id: "cs101",
      name: "Computer Science 101",
      code: "CS 101",
      color: "#6366f1",
    },
    {
      id: "math201",
      name: "Calculus II",
      code: "MATH 201",
      color: "#8b5cf6",
    },
    {
      id: "eng150",
      name: "English Literature",
      code: "ENG 150",
      color: "#06b6d4",
    },
    {
      id: "phys101",
      name: "Physics I",
      code: "PHYS 101",
      color: "#10b981",
    },
  ],
  assignments: {
    cs101: [
      {
        id: "cs101-1",
        title: "Binary Search Implementation",
        type: "Programming Assignment",
        dueDate: "2024-01-15",
        status: "pending",
        priority: "high",
        description: "Implement binary search algorithm in Python with time complexity analysis",
      },
      {
        id: "cs101-2",
        title: "Data Structures Quiz",
        type: "Quiz",
        dueDate: "2024-01-18",
        status: "pending",
        priority: "medium",
        description: "Online quiz covering arrays, linked lists, and stacks",
      },
      {
        id: "cs101-3",
        title: "Algorithm Analysis Paper",
        type: "Research Paper",
        dueDate: "2024-01-25",
        status: "pending",
        priority: "high",
        description: "Write a 5-page analysis of sorting algorithms",
      },
    ],
    math201: [
      {
        id: "math201-1",
        title: "Integration Techniques",
        type: "Problem Set",
        dueDate: "2024-01-16",
        status: "pending",
        priority: "medium",
        description: "Complete problems 1-20 from Chapter 7",
      },
      {
        id: "math201-2",
        title: "Midterm Exam",
        type: "Exam",
        dueDate: "2024-01-22",
        status: "pending",
        priority: "high",
        description: "Comprehensive exam covering integration and series",
      },
      {
        id: "math201-3",
        title: "Series Convergence Project",
        type: "Project",
        dueDate: "2024-01-28",
        status: "pending",
        priority: "high",
        description: "Analyze convergence of various infinite series",
      },
    ],
    eng150: [
      {
        id: "eng150-1",
        title: "Shakespeare Essay",
        type: "Essay",
        dueDate: "2024-01-17",
        status: "pending",
        priority: "high",
        description: "Analyze themes in Hamlet - 1000 words minimum",
      },
      {
        id: "eng150-2",
        title: "Poetry Analysis",
        type: "Assignment",
        dueDate: "2024-01-20",
        status: "pending",
        priority: "medium",
        description: "Compare and contrast two romantic poets",
      },
      {
        id: "eng150-3",
        title: "Final Presentation",
        type: "Presentation",
        dueDate: "2024-01-30",
        status: "pending",
        priority: "high",
        description: "15-minute presentation on chosen literary work",
      },
    ],
    phys101: [
      {
        id: "phys101-1",
        title: "Mechanics Lab Report",
        type: "Lab Report",
        dueDate: "2024-01-19",
        status: "pending",
        priority: "medium",
        description: "Write lab report on projectile motion experiment",
      },
      {
        id: "phys101-2",
        title: "Forces and Motion Quiz",
        type: "Quiz",
        dueDate: "2024-01-21",
        status: "pending",
        priority: "low",
        description: "Multiple choice quiz on Newton's laws",
      },
      {
        id: "phys101-3",
        title: "Energy Conservation Problem Set",
        type: "Problem Set",
        dueDate: "2024-01-26",
        status: "pending",
        priority: "medium",
        description: "Solve problems involving kinetic and potential energy",
      },
    ],
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")

  if (courseId) {
    const course = assignmentsData.courses.find((c) => c.id === courseId)
    const assignments = assignmentsData.assignments[courseId as keyof typeof assignmentsData.assignments] || []

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({
      course,
      assignments: assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    })
  }

  return NextResponse.json({
    courses: assignmentsData.courses,
    totalAssignments: Object.values(assignmentsData.assignments).flat().length,
  })
}
