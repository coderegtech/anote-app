"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Settings, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  text: string
  timestamp: number
}

export default function InboxClient({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"play" | "inbox">("play")
  const [customQuestion, setCustomQuestion] = useState("")

  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/u/${userId}`

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [userId])

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    toast({
      title: "Link copied!",
      description: "Share it on your story",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Send me anonymous messages!",
        text: "Send me honest feedback anonymously",
        url: shareLink,
      })
    } else {
      copyLink()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <button
          onClick={() => setActiveTab("play")}
          className={`text-lg font-bold ${activeTab === "play" ? "text-black" : "text-gray-400"}`}
        >
          PLAY
        </button>
        <button
          onClick={() => setActiveTab("inbox")}
          className={`text-lg font-bold ${activeTab === "inbox" ? "text-black" : "text-gray-400"}`}
        >
          INBOX
        </button>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 px-6 py-8">
        {activeTab === "play" ? (
          <div className="space-y-6 max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-amber-900 to-amber-800 border-0 shadow-xl overflow-hidden rounded-3xl">
              <div className="p-8 flex flex-col items-center justify-center min-h-[240px] text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-lg font-medium">Can type questions</p>
                <div className="w-full px-4">
                  <Input
                    type="text"
                    placeholder="Type your question..."
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full text-center backdrop-blur-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
                    <span className="text-white text-xl">⟳</span>
                  </button>
                  <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
                    <span className="text-white text-xl">♥</span>
                  </button>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-gray-700">Step 1: Copy your link</p>
                <div className="bg-gray-100 rounded-full px-4 py-2">
                  <p className="text-xs text-gray-500 truncate">{shareLink}</p>
                </div>
                <Button
                  onClick={copyLink}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-black text-black hover:bg-black hover:text-white font-semibold bg-transparent"
                >
                  <Copy className="w-3 h-3 mr-2" />
                  copy link
                </Button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-gray-700">Step 2: Share link on your story</p>
                <Button
                  onClick={handleShare}
                  className="w-full h-12 rounded-full font-bold text-lg shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 25%, #c44569 50%, #fd79a8 75%, #fdcb6e 100%)",
                    color: "white",
                  }}
                >
                  Share!
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-md mx-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-gray-500 font-medium">No messages yet</p>
                <p className="text-sm text-gray-400">Share your link to get messages</p>
              </div>
            ) : (
              messages.map((message) => (
                <Card
                  key={message.id}
                  className="p-5 shadow-sm hover:shadow-md transition-shadow rounded-2xl border-gray-200"
                >
                  <p className="text-gray-800 leading-relaxed">{message.text}</p>
                  <p className="text-xs text-gray-400 mt-3">{new Date(message.timestamp).toLocaleDateString()}</p>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
