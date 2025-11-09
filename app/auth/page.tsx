"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  // useEffect(() => {
  //   // Check if user is already authenticated
  //   const checkAuth = async () => {
  //     const response = await fetch("/api/auth/check");
  //     const data = await response.json();
  //     if (data.authenticated) {
  //       router.push("/inbox");
  //     }
  //   };
  //   checkAuth();
  // }, [router]);

  const handleContinue = async () => {
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
}

const StartPage = () => {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl italic text-shadow-2xs">
        ANOTE
      </h1>

      <div className=" absolute bottom-10 w-80 ">
        <Link href="/auth">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-full shadow-2xl"
          >
            Get Started!
          </Button>
        </Link>
      </div>
    </div>
  );
};

interface SetUsernameProps {
  username: string;
  setUsername: (username: string) => void;
  handleContinue: (props: any) => void;
  loading: boolean;
}

const setUsernameScreen = ({
  username,
  setUsername,
  handleContinue,
  loading,
}: SetUsernameProps) => {
  return (
    <div className="min-h-screen  bg-[#1a1a1a] flex flex-col px-6 py-8 relative">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="text-white/70 hover:text-white hover:bg-white/10"
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

        <div className="w-96 space-y-6">
          <Input
            value={"@" + username}
            onChange={(e) =>
              setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
            }
            placeholder="@username"
            className="w-full h-14 bg-white/10 border-white/20 focus:border-none text-white placeholder:text-white/40 text-center text-lg rounded-full"
            maxLength={20}
          />
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={loading || !username.trim()}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-full shadow-2xl"
      >
        {loading ? "Creating..." : "Continue"}
      </Button>
    </div>
  );
};

interface SetProfileAvatarProps {
  profile: string;
  setProfile: (profile: string) => void;
  handleContinue: (props: any) => void;
  loading: boolean;
}
const setProfileAvatar = ({
  profile,
  setProfile,
  handleContinue,
  loading,
}: SetProfileAvatarProps) => {
  const CropPhotoCom = () => {
    return (
      <div className="absolute inset-0 w-full min-h-screen">
        <header className="w-full bg-white flex justify-between items-center">
          <div>
            <X className="text-xl text-black" />

            <p>Edit Photo</p>
          </div>

          <Check className="text-xl text-black" />
        </header>

        <div>{/* cropting photo */}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen  bg-[#1a1a1a] flex flex-col px-6 py-8 relative">
      <div className="w-full flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          back
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          skip
        </Button>
      </div>

      <div className="mt-20 flex flex-col items-center justify-center space-y-8 w-full">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Choose a <br></br>profile picture
          </h2>
        </div>

        <div className="space-y-6 w-48 h-48 rounded-full bg-neutral-500">
          <Image src={""} alt={""} fill />
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={loading || !profile}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-full shadow-2xl"
      >
        {loading ? "Uploading..." : "Choose photo"}
      </Button>
    </div>
  );
};
