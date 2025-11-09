import SendMessageForm from "@/components/send-message-form"
import { db } from "@/lib/firebase"
import { collection, query, where, limit, getDocs } from "firebase/firestore"
import { notFound } from "next/navigation"

export default async function SendMessagePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const usersRef = collection(db, "users")
  const q = query(usersRef, where("username", "==", userId), limit(1))
  const usersSnapshot = await getDocs(q)

  if (usersSnapshot.empty) {
    notFound()
  }

  const userDoc = usersSnapshot.docs[0]
  const userData = userDoc.data()

  return <SendMessageForm userId={userDoc.id} username={userData.username} profilePicture={userData.profilePicture} />
}
