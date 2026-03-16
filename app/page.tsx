"use client"

import { useState, useEffect, useRef } from "react"
import { Countdown } from "@/components/birthday/countdown"
import { BirthdayCake } from "@/components/birthday/birthday-cake"
import { ScavengerHunt } from "@/components/birthday/scavenger-hunt"
import { FinalGallery } from "@/components/birthday/final-gallery"
import { BirthdayMelody } from "@/lib/audio"

type Phase = "countdown" | "cake" | "hunt" | "gallery"

export default function BirthdayPage() {
  const [phase, setPhase] = useState<Phase>("countdown")
  const [isPlaying, setIsPlaying] = useState(false)
  const melodyRef = useRef<BirthdayMelody | null>(null)

  // Initialize audio
  useEffect(() => {
    melodyRef.current = new BirthdayMelody()

    return () => {
      if (melodyRef.current) {
        melodyRef.current.stop()
        melodyRef.current = null
      }
    }
  }, [])

  // Play music when entering cake phase
  useEffect(() => {
    if (phase === "cake" && melodyRef.current && !isPlaying) {
      melodyRef.current.play()
      setIsPlaying(true)
    }
  }, [phase, isPlaying])

  const handleCountdownComplete = () => {
    setPhase("cake")
  }

  const handleCandlesBlown = () => {
    // Stop music when candles are blown
    if (melodyRef.current) {
      melodyRef.current.stop()
      setIsPlaying(false)
    }

    setTimeout(() => {
      setPhase("hunt")
    }, 500)
  }

  const handleHuntComplete = () => {
    setPhase("gallery")
  }

  const toggleMusic = () => {
    if (melodyRef.current) {
      const playing = melodyRef.current.toggle()
      setIsPlaying(playing)
    }
  }

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {phase === "countdown" && <Countdown onComplete={handleCountdownComplete} />}
      {phase === "cake" && <BirthdayCake onAllCandlesBlown={handleCandlesBlown} />}
      {phase === "hunt" && <ScavengerHunt onComplete={handleHuntComplete} />}
      {phase === "gallery" && <FinalGallery />}

      {/* Music Toggle Button */}
      {phase !== "countdown" && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold hover:bg-gold/30 transition-all"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      )}
    </main>
  )
}
