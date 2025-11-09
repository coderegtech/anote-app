import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, signInAnonymously, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  auth = getAuth(app)
  db = getFirestore(app)
}

export const getClientAuth = () => {
  if (!auth) {
    throw new Error("Firebase auth is only available on the client side")
  }
  return auth
}

export const getClientDb = () => {
  if (!db) {
    throw new Error("Firebase db is only available on the client side")
  }
  return db
}

export { auth, db, signInAnonymously }
