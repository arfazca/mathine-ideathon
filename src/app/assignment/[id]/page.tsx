"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Clock, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import AIHelperChat from "@/components/ai-helper-chat"

interface Assignment {
  id: string
  title: string
  type: string
  dueDate: string
  status: string
  priority: "low" | "medium" | "high"
  description: string
  courseId: string
  courseName: string
  courseColor: string
  rubric: {
    criteria: string
    maxPoints: number
  }[]
  totalPoints: number
}

interface UploadedFile {
  name: string
  size: string
  uploadedAt: string
}

interface AIScoreDetail {
  criteria: string
  score: number
  maxPoints: number
  feedback: string
}

export default function AssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiScore, setAiScore] = useState<number | null>(null)
  const [aiScoreDetails, setAiScoreDetails] = useState<AIScoreDetail[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`/api/assignments/${params.id}`)
        const data = await response.json()
        setAssignment(data.assignment)
      } catch (error) {
        console.error("Failed to fetch assignment:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAssignment()
    }
  }, [params.id])

  const handleFileUpload = (files: FileList) => {
    const file = files[0]
    if (file && file.type === "application/pdf") {
      const newFile: UploadedFile = {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
      }

      setUploadedFiles([newFile])
      simulateAIProcessing()
    }
  }

  const generateDetailedAIScore = (assignment: Assignment) => {
    const courseSpecificFeedback = {
      cs101: [
        "Code structure and organization",
        "Algorithm efficiency and correctness",
        "Proper use of programming concepts",
        "Code documentation and comments",
      ],
      math201: [
        "Mathematical accuracy and precision",
        "Step-by-step problem solving approach",
        "Proper use of mathematical notation",
        "Clear explanation of reasoning",
      ],
      eng102: [
        "Thesis clarity and argument strength",
        "Use of credible sources and citations",
        "Writing clarity and organization",
        "Grammar and language mechanics",
      ],
      hist150: [
        "Historical accuracy and context",
        "Use of primary and secondary sources",
        "Analysis and critical thinking",
        "Writing quality and organization",
      ],
    }

    const feedback =
      courseSpecificFeedback[assignment.courseId as keyof typeof courseSpecificFeedback] || courseSpecificFeedback.cs101

    return assignment.rubric.map((criterion, index) => {
      const scorePercentage = 0.8 + Math.random() * 0.2 // 80-100% of max points
      const score = Math.floor(criterion.maxPoints * scorePercentage)

      return {
        criteria: criterion.criteria,
        score,
        maxPoints: criterion.maxPoints,
        feedback: feedback[index] || "Good work on this criterion",
      }
    })
  }

  const simulateAIProcessing = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setAiScore(null)
    setAiScoreDetails([])

    // Simulate processing steps
    const steps = [
      { progress: 15, message: "Analyzing document structure..." },
      { progress: 30, message: "Extracting content and formatting..." },
      { progress: 50, message: "Comparing against course rubric..." },
      { progress: 70, message: "Evaluating each criterion..." },
      { progress: 85, message: "Calculating detailed scores..." },
      { progress: 100, message: "Generating personalized feedback..." },
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProcessingProgress(steps[currentStep].progress)
        currentStep++
      } else {
        clearInterval(interval)

        if (assignment) {
          const detailedScores = generateDetailedAIScore(assignment)
          const totalScore = detailedScores.reduce((sum, detail) => sum + detail.score, 0)

          setAiScoreDetails(detailedScores)
          setAiScore(totalScore)
        }

        setIsProcessing(false)
      }
    }, 1200)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assignment...</p>
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Assignment Not Found</h2>
          <p className="text-muted-foreground mb-4">The assignment you&apos;re looking for doesn't exist.</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={() => router.push("/")} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: assignment.courseColor }} />
            <h1 className="text-3xl font-bold text-foreground text-balance">{assignment.title}</h1>
          </div>

          <p className="text-muted-foreground">{assignment.courseName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Due: {formatDate(assignment.dueDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{getDaysUntilDue(assignment.dueDate)}</span>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {assignment.type}
                  </Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {assignment.totalPoints} points
                  </Badge>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground text-pretty">{assignment.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Submit Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload your assignment</h3>
                  <p className="text-muted-foreground mb-4">Drag and drop your PDF file here, or click to browse</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer bg-transparent">
                      Choose File
                    </Button>
                  </label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-foreground mb-3">Uploaded Files</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • Uploaded {new Date(file.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Processing */}
                {isProcessing && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span className="text-sm font-medium text-foreground">AI is analyzing your submission...</span>
                    </div>
                    <Progress value={processingProgress} className="mb-2" />
                    <p className="text-xs text-muted-foreground">Evaluating against course rubric criteria</p>
                  </div>
                )}

                {aiScore !== null && !isProcessing && aiScoreDetails.length > 0 && (
                  <div className="mt-6 p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-foreground">AI Grading Complete</span>
                    </div>

                    <div className="text-2xl font-bold text-green-500 mb-4">
                      {aiScore}/{assignment.totalPoints} ({Math.round((aiScore / assignment.totalPoints) * 100)}%)
                    </div>

                    <div className="space-y-3 mb-4">
                      <h4 className="font-medium text-foreground">Detailed Breakdown:</h4>
                      {aiScoreDetails.map((detail, index) => (
                        <div key={index} className="bg-background/50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">{detail.criteria}</span>
                            <span className="text-sm text-green-600 font-medium">
                              {detail.score}/{detail.maxPoints}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(detail.score / detail.maxPoints) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">{detail.feedback}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      This preliminary AI assessment is based on the course rubric. Your instructor will provide the
                      final grade and additional feedback.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {assignment && <AIHelperChat courseId={assignment.courseId} assignmentTitle={assignment.title} />}

            {/* Rubric */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Grading Rubric</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment.rubric.map((criterion, index) => (
                  <div key={index} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground text-sm">{criterion.criteria}</h4>
                      <span className="text-sm text-muted-foreground">{criterion.maxPoints} pts</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Total Points</span>
                    <span className="font-bold text-foreground">{assignment.totalPoints} pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}