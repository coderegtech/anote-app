import InboxClient from "@/components/inbox-client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminDb } from "@/lib/firebase-admin"

export default async function InboxPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) {
    redirect("/auth")
  }

  const userDoc = await adminDb.collection("users").doc(userId).get()

  if (!userDoc.exists) {
    redirect("/auth")
  }

  const userData = userDoc.data()

  return <InboxClient userId={userId} username={userData?.username || ""} profilePicture={userData?.profilePicture} />
}
