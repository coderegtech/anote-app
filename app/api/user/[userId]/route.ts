import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params

    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: userDoc.data() })
  } catch (error) {
    console.error("[v0] Fetch user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
