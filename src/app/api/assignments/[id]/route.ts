import { type NextRequest, NextResponse } from "next/server"

const assignmentDetails = {
  "cs101-1": {
    id: "cs101-1",
    title: "Binary Search Implementation",
    type: "Programming Assignment",
    dueDate: "2024-01-15T23:59:00",
    status: "pending",
    priority: "high" as const,
    description:
      "Implement binary search algorithm in Python with time complexity analysis. Your solution should include proper documentation, test cases, and a detailed explanation of the algorithm's efficiency compared to linear search.",
    courseId: "cs101",
    courseName: "CS 101 - Computer Science 101",
    courseColor: "#6366f1",
    totalPoints: 100,
    rubric: [
      { criteria: "Algorithm Implementation", maxPoints: 40 },
      { criteria: "Code Quality & Documentation", maxPoints: 25 },
      { criteria: "Time Complexity Analysis", maxPoints: 20 },
      { criteria: "Test Cases & Examples", maxPoints: 15 },
    ],
  },
  "cs101-2": {
    id: "cs101-2",
    title: "Data Structures Quiz",
    type: "Quiz",
    dueDate: "2024-01-18T23:59:00",
    status: "pending",
    priority: "medium" as const,
    description:
      "Online quiz covering arrays, linked lists, and stacks. The quiz will test your understanding of basic data structure operations, time complexities, and practical applications.",
    courseId: "cs101",
    courseName: "CS 101 - Computer Science 101",
    courseColor: "#6366f1",
    totalPoints: 50,
    rubric: [
      { criteria: "Conceptual Understanding", maxPoints: 25 },
      { criteria: "Problem Solving", maxPoints: 15 },
      { criteria: "Time Complexity Knowledge", maxPoints: 10 },
    ],
  },
  "cs101-3": {
    id: "cs101-3",
    title: "Algorithm Analysis Paper",
    type: "Research Paper",
    dueDate: "2024-01-25T23:59:00",
    status: "pending",
    priority: "high" as const,
    description:
      "Write a 5-page analysis of sorting algorithms including bubble sort, merge sort, and quicksort. Compare their time and space complexities with real-world examples and performance benchmarks.",
    courseId: "cs101",
    courseName: "CS 101 - Computer Science 101",
    courseColor: "#6366f1",
    totalPoints: 150,
    rubric: [
      { criteria: "Research & Analysis", maxPoints: 50 },
      { criteria: "Technical Accuracy", maxPoints: 40 },
      { criteria: "Writing Quality", maxPoints: 30 },
      { criteria: "Citations & Format", maxPoints: 30 },
    ],
  },
  "math201-1": {
    id: "math201-1",
    title: "Integration Techniques",
    type: "Problem Set",
    dueDate: "2024-01-16T23:59:00",
    status: "pending",
    priority: "medium" as const,
    description:
      "Complete problems 1-20 from Chapter 7 covering integration by parts, trigonometric substitution, and partial fractions. Show all work and provide step-by-step solutions.",
    courseId: "math201",
    courseName: "MATH 201 - Calculus II",
    courseColor: "#8b5cf6",
    totalPoints: 80,
    rubric: [
      { criteria: "Mathematical Accuracy", maxPoints: 40 },
      { criteria: "Solution Process", maxPoints: 25 },
      { criteria: "Clarity of Work", maxPoints: 15 },
    ],
  },
  "math201-2": {
    id: "math201-2",
    title: "Midterm Exam",
    type: "Exam",
    dueDate: "2024-01-22T23:59:00",
    status: "pending",
    priority: "high" as const,
    description:
      "Comprehensive exam covering integration and series. The exam will include both computational problems and conceptual questions about convergence tests and applications.",
    courseId: "math201",
    courseName: "MATH 201 - Calculus II",
    courseColor: "#8b5cf6",
    totalPoints: 200,
    rubric: [
      { criteria: "Integration Techniques", maxPoints: 80 },
      { criteria: "Series Analysis", maxPoints: 60 },
      { criteria: "Problem Solving", maxPoints: 40 },
      { criteria: "Mathematical Communication", maxPoints: 20 },
    ],
  },
  "math201-3": {
    id: "math201-3",
    title: "Series Convergence Project",
    type: "Project",
    dueDate: "2024-01-28T23:59:00",
    status: "pending",
    priority: "high" as const,
    description:
      "Analyze convergence of various infinite series using different convergence tests. Create visual representations and provide detailed mathematical proofs for your conclusions.",
    courseId: "math201",
    courseName: "MATH 201 - Calculus II",
    courseColor: "#8b5cf6",
    totalPoints: 120,
    rubric: [
      { criteria: "Convergence Analysis", maxPoints: 50 },
      { criteria: "Mathematical Proofs", maxPoints: 35 },
      { criteria: "Visual Representations", maxPoints: 20 },
      { criteria: "Project Presentation", maxPoints: 15 },
    ],
  },
  "eng150-1": {
    id: "eng150-1",
    title: "Shakespeare Essay",
    type: "Essay",
    dueDate: "2024-01-17T23:59:00",
    status: "pending",
    priority: "high" as const,
    description:
      "Analyze themes in Hamlet - 1000 words minimum. Focus on the themes of revenge, madness, and moral corruption. Use MLA format and include at least 3 scholarly sources.",
    courseId: "eng150",
    courseName: "ENG 150 - English Literature",
    courseColor: "#06b6d4",
    totalPoints: 100,
    rubric: [
      { criteria: "Thesis & Argument", maxPoints: 30 },
      { criteria: "Textual Analysis", maxPoints: 25 },
      { criteria: "Use of Sources", maxPoints: 20 },
      { criteria: "Writing Quality", maxPoints: 15 },
      { criteria: "MLA Format", maxPoints: 10 },
    ],
  },
  "eng150-2": {
    id: "eng150-2",
    title: "Poetry Analysis",
    type: "Assignment",
    dueDate: "2024-01-20T23:59:00",
    status: "pending",
    priority: "medium" as const,
    description:
      "Compare and contrast two romantic poets focusing on their use of nature imagery and emotional expression. Analyze specific poems and discuss their historical context.",
    courseId: "eng150",
    courseName: "ENG 150 - English Literature",
    courseColor: "#06b6d4",
    totalPoints: 75,
    rubric: [
      { criteria: "Comparative Analysis", maxPoints: 30 },
      { criteria: "Literary Devices", maxPoints: 20 },
      { criteria: "Historical Context", maxPoints: 15 },
      { criteria: "Writing Clarity", maxPoints: 10 },
    ],
  },
  "eng150-3": {
    id: "eng150-3",
    title: "Final Presentation",
    type: "Presentation",
    dueDate: "2024-01-30T23:59:00",
    status: "pending",
    priority: "high" as const,
    description:
      "15-minute presentation on chosen literary work. Include analysis of themes, historical context, and personal interpretation. Use visual aids and engage the audience.",
    courseId: "eng150",
    courseName: "ENG 150 - English Literature",
    courseColor: "#06b6d4",
    totalPoints: 100,
    rubric: [
      { criteria: "Content Knowledge", maxPoints: 40 },
      { criteria: "Presentation Skills", maxPoints: 25 },
      { criteria: "Visual Aids", maxPoints: 20 },
      { criteria: "Audience Engagement", maxPoints: 15 },
    ],
  },
  "phys101-1": {
    id: "phys101-1",
    title: "Mechanics Lab Report",
    type: "Lab Report",
    dueDate: "2024-01-19T23:59:00",
    status: "pending",
    priority: "medium" as const,
    description:
      "Write lab report on projectile motion experiment. Include theoretical background, experimental procedure, data analysis with graphs, and discussion of results and sources of error.",
    courseId: "phys101",
    courseName: "PHYS 101 - Physics I",
    courseColor: "#10b981",
    totalPoints: 90,
    rubric: [
      { criteria: "Theoretical Background", maxPoints: 20 },
      { criteria: "Experimental Procedure", maxPoints: 15 },
      { criteria: "Data Analysis", maxPoints: 30 },
      { criteria: "Discussion & Conclusions", maxPoints: 15 },
      { criteria: "Report Format", maxPoints: 10 },
    ],
  },
  "phys101-2": {
    id: "phys101-2",
    title: "Forces and Motion Quiz",
    type: "Quiz",
    dueDate: "2024-01-21T23:59:00",
    status: "pending",
    priority: "low" as const,
    description:
      "Multiple choice quiz on Newton's laws covering force diagrams, equilibrium, and applications of Newton's second law in various scenarios.",
    courseId: "phys101",
    courseName: "PHYS 101 - Physics I",
    courseColor: "#10b981",
    totalPoints: 40,
    rubric: [
      { criteria: "Conceptual Understanding", maxPoints: 20 },
      { criteria: "Problem Application", maxPoints: 15 },
      { criteria: "Force Diagram Skills", maxPoints: 5 },
    ],
  },
  "phys101-3": {
    id: "phys101-3",
    title: "Energy Conservation Problem Set",
    type: "Problem Set",
    dueDate: "2024-01-26T23:59:00",
    status: "pending",
    priority: "medium" as const,
    description:
      "Solve problems involving kinetic and potential energy, work-energy theorem, and conservation of mechanical energy. Include detailed solutions and energy diagrams.",
    courseId: "phys101",
    courseName: "PHYS 101 - Physics I",
    courseColor: "#10b981",
    totalPoints: 70,
    rubric: [
      { criteria: "Problem Solving", maxPoints: 35 },
      { criteria: "Energy Diagrams", maxPoints: 20 },
      { criteria: "Mathematical Accuracy", maxPoints: 15 },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: assignmentId } = await params
  const assignment = assignmentDetails[assignmentId as keyof typeof assignmentDetails]
  
  if (!assignment) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
  }
  return NextResponse.json({ assignment })
}