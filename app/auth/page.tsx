"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check")
      const data = await response.json()
      if (data.authenticated) {
        router.push("/inbox")
      }
    }
    checkAuth()
  }, [router])

  const handleContinue = async () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/anonymous", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to sign in")
      }

      toast({
        title: "Welcome!",
        description: "Your account has been created.",
      })

      router.push("/inbox")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/welcome")}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          back
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto w-full">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-white">Choose a username</h2>
        </div>

        <div className="w-full space-y-6">
          <div className="relative">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              placeholder="myusername"
              className="w-full h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-center text-lg rounded-full pl-12"
              maxLength={20}
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 text-lg">@</span>
          </div>

          <Button
            onClick={handleContinue}
            disabled={loading || !username.trim()}
            className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-full"
          >
            {loading ? "Creating..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
