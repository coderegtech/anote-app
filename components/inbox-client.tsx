"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Copy, LogOut, MessageSquare, User, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import GlobalChat from "./global-chat"
import QuestionsFeed from "./questions-feed"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { signOut } from "firebase/auth"

interface Message {
  id: string
  content: string
  timestamp: number
  read: boolean
}

export default function InboxClient({
  userId,
  username,
  profilePicture,
}: {
  userId: string
  username: string
  profilePicture?: string
}) {
  const router = useRouter()
  const { toast } = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"play" | "inbox" | "chat" | "questions">("play")
  const [customQuestion, setCustomQuestion] = useState("Send me anonymous question!")
  const [isEditing, setIsEditing] = useState(false)
  const editableRef = useRef<HTMLDivElement>(null)
  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/u/${username}`

  useEffect(() => {
    const messagesRef = collection(db, "messages")
    const q = query(messagesRef, where("recipientId", "==", userId), orderBy("timestamp", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        timestamp: doc.data().timestamp,
        read: doc.data().read,
      }))
      setMessages(msgs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  // Copy or share link
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    toast({
      title: "Link copied!",
      description: "Share it on your story.",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Send me anonymous messages!",
        text: "Send me honest feedback anonymously.",
        url: shareLink,
      })
    } else {
      copyLink()
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/auth")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "messages", messageId))
      toast({
        title: "Message deleted",
        description: "The message has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  // Editable custom question
  const EditableQuestion = () => {
    const handleBlur = () => {
      const text = editableRef.current?.textContent?.trim() || ""
      setCustomQuestion(text || "Send me anonymous question!")
      setIsEditing(false)
    }

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(e.currentTarget)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }

    return (
      <div className="">
        {isEditing ? (
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Edit custom question"
            onBlur={handleBlur}
            onFocus={handleFocus}
            className="bg-transparent border-none outline-none shadow-none focus:outline-none text-white text-xl font-medium text-center"
            dir="ltr"
            autoFocus
          >
            {customQuestion}
          </div>
        ) : (
          <p className="text-white text-xl font-medium cursor-pointer text-center" onClick={() => setIsEditing(true)}>
            {customQuestion}
          </p>
        )}
      </div>
    )
  }

  // Inbox message list
  const InboxMessages = () => {
    if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

    if (messages.length === 0)
      return (
        <div className="text-center py-12 space-y-3">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-300" />
          <p className="text-gray-500 font-medium">No messages yet</p>
          <p className="text-sm text-gray-400">Share your link to get messages</p>
        </div>
      )

    return (
      <div className="space-y-4 max-w-md mx-auto">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className="p-5 shadow-sm hover:shadow-md transition-shadow rounded-2xl border-gray-200 relative group"
          >
            <p className="text-gray-800 leading-relaxed pr-8">{msg.content}</p>
            <p className="text-xs text-gray-400 mt-3">{new Date(msg.timestamp).toLocaleDateString()}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteMessage(msg.id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>
    )
  }

  // PLAY tab
  const PlaySection = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <Card className="bg-neutral-500 border-0 shadow-xl overflow-hidden rounded-4xl max-w-sm mx-auto">
        <div className="p-8 flex flex-col items-center justify-center min-h-[240px] text-center space-y-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profilePicture || "/placeholder.svg"} alt={username} />
            <AvatarFallback className="bg-white/20 backdrop-blur-sm">
              <User className="text-white w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <EditableQuestion />
        </div>
      </Card>

      <div className="space-y-4 px-14 bg-neutral-300 rounded-lg py-8">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-gray-700">Copy your link</p>
          <div className="bg-gray-100 rounded-full px-4 py-2">
            <p className="text-sm text-gray-500 truncate">{shareLink}</p>
          </div>
          <Button
            onClick={copyLink}
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-black text-black hover:bg-black hover:text-white font-semibold bg-transparent"
          >
            <Copy className="w-3 h-3 mr-2" />
            Copy link
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex gap-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("play")}
            className={`text-lg font-bold whitespace-nowrap ${activeTab === "play" ? "text-black" : "text-gray-400"}`}
          >
            PLAY
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={`text-lg font-bold whitespace-nowrap ${activeTab === "inbox" ? "text-black" : "text-gray-400"}`}
          >
            INBOX
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`text-lg font-bold whitespace-nowrap ${activeTab === "chat" ? "text-black" : "text-gray-400"}`}
          >
            CHAT
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`text-lg font-bold whitespace-nowrap ${activeTab === "questions" ? "text-black" : "text-gray-400"}`}
          >
            QUESTIONS
          </button>
        </div>

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black" onClick={handleSignOut}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {activeTab === "play" && <PlaySection />}
        {activeTab === "inbox" && <InboxMessages />}
        {activeTab === "chat" && (
          <GlobalChat currentUserId={userId} currentUsername={username} currentProfilePicture={profilePicture} />
        )}
        {activeTab === "questions" && (
          <QuestionsFeed currentUserId={userId} currentUsername={username} currentProfilePicture={profilePicture} />
        )}
      </div>
    </div>
  )
}
