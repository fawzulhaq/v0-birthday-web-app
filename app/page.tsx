"use client"

import { useState, useEffect, useRef } from "react"
import { Countdown } from "@/components/birthday/countdown"
import { BirthdayCake } from "@/components/birthday/birthday-cake"
import { ScavengerHunt } from "@/components/birthday/scavenger-hunt"
import { FinalGallery } from "@/components/birthday/final-gallery"

type Phase = "countdown" | "cake" | "hunt" | "gallery"

// Local birthday music file
const BIRTHDAY_MUSIC_URL = "/v0-birthday-web-app/audio/HBD.mp3"

export default function BirthdayPage() {
  const [phase, setPhase] = useState<Phase>("countdown")
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(BIRTHDAY_MUSIC_URL)
    audio.loop = true
    audio.volume = 0.5
    audio.preload = "auto"
    
    audio.addEventListener("canplaythrough", () => {
      setAudioLoaded(true)
    })
    
    audio.addEventListener("error", () => {
      console.log("[v0] Audio failed to load, continuing without music")
      setAudioLoaded(true) // Still allow app to function
    })

    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Play music when entering cake phase
  useEffect(() => {
    if (phase === "cake" && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // Autoplay blocked, user needs to interact
        console.log("[v0] Autoplay blocked, user interaction needed")
      })
    }
  }, [phase, isPlaying])

  const handleCountdownComplete = () => {
    setPhase("cake")
  }

  const handleCandlesBlown = () => {
    // Fade out music when candles are blown
    if (audioRef.current && isPlaying) {
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05
        } else {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.volume = 0.5 // Reset for later
          }
          setIsPlaying(false)
          clearInterval(fadeOut)
        }
      }, 100)
    }

    setTimeout(() => {
      setPhase("hunt")
    }, 500)
  }

  const handleHuntComplete = () => {
    setPhase("gallery")
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {
          console.log("[v0] Audio play failed")
        })
      }
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
