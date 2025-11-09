import { notFound } from "next/navigation"
import SendMessageForm from "@/components/send-message-form"

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserMessagePage({ params }: PageProps) {
  const { userId } = await params

  if (!userId) {
    notFound()
  }

  // Verify user exists
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/users/${userId}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    notFound()
  }

  return <SendMessageForm userId={userId} />
}
