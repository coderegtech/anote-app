"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function SendMessageForm({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please write a message before sending",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    try {
      const response = await fetch(`/api/messages/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      toast({
        title: "Message Sent!",
        description: "Your anonymous message has been delivered",
      })

      setMessage("")

      setTimeout(() => {
        router.push("/welcome")
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-between px-6 py-8">
      <div className="w-full max-w-md pt-8">
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-0">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-bold text-gray-900">@username</p>
              <p className="text-sm font-bold text-gray-900">Send me anonymous message!</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hello world"
              className="min-h-[100px] resize-none text-base border-0 rounded-2xl bg-gray-200 focus:bg-gray-200 text-black placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
              maxLength={500}
              disabled={sending}
            />
          </form>
        </Card>
      </div>

      <div className="w-full max-w-md space-y-4">
        <Button
          onClick={handleSubmit}
          disabled={sending || !message.trim()}
          className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 font-bold text-lg shadow-2xl"
        >
          {sending ? "Sending..." : "Send"}
        </Button>

        <Button
          onClick={() => router.push("/welcome")}
          variant="outline"
          className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 font-bold text-lg shadow-2xl border-0"
        >
          Get your messages!
        </Button>
      </div>
    </div>
  )
}
