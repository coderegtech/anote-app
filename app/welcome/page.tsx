"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000" />
      </div>

      <div
        className={`relative z-10 text-center space-y-8 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <h1
          className="text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl"
          style={{
            textShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.1)",
            WebkitTextStroke: "3px rgba(0,0,0,0.1)",
          }}
        >
          AMS
        </h1>

        <div className="pt-12">
          <Link href="/auth">
            <Button
              size="lg"
              className="w-full max-w-xs h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-full shadow-2xl"
            >
              Get Started!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
