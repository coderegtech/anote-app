import { getServerDb } from "@/lib/firebase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  try {
    const db = getServerDb()
    const messagesRef = db.collection("users").doc(userId).collection("messages")
    const snapshot = await messagesRef.orderBy("timestamp", "desc").limit(50).get()

    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      timestamp: doc.data().timestamp,
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ messages: [] })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 })
    }

    const messageData = {
      text: text.trim(),
      timestamp: Date.now(),
      read: false,
    }

    const db = getServerDb()
    const messageRef = await db.collection("users").doc(userId).collection("messages").add(messageData)

    return NextResponse.json({ success: true, messageId: messageRef.id })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
