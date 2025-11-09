import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/messages/${userId}.json?orderBy="timestamp"&limitToLast=50`,
    )

    if (!response.ok) {
      return NextResponse.json({ messages: [] })
    }

    const data = await response.json()

    if (!data) {
      return NextResponse.json({ messages: [] })
    }

    // Convert object to array and sort by timestamp descending
    const messages = Object.entries(data)
      .map(([id, msg]: [string, any]) => ({
        id,
        text: msg.text,
        timestamp: msg.timestamp,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
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

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    const messageData = {
      text: text.trim(),
      timestamp: Date.now(),
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/messages/${userId}/${messageId}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to send message")
    }

    return NextResponse.json({ success: true, messageId })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
