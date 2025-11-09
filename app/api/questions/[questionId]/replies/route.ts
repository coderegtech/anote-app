import { adminDb } from "@/lib/firebase-admin"
import { NextResponse } from "next/server"

// Get replies for a question
export async function GET(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params

    const repliesSnapshot = await adminDb
      .collection("questions")
      .doc(questionId)
      .collection("replies")
      .orderBy("timestamp", "asc")
      .get()

    const replies = repliesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ replies })
  } catch (error) {
    console.error("[v0] Fetch replies error:", error)
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 })
  }
}

// Post a reply to a question (anonymous)
export async function POST(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params
    const { content, username } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Reply content required" }, { status: 400 })
    }

    // Create reply
    const replyData = {
      content: content.trim(),
      username: username || "Anonymous",
      timestamp: Date.now(),
    }

    const replyRef = await adminDb.collection("questions").doc(questionId).collection("replies").add(replyData)

    return NextResponse.json({
      success: true,
      reply: { id: replyRef.id, ...replyData },
    })
  } catch (error) {
    console.error("[v0] Post reply error:", error)
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 })
  }
}
