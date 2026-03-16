"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart } from "lucide-react"

interface CountdownProps {
  onComplete: () => void
}

interface FallingHeart {
  id: number
  left: number
  delay: number
  duration: number
  size: number
}

export function Countdown({ onComplete }: CountdownProps) {
  const [count, setCount] = useState<number | null>(null)
  const [hearts, setHearts] = useState<FallingHeart[]>([])
  const [isStarted, setIsStarted] = useState(false)

  const generateHearts = useCallback(() => {
    const newHearts: FallingHeart[] = []
    for (let i = 0; i < 30; i++) {
      newHearts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        size: 16 + Math.random() * 24,
      })
    }
    setHearts(newHearts)
  }, [])

  useEffect(() => {
    generateHearts()
    const heartInterval = setInterval(generateHearts, 4000)
    return () => clearInterval(heartInterval)
  }, [generateHearts])

  useEffect(() => {
    if (!isStarted) {
      const startTimer = setTimeout(() => {
        setIsStarted(true)
        setCount(3)
      }, 1000)
      return () => clearTimeout(startTimer)
    }
  }, [isStarted])

  useEffect(() => {
    if (count === null || count < 0) return

    if (count === 0) {
      const completeTimer = setTimeout(onComplete, 800)
      return () => clearTimeout(completeTimer)
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, onComplete])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
      {/* Falling Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-rose-500 animate-heart-fall"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}px`,
          }}
        >
          <Heart className="fill-current" style={{ width: heart.size, height: heart.size }} />
        </div>
      ))}

      {/* Countdown Number */}
      <div className="relative z-10">
        {count !== null && count > 0 && (
          <div
            key={count}
            className="text-gold-gradient font-bold animate-countdown"
            style={{
              fontSize: "clamp(120px, 30vw, 300px)",
              textShadow: "0 0 60px rgba(212, 175, 55, 0.6)",
            }}
          >
            {count}
          </div>
        )}
        {count === 0 && (
          <div
            className="text-gold-gradient font-script animate-countdown text-center"
            style={{
              fontSize: "clamp(48px, 12vw, 100px)",
              textShadow: "0 0 60px rgba(212, 175, 55, 0.6)",
            }}
          >
            Happy Birthday!
          </div>
        )}
      </div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
