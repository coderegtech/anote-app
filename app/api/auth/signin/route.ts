import { getServerDb } from "@/lib/firebase-server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { userId, username, profilePicture } = await request.json()

    if (!userId || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getServerDb()
    const usersRef = db.collection("users")
    const q = usersRef.where("username", "==", username)
    const usersSnapshot = await q.get()

    if (!usersSnapshot.empty && usersSnapshot.docs[0].id !== userId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Create or update user in Firestore
    const userRef = db.collection("users").doc(userId)
    const userDoc = await userRef.get()

    const userData = {
      uid: userId,
      username,
      profilePicture: profilePicture || "",
      createdAt: userDoc.exists ? userDoc.data()?.createdAt : Date.now(),
      updatedAt: Date.now(),
    }

    await userRef.set(userData, { merge: true })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, user: userData })
  } catch (error) {
    console.error("[v0] Sign in error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
