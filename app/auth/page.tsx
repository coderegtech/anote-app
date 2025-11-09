"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth, db, signInAnonymously } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ArrowLeft, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<"start" | "username" | "profile">("start");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGetStarted = () => {
    setStep("username");
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const exists = await checkUsernameExists(username.trim());
      if (exists) {
        toast({
          title: "Username Taken",
          description:
            "This username is already in use. Please choose another.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      setStep("profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipProfile = async () => {
    await completeSignup();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => setProfilePicture(reader.result as string);
    reader.readAsDataURL(file);

    setProfileFile(file);
  };

  const completeSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        uid: userId,
        username: username.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      if (profileFile) {
        const formData = new FormData();
        formData.append("file", profileFile);
        formData.append("userId", userId);

        const uploadRes = await fetch("/api/upload-profile", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload file");

        const { url } = await uploadRes.json();

        await updateDoc(doc(db, "users", userId), {
          profilePicture: url,
          updatedAt: Date.now(),
        });
      }

      toast({
        title: "Welcome!",
        description: "Your account has been created successfully",
      });

      router.push("/inbox");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === "start") {
    return (
      <div className="mobile-full-height min-h-screen bg-gradient-to-b from-pink-500 to-red-400 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl italic">
          ANOTE
        </h1>

        <div className="fixed bottom-8 left-4 right-4 max-w-md mx-auto">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-2xl"
          >
            Get Started!
          </Button>
        </div>
      </div>
    );
  }

  if (step === "username") {
    return (
      <div className="mobile-full-height min-h-screen bg-[#1a1a1a] flex flex-col px-4 py-6 relative">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("start")}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            back
          </Button>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center space-y-8 w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              Choose a username
            </h2>
          </div>

          <div className="w-full max-w-sm space-y-6">
            <Input
              value={"@" + username}
              onChange={(e) =>
                setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
              }
              placeholder="@username"
              className="w-full h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-center text-lg rounded-xl"
              maxLength={20}
            />
          </div>
        </div>

        <div className="fixed bottom-8 left-4 right-4 max-w-md mx-auto">
          <Button
            onClick={handleUsernameSubmit}
            disabled={loading || !username.trim()}
            className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-2xl disabled:opacity-50"
          >
            {loading ? "Checking..." : "Continue"}
          </Button>
        </div>
      </div>
    );
  }

  if (step === "profile") {
    return (
      <div className="mobile-full-height min-h-screen bg-[#1a1a1a] flex flex-col px-4 py-6 relative">
        <div className="w-full flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("username")}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            back
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipProfile}
            disabled={loading}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
          >
            skip
          </Button>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center space-y-8 w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              Choose a<br />
              profile picture
            </h2>
          </div>

          <div
            className="relative w-48 h-48 rounded-2xl bg-neutral-500 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => fileInputRef.current?.click()}
          >
            {profilePicture ? (
              <Image
                src={profilePicture || "/placeholder.svg"}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-20 h-20 text-white/50" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="fixed bottom-8 left-4 right-4 max-w-md mx-auto">
          <Button
            onClick={completeSignup}
            disabled={loading}
            className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-2xl disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : profilePicture
              ? "Continue"
              : "Choose photo"}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
