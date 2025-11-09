"use client"

import InboxClient from "@/components/inbox-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export default function InboxPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth")
        return
      }

      try {
        const userRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          router.push("/auth")
          return
        }

        setUserData({
          userId: user.uid,
          ...userDoc.data(),
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!userData) return null

  return <InboxClient userId={userData.userId} username={userData.username} profilePicture={userData.profilePicture} />
}
