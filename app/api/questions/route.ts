import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs, addDoc, doc, getDoc } from "firebase/firestore"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Get all public questions
export async function GET() {
  try {
    const questionsRef = collection(db, "questions")
    const q = query(questionsRef, orderBy("timestamp", "desc"), limit(50))
    const questionsSnapshot = await getDocs(q)

    const questions = await Promise.all(
      questionsSnapshot.docs.map(async (questionDoc) => {
        const questionData = questionDoc.data()

        // Get reply count
        const repliesRef = collection(db, "questions", questionDoc.id, "replies")
        const repliesSnapshot = await getDocs(repliesRef)

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

    // Get user data
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
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

    const questionsRef = collection(db, "questions")
    const questionRef = await addDoc(questionsRef, questionData)

    return NextResponse.json({
      success: true,
      question: { id: questionRef.id, ...questionData, replyCount: 0 },
    })
  } catch (error) {
    console.error("[v0] Post question error:", error)
    return NextResponse.json({ error: "Failed to post question" }, { status: 500 })
  }
}
