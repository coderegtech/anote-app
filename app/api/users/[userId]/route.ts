import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${userId}.json`)

    if (!response.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = await response.json()

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: userData })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
