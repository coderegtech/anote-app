import { getServerDb } from "@/lib/firebase-server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Get all public questions
export async function GET() {
  try {
    const db = getServerDb()
    const questionsRef = db.collection("questions")
    const snapshot = await questionsRef.orderBy("timestamp", "desc").limit(50).get()

    const questions = await Promise.all(
      snapshot.docs.map(async (questionDoc) => {
        const questionData = questionDoc.data()

        // Get reply count
        const repliesSnapshot = await db.collection("questions").doc(questionDoc.id).collection("replies").get()

        return {
          id: questionDoc.id,
          ...questionData,
          replyCount: repliesSnapshot.size,
        }
      }),
    )

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("[v0] Fetch questions error:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

// Post a new question
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Question content required" }, { status: 400 })
    }

    const db = getServerDb()

    // Get user data
    const userDoc = await db.collection("users").doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()

    // Create question
    const questionData = {
      userId,
      username: userData?.username || "Anonymous",
      profilePicture: userData?.profilePicture || "",
      content: content.trim(),
      timestamp: Date.now(),
    }

    const questionRef = await db.collection("questions").add(questionData)

    return NextResponse.json({
      success: true,
      question: { id: questionRef.id, ...questionData, replyCount: 0 },
    })
  } catch (error) {
    console.error("[v0] Post question error:", error)
    return NextResponse.json({ error: "Failed to post question" }, { status: 500 })
  }
}
