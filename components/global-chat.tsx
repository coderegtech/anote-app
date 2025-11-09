"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  profilePicture?: string;
  content: string;
  timestamp: number;
}

export default function GlobalChat({
  currentUserId,
  currentUsername,
  currentProfilePicture,
}: {
  currentUserId: string;
  currentUsername: string;
  currentProfilePicture?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatRef = collection(db, "chat");
    const q = query(chatRef, orderBy("timestamp", "asc"), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        username: doc.data().username,
        profilePicture: doc.data().profilePicture,
        content: doc.data().content,
        timestamp: doc.data().timestamp,
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "chat"), {
        userId: currentUserId,
        username: currentUsername,
        profilePicture: currentProfilePicture || "",
        content: newMessage.trim(),
        timestamp: Date.now(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.userId === currentUserId ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={msg.profilePicture || "/placeholder.svg"}
                  alt={msg.username}
                />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col ${
                  msg.userId === currentUserId ? "items-end" : ""
                }`}
              >
                <span className="text-xs text-gray-500 mb-1">
                  {msg.username}
                </span>
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[260px] ${
                    msg.userId === currentUserId
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-base rounded-lg h-12"
            maxLength={500}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-lg h-12 w-12 bg-gradient-to-b from-pink-500 to-red-400"
          >
            <Send className="w-5 h-5 size-10" />
          </Button>
        </div>
      </form>
    </div>
  );
}
