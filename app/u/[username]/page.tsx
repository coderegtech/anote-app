import SendMessageForm from "@/components/send-message-form";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserMessagePage({ params }: PageProps) {
  const { username } = await params;

  if (!username) {
    notFound();
  }

  // Verify user exists
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/users/${username}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  return <SendMessageForm username={username} />;
}
