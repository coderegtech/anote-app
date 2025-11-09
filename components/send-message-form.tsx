"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function SendMessageForm({
  userId,
  username,
  profilePicture,
}: {
  userId: string;
  username: string;
  profilePicture?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("send me anonymous message!");

  useEffect(() => {
    const fetchNoteText = async () => {
      const usersRef = collection(db, `users/${userId}/notes`);
      const q = query(usersRef, where("username", "==", username), limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return;
      }

      const userDoc = snapshot.docs[0];
      const data = {
        userId: userDoc.data().userId,
        username: userDoc.data().username,
        note: userDoc.data().note,
      };

      setNote(data.note);
    };

    fetchNoteText();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please write a message before sending",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      await addDoc(collection(db, "messages"), {
        recipientId: userId,
        note: note,
        content: message.trim(),
        timestamp: Date.now(),
        read: false,
      });

      toast({
        title: "Message Sent!",
        description: "Your anonymous message has been delivered",
      });

      setMessage("");

      // setTimeout(() => {
      //   router.push("/auth");
      // }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-500 to-red-400 flex flex-col items-center justify-between px-6 py-8">
      <div className="w-full max-w-xl pt-8">
        <div className="bg-white/95 flex items-start gap-3 p-4 rounded-t-2xl shadow-2xl">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarImage
              src={profilePicture || "/placeholder.svg"}
              alt={username}
            />
            <AvatarFallback className="bg-gray-400">
              <User className="w-5 h-5 text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-base text-gray-900">@{username}</p>
            <p className="text-base font-bold text-gray-900">{note}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="send message.."
            className="min-h-32 p-4 text-base resize-none border-0 rounded-b-2xl rounded-t-none bg-pink-200 focus:bg-pink-200 text-black placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            maxLength={500}
            disabled={sending}
          />
          {message && (
            <Button
              type="submit"
              className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 font-bold text-lg shadow-2xl mt-4 flex items-center justify-center"
            >
              {sending ? "Sending..." : "Send!"}
            </Button>
          )}
        </form>
      </div>

      <div className="w-full max-w-md space-y-4">
        <Button
          onClick={() => router.push("/auth")}
          variant="outline"
          className="w-full h-14 rounded-full bg-white text-black hover:bg-white font-bold text-lg shadow-2xl border-0"
        >
          Get your own messages!
        </Button>
      </div>
    </div>
  );
}
