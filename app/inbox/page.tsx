import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import InboxClient from "@/components/inbox-client"

export default async function InboxPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) {
    redirect("/welcome")
  }

  return <InboxClient userId={userId} />
}
