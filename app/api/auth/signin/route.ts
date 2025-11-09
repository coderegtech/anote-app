import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { idToken, username, profilePicture } = await request.json()

    if (!idToken || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // Check if username is already taken
    const usersSnapshot = await adminDb.collection("users").where("username", "==", username).get()

    if (!usersSnapshot.empty && usersSnapshot.docs[0].id !== uid) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Create or update user in Firestore
    const userRef = adminDb.collection("users").doc(uid)
    const userDoc = await userRef.get()

    const userData = {
      uid,
      username,
      profilePicture: profilePicture || "",
      createdAt: userDoc.exists ? userDoc.data()?.createdAt : Date.now(),
      updatedAt: Date.now(),
    }

    await userRef.set(userData, { merge: true })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("userId", uid, {
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
