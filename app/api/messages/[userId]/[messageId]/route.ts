import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: Promise<{ userId: string; messageId: string }> }) {
  const { userId, messageId } = await params

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/messages/${userId}/${messageId}.json`,
      {
        method: "DELETE",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to delete message")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
