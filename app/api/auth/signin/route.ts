import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, username, profilePicture } = await request.json()

    if (!userId || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if username is already taken
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("username", "==", username))
    const usersSnapshot = await getDocs(q)

    if (!usersSnapshot.empty && usersSnapshot.docs[0].id !== userId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Create or update user in Firestore
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    const userData = {
      uid: userId,
      username,
      profilePicture: profilePicture || "",
      createdAt: userDoc.exists() ? userDoc.data()?.createdAt : Date.now(),
      updatedAt: Date.now(),
    }

    await setDoc(userRef, userData, { merge: true })

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
