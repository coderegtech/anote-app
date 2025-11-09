"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useData } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Copy, LogOut, MessageSquare, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GlobalChat from "./global-chat";
import QuestionsFeed from "./questions-feed";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Message {
  id: string;
  note: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export default function InboxClient({
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "play" | "inbox" | "chat" | "feed"
  >("play");
  const [customNote, setCustomNote] = useState("send me anonymous message!");
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const { setData } = useData();

  const shareLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/u/${username}`;

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("recipientId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        note: doc.data().note,
        content: doc.data().content,
        timestamp: doc.data().timestamp,
        read: doc.data().read,
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Copy or share link
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied!",
      description: "Share it on your story.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Send me anonymous messages!",
        text: "Send me honest feedback anonymously.",
        url: shareLink,
      });
    } else {
      copyLink();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      toast({
        title: "Message deleted",
        description: "The message has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const saveNote = async (q: string) => {
    try {
      await addDoc(collection(db, "notes"), {
        uid: userId,
        username: username,
        note: q,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // auto save note
  useEffect(() => {
    saveNote(customNote);
  }, [customNote]);

  // Editable custom question
  const EditableQuestion = () => {
    const handleBlur = () => {
      const text = editableRef.current?.textContent?.trim() || "";
      setCustomNote(text);
      saveNote(text || customNote);
      setIsEditing(false);
    };

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(e.currentTarget);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    return (
      <div className="">
        {isEditing ? (
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Edit custom question"
            onBlur={handleBlur}
            onFocus={handleFocus}
            className="bg-transparent border-none outline-none shadow-none focus:outline-none text-white text-2xl font-medium text-center"
            dir="ltr"
            autoFocus
          >
            {customNote}
          </div>
        ) : (
          <p
            className="text-white text-2xl font-bold cursor-pointer text-center"
            onClick={() => setIsEditing(true)}
          >
            {customNote}
          </p>
        )}
      </div>
    );
  };

  // Inbox message list
  const InboxMessages = () => {
    if (loading)
      return <div className="text-center py-12 text-gray-500">Loading...</div>;

    if (messages.length === 0)
      return (
        <div className="text-center py-12 space-y-3">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-300" />
          <p className="text-gray-500 font-medium">No messages yet</p>
          <p className="text-sm text-gray-400">
            Share your link to get messages
          </p>
        </div>
      );

    return (
      <div className="space-y-4 max-w-md mx-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border-0 group relative"
          >
            <div className="bg-gradient-to-b from-pink-500 to-red-400 h-full p-4">
              <p className="text-center text-white font-bold text-base">
                {msg.note}
              </p>
            </div>
            <div className="bg-white p-4">
              <p className="text-gray-800 font-semibold text-center leading-relaxed">
                {msg.content}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(msg.timestamp).toLocaleDateString()}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteMessage(msg.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // PLAY tab
  const PlaySection = () => (
    <div className="space-y-6 max-w-md mx-auto pb-8">
      <Card className="max-w-sm mx-auto bg-gradient-to-b from-pink-500 to-red-400 border-0 shadow-xl overflow-hidden rounded-2xl">
        <div className="p-8 flex flex-col items-center justify-center min-h-[240px] text-center space-y-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={profilePicture || "/placeholder.svg"}
              alt={username}
            />
            <AvatarFallback className="bg-white/20 backdrop-blur-sm">
              <User className="text-white w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <EditableQuestion />
        </div>
      </Card>

      <div className="space-y-4 px-6 bg-neutral-100 rounded-2xl py-8">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">Copy your link</p>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-500 truncate">{shareLink}</p>
          </div>
          <Button
            onClick={copyLink}
            variant="outline"
            size="sm"
            className="max-w-36 rounded-full border-2 border-pink-500 text-black hover:bg-black hover:text-white font-semibold bg-transparent w-full"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy link
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mobile-full-height min-h-screen bg-white flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sticky top-0 bg-white z-10">
        <div className="flex gap-x-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("play")}
            className={`text-base sm:text-lg font-bold whitespace-nowrap pb-1 ${
              activeTab === "play"
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            PLAY
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={`text-base sm:text-lg font-bold whitespace-nowrap pb-1 ${
              activeTab === "inbox"
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            INBOX
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`text-base sm:text-lg font-bold whitespace-nowrap pb-1 ${
              activeTab === "chat"
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            CHAT
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={`text-base sm:text-lg font-bold whitespace-nowrap pb-1 ${
              activeTab === "feed"
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            FEED
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-black shrink-0"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {activeTab === "play" && <PlaySection />}
        {activeTab === "inbox" && <InboxMessages />}
        {activeTab === "chat" && (
          <GlobalChat
            currentUserId={userId}
            currentUsername={username}
            currentProfilePicture={profilePicture}
          />
        )}
        {activeTab === "feed" && (
          <QuestionsFeed
            currentUserId={userId}
            currentUsername={username}
            currentProfilePicture={profilePicture}
          />
        )}
      </div>
    </div>
  );
}
