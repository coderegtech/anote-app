"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { Send, User, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Question {
  id: string;
  userId: string;
  username: string;
  profilePicture?: string;
  content: string;
  timestamp: number;
  replyCount: number;
}

interface Reply {
  id: string;
  content: string;
  username: string;
  timestamp: number;
}

export default function QuestionsFeed({
  currentUserId,
  currentUsername,
  currentProfilePicture,
}: {
  currentUserId: string;
  currentUsername: string;
  currentProfilePicture?: string;
}) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [replyUsername, setReplyUsername] = useState("");

  useEffect(() => {
    const questionsRef = collection(db, "questions");
    const q = query(questionsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const qs = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        username: doc.data().username,
        profilePicture: doc.data().profilePicture,
        content: doc.data().content,
        timestamp: doc.data().timestamp,
        replyCount: doc.data().replyCount || 0,
      }));
      setQuestions(qs);
    });

    return () => unsubscribe();
  }, []);

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || loading) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "questions"), {
        userId: currentUserId,
        username: currentUsername,
        profilePicture: currentProfilePicture || "",
        content: newQuestion.trim(),
        timestamp: Date.now(),
        replyCount: 0,
      });
      setNewQuestion("");
      toast({
        title: "Question posted!",
        description: "Your question is now public",
      });
    } catch (error) {
      console.error("Failed to post question:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = (questionId: string) => {
    const repliesRef = collection(db, "questions", questionId, "replies");
    const q = query(repliesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reps = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        username: doc.data().username,
        timestamp: doc.data().timestamp,
      }));

      console.log("replies: ", reps);
      setReplies(reps);
    });

    return unsubscribe;
  };

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
    fetchReplies(question.id);
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !selectedQuestion) return;

    try {
      const repliesRef = collection(
        db,
        "questions",
        selectedQuestion.id,
        "replies"
      );
      await addDoc(repliesRef, {
        content: newReply.trim(),
        username: replyUsername.trim() || "Anonymous",
        timestamp: Date.now(),
      });

      // Update reply count
      const questionRef = doc(db, "questions", selectedQuestion.id);
      await updateDoc(questionRef, {
        replyCount: increment(1),
      });

      setNewReply("");
      setReplyUsername("");
      toast({
        title: "Reply posted!",
        description: "Your reply has been added",
      });
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  return (
    <div className="min-h-screen  p-4">
      {/* Post Question Form */}
      <div className="bg-white p-4 rounded-2xl shadow-md mb-4">
        <form onSubmit={handlePostQuestion} className="space-y-3">
          <Textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question to the community..."
            className="min-h-[80px] resize-none rounded-xl border border-gray-300"
            maxLength={500}
          />
          <Button
            type="submit"
            size="lg"
            className="w-full  rounded-xl bg-gradient-to-b from-pink-500 to-red-400 text-white hover:bg-gray-700"
          >
            Post Feed
          </Button>
        </form>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white p-4 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setSelectedQuestion(question)}
          >
            <div className="flex gap-3 items-start">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={question.profilePicture}
                  alt={question.username}
                />
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">
                  @{question.username}
                </p>
                <p className="text-gray-700 mt-1 leading-relaxed">
                  {question.content}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>
                    {new Date(question.timestamp).toLocaleDateString()}
                  </span>
                  <span
                    onClick={() => handleQuestionClick(question)}
                    className="flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    {question.replyCount} replies
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {selectedQuestion && (
          <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50 p-4">
            <div className=" overflow-hidden w-full bg-white p-4 rounded-2xl shadow-lg  relative">
              <button
                onClick={() => setSelectedQuestion(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-lg mb-4">Question & Replies</h3>
              <div className="p-4 bg-gray-50 rounded-xl mb-4">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={selectedQuestion.profilePicture}
                      alt={selectedQuestion.username}
                    />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">
                      @{selectedQuestion.username}
                    </p>
                    <p className="text-gray-700 mt-1">
                      {selectedQuestion.content}
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-96 h-[calc(50vh)] overflow-y-auto">
                {selectedQuestion && replies.length === 0 ? (
                  <div className="h-40 overflow-y-auto mb-4">
                    <p className="text-center text-gray-400 text-sm py-4">
                      No replies yet. Be the first!
                    </p>
                  </div>
                ) : (
                  replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 bg-gray-50 rounded-xl mb-2"
                    >
                      <p className="font-semibold text-sm">@{reply.username}</p>
                      <p className="text-gray-700 mt-1">{reply.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(reply.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handlePostReply} className="space-y-2">
                <Input
                  value={replyUsername}
                  onChange={(e) => setReplyUsername(e.target.value)}
                  placeholder="Your name (optional)"
                  className="rounded-lg h-12 border border-gray-300"
                  maxLength={30}
                />
                <div className="flex gap-2">
                  <Input
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 rounded-lg h-12 border border-gray-300"
                    maxLength={500}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-lg h-12 w-12 bg-gradient-to-b from-pink-500 to-red-400 text-white hover:bg-gray-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
