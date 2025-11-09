"use client"

import SendMessageForm from "@/components/send-message-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, limit } from "firebase/firestore"

export default function SendMessagePage() {
  const params = useParams()
  const userId = params.userId as string
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", userId), limit(1))
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          setNotFound(true)
          return
        }

        const userDoc = snapshot.docs[0]
        setUserData({
          userId: userDoc.id,
          username: userDoc.data().username,
          profilePicture: userDoc.data().profilePicture,
        })
      } catch (error) {
        console.error("Error fetching user:", error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (notFound || !userData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">User Not Found</h1>
          <p>This user does not exist</p>
        </div>
      </div>
    )
  }

  return (
    <SendMessageForm userId={userData.userId} username={userData.username} profilePicture={userData.profilePicture} />
  )
}
