import { adminDb } from "@/lib/firebase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  try {
    const messagesSnapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(50)
      .get()

    const messages = messagesSnapshot.docs.map((doc) => ({
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

    const messageRef = await adminDb.collection("users").doc(userId).collection("messages").add(messageData)

    return NextResponse.json({ success: true, messageId: messageRef.id })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
