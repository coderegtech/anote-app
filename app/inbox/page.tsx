import InboxClient from "@/components/inbox-client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default async function InboxPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) {
    redirect("/auth")
  }

  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)

  if (!userDoc.exists()) {
    redirect("/auth")
  }

  const userData = userDoc.data()

  return <InboxClient userId={userId} username={userData?.username || ""} profilePicture={userData?.profilePicture} />
}
