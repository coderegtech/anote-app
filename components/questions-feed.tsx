"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send, User } from "lucide-react"
import { useEffect, useState } from "react"

interface Question {
  id: string
  userId: string
  username: string
  profilePicture?: string
  content: string
  timestamp: number
  replyCount: number
}

interface Reply {
  id: string
  content: string
  username: string
  timestamp: number
}

export default function QuestionsFeed() {
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [newReply, setNewReply] = useState("")
  const [replyUsername, setReplyUsername] = useState("")

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions")
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions || [])
      }
    } catch (error) {
      console.error("[v0] Failed to fetch questions:", error)
    }
  }

  useEffect(() => {
    fetchQuestions()
    const interval = setInterval(fetchQuestions, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim() || loading) return

    setLoading(true)
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newQuestion }),
      })

      if (res.ok) {
        setNewQuestion("")
        fetchQuestions()
        toast({
          title: "Question posted!",
          description: "Your question is now public",
        })
      }
    } catch (error) {
      console.error("[v0] Failed to post question:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReplies = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/replies`)
      if (res.ok) {
        const data = await res.json()
        setReplies(data.replies || [])
      }
    } catch (error) {
      console.error("[v0] Failed to fetch replies:", error)
    }
  }

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question)
    fetchReplies(question.id)
  }

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReply.trim() || !selectedQuestion) return

    try {
      const res = await fetch(`/api/questions/${selectedQuestion.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newReply,
          username: replyUsername.trim() || "Anonymous",
        }),
      })

      if (res.ok) {
        setNewReply("")
        setReplyUsername("")
        fetchReplies(selectedQuestion.id)
        fetchQuestions()
        toast({
          title: "Reply posted!",
          description: "Your reply has been added",
        })
      }
    } catch (error) {
      console.error("[v0] Failed to post reply:", error)
    }
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Post Question Form */}
      <Card className="p-4 shadow-sm rounded-2xl">
        <form onSubmit={handlePostQuestion} className="space-y-3">
          <Textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question to the community..."
            className="min-h-[80px] resize-none rounded-xl"
            maxLength={500}
          />
          <Button
            type="submit"
            disabled={loading || !newQuestion.trim()}
            className="w-full rounded-full bg-black hover:bg-black/90"
          >
            Post Question
          </Button>
        </form>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <MessageCircle className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-gray-500 font-medium">No questions yet</p>
            <p className="text-sm text-gray-400">Be the first to ask!</p>
          </div>
        ) : (
          questions.map((question) => (
            <Dialog key={question.id}>
              <DialogTrigger asChild>
                <Card
                  className="p-5 shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl border-gray-200"
                  onClick={() => handleQuestionClick(question)}
                >
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={question.profilePicture || "/placeholder.svg"} alt={question.username} />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">@{question.username}</p>
                      <p className="text-gray-700 mt-1 leading-relaxed">{question.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span>{new Date(question.timestamp).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {question.replyCount} replies
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Question & Replies</DialogTitle>
                </DialogHeader>

                {/* Question */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={selectedQuestion?.profilePicture || "/placeholder.svg"}
                        alt={selectedQuestion?.username}
                      />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">@{selectedQuestion?.username}</p>
                      <p className="text-gray-700 mt-1">{selectedQuestion?.content}</p>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                <ScrollArea className="flex-1 px-1">
                  <div className="space-y-3 py-4">
                    {replies.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-8">No replies yet. Be the first!</p>
                    ) : (
                      replies.map((reply) => (
                        <div key={reply.id} className="p-3 bg-white rounded-lg border">
                          <p className="font-semibold text-xs text-gray-600">{reply.username}</p>
                          <p className="text-sm text-gray-800 mt-1">{reply.content}</p>
                          <p className="text-xs text-gray-400 mt-2">{new Date(reply.timestamp).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Reply Form */}
                <form onSubmit={handlePostReply} className="space-y-2 pt-4 border-t">
                  <Input
                    value={replyUsername}
                    onChange={(e) => setReplyUsername(e.target.value)}
                    placeholder="Your name (optional)"
                    className="rounded-full"
                    maxLength={30}
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 rounded-full"
                      maxLength={500}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!newReply.trim()}
                      className="rounded-full bg-black hover:bg-black/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          ))
        )}
      </div>
    </div>
  )
}
