import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Generate a unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    // Create user document in Firestore
    const response = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${userId}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        createdAt: Date.now(),
        messageCount: 0,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create user")
    }

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 })
  }
}
