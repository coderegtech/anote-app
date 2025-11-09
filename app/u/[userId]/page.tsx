import SendMessageForm from "@/components/send-message-form"
import { adminDb } from "@/lib/firebase-admin"
import { notFound } from "next/navigation"

export default async function SendMessagePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const usersSnapshot = await adminDb.collection("users").where("username", "==", userId).limit(1).get()

  if (usersSnapshot.empty) {
    notFound()
  }

  const userDoc = usersSnapshot.docs[0]
  const userData = userDoc.data()

  return <SendMessageForm userId={userDoc.id} username={userData.username} profilePicture={userData.profilePicture} />
}
