import { getServerDb } from "@/lib/firebase-server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Get chat messages
export async function GET() {
  try {
    const db = getServerDb()
    const chatRef = db.collection("globalChat")
    const snapshot = await chatRef.orderBy("timestamp", "desc").limit(100).get()

    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ messages: messages.reverse() })
  } catch (error) {
    console.error("[v0] Fetch chat error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// Send chat message
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 })
    }

    const db = getServerDb()

    // Get user data
    const userDoc = await db.collection("users").doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()

    // Create chat message
    const messageData = {
      userId,
      username: userData?.username || "Anonymous",
      profilePicture: userData?.profilePicture || "",
      content: content.trim(),
      timestamp: Date.now(),
    }

    const messageRef = await db.collection("globalChat").add(messageData)

    return NextResponse.json({
      success: true,
      message: { id: messageRef.id, ...messageData },
    })
  } catch (error) {
    console.error("[v0] Send chat error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
