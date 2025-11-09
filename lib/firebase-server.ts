import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let adminApp: App | undefined
let adminDb: Firestore | undefined

// Only initialize on server side
if (typeof window === "undefined") {
  try {
    // Check if we have Firebase Admin credentials
    if (process.env.FIREBASE_PROJECT_ID) {
      if (!getApps().length) {
        // For Vercel deployment, use environment variables
        adminApp = initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        })
      } else {
        adminApp = getApps()[0]
      }
      adminDb = getFirestore(adminApp)
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
}

export const getServerDb = () => {
  if (!adminDb) {
    throw new Error(
      "Firebase Admin is not initialized. Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.",
    )
  }
  return adminDb
}

export { adminDb }
