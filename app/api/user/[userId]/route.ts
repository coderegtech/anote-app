import { getServerDb } from "@/lib/firebase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const db = getServerDb()

    const userDoc = await db.collection("users").doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: userDoc.data() })
  } catch (error) {
    console.error("[v0] Fetch user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
