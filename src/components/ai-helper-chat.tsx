"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: string
}

interface AIHelperChatProps {
  courseId: string
  assignmentTitle: string
}

export default function AIHelperChat({ courseId, assignmentTitle }: AIHelperChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Hi! I'm your AI assistant for ${assignmentTitle}. I can help you understand the requirements, clarify concepts, or provide guidance. What would you like to know?`,
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const generateAIResponse = (userMessage: string): string => {
    const responses = {
      cs101: [
        "For programming assignments, make sure to follow proper coding conventions and include comments explaining your logic.",
        "Remember to test your code with different inputs and handle edge cases appropriately.",
        "If you're stuck on a concept, try breaking the problem down into smaller, manageable parts.",
        "Don't forget to include proper documentation and follow the coding style guidelines provided in class.",
      ],
      math201: [
        "Show all your work step-by-step. Partial credit is often given for correct methodology even if the final answer is wrong.",
        "Make sure to clearly state your assumptions and explain your reasoning for each step.",
        "Double-check your calculations and consider if your answer makes sense in the context of the problem.",
        "Use proper mathematical notation and be precise with your language when explaining concepts.",
      ],
      eng102: [
        "Make sure your thesis statement is clear and well-supported throughout your essay.",
        "Use credible sources and cite them properly according to the required citation style.",
        "Organize your ideas logically with smooth transitions between paragraphs.",
        "Proofread carefully for grammar, spelling, and clarity before submitting.",
      ],
      hist150: [
        "Support your arguments with specific historical evidence and primary sources when possible.",
        "Consider multiple perspectives and analyze the historical context of events.",
        "Make connections between historical events and their broader significance.",
        "Use proper historical terminology and demonstrate understanding of cause and effect relationships.",
      ],
    }

    const courseResponses = responses[courseId as keyof typeof responses] || responses.cs101
    return courseResponses[Math.floor(Math.random() * courseResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputValue),
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-accent text-accent-foreground rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this assignment..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}