"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface BirthdayCakeProps {
  onAllCandlesBlown: () => void
}

interface Candle {
  id: number
  isLit: boolean
  showSmoke: boolean
}

export function BirthdayCake({ onAllCandlesBlown }: BirthdayCakeProps) {
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, isLit: true, showSmoke: false },
    { id: 2, isLit: true, showSmoke: false },
    { id: 3, isLit: true, showSmoke: false },
    { id: 4, isLit: true, showSmoke: false },
    { id: 5, isLit: true, showSmoke: false },
  ])
  const [isListening, setIsListening] = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const [micPermission, setMicPermission] = useState<"pending" | "granted" | "denied">("pending")
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const blowOutCandle = useCallback(() => {
    setCandles((prev) => {
      const litCandles = prev.filter((c) => c.isLit)
      if (litCandles.length === 0) return prev

      const randomIndex = Math.floor(Math.random() * litCandles.length)
      const candleToBlowOut = litCandles[randomIndex]

      return prev.map((c) =>
        c.id === candleToBlowOut.id ? { ...c, isLit: false, showSmoke: true } : c
      )
    })
  }, [])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setMicPermission("granted")

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      setIsListening(true)
      setShowInstruction(false)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      let cooldown = false

      const checkVolume = () => {
        if (!analyserRef.current) return

        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length

        if (average > 50 && !cooldown) {
          blowOutCandle()
          cooldown = true
          setTimeout(() => {
            cooldown = false
          }, 500)
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume)
      }

      checkVolume()
    } catch {
      setMicPermission("denied")
    }
  }, [blowOutCandle])

  useEffect(() => {
    const allBlown = candles.every((c) => !c.isLit)
    if (allBlown && isListening) {
      setTimeout(() => {
        onAllCandlesBlown()
      }, 2000)
    }
  }, [candles, isListening, onAllCandlesBlown])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      candles.forEach((_, index) => {
        setTimeout(() => {
          setCandles((prev) => prev.map((c, i) => (i === index ? { ...c, showSmoke: false } : c)))
        }, 1000)
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [candles])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <h1
          className="font-script text-pink text-center px-4"
          style={{ fontSize: "clamp(32px, 10vw, 80px)" }}
        >
          Happy Birthday Pancha
        </h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Candles */}
        <div className="flex gap-4 sm:gap-6 mb-0">
          {candles.map((candle, index) => (
            <div
              key={candle.id}
              className="relative flex flex-col items-center"
              style={{
                transform: `translateY(${index % 2 === 0 ? 0 : -8}px)`,
              }}
            >
              {/* Smoke */}
              {candle.showSmoke && !candle.isLit && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="w-3 h-6 bg-gray-400/60 rounded-full blur-sm animate-smoke" />
                </div>
              )}

              {/* Flame */}
              {candle.isLit && (
                <div className="relative mb-1">
                  <div
                    className="w-3 h-5 sm:w-4 sm:h-6 rounded-full animate-flicker"
                    style={{
                      background: "linear-gradient(to top, #ff6b35, #ffc107, #fff9c4)",
                      boxShadow: "0 0 20px #ffc107, 0 0 40px #ff6b35",
                    }}
                  />
                  <div className="absolute inset-0 w-3 h-5 sm:w-4 sm:h-6 rounded-full blur-md bg-orange-400/50" />
                </div>
              )}

              {/* Candle Body */}
              <div
                className="w-3 h-12 sm:w-4 sm:h-16 rounded-sm"
                style={{
                  background: "linear-gradient(90deg, #f8bbd9, #f48fb1, #f8bbd9)",
                  boxShadow: "inset -2px 0 4px rgba(0,0,0,0.2)",
                }}
              >
                {/* Candle Stripe */}
                <div
                  className="w-full h-full opacity-30"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Cake */}
        <div className="relative">
          {/* Cake Top Layer */}
          <div
            className="w-48 h-8 sm:w-64 sm:h-10 rounded-t-lg mx-auto"
            style={{
              background: "linear-gradient(180deg, #f8bbd9, #f48fb1)",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3)",
            }}
          >
            {/* Frosting Drips */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-around">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-4 rounded-b-full"
                  style={{
                    background: "#f8bbd9",
                    transform: `translateY(${Math.random() * 4}px)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Cake Middle Layer */}
          <div
            className="w-56 h-12 sm:w-72 sm:h-16 mx-auto"
            style={{
              background: "linear-gradient(180deg, #ffb74d, #ff9800)",
              boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.1)",
            }}
          />

          {/* Cake Bottom Layer */}
          <div
            className="w-64 h-16 sm:w-80 sm:h-20 rounded-b-lg mx-auto"
            style={{
              background: "linear-gradient(180deg, #f8bbd9, #ec407a)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {/* Cake Decorations */}
            <div className="absolute bottom-2 left-4 right-4 flex justify-around">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#ffc107" : "#fff",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Cake Plate */}
          <div
            className="w-72 h-4 sm:w-96 sm:h-5 rounded-full mx-auto mt-1"
            style={{
              background: "linear-gradient(180deg, #e0e0e0, #9e9e9e)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          />
        </div>

        {/* Instructions */}
        {showInstruction && (
          <button
            onClick={startListening}
            className="mt-8 px-8 py-4 bg-gold/20 hover:bg-gold/30 border border-gold/50 rounded-full text-gold font-medium transition-all hover:scale-105"
          >
            {micPermission === "denied"
              ? "Microphone Access Denied - Tap candles to blow"
              : "Tap to Enable Microphone & Blow"}
          </button>
        )}

        {isListening && candles.some((c) => c.isLit) && (
          <p className="mt-8 text-gold/80 text-center font-script text-xl sm:text-2xl animate-pulse">
            Blow gently to extinguish the candles...
          </p>
        )}

        {candles.every((c) => !c.isLit) && (
          <p className="mt-8 text-gold text-center font-script text-2xl sm:text-3xl animate-pulse-gold">
            Make a wish, Pancha!
          </p>
        )}
      </div>

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
