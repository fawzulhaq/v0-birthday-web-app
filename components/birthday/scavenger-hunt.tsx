"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Sparkles, ChevronRight, CheckCircle } from "lucide-react"

interface ScavengerHuntProps {
  onComplete: () => void
}

interface Riddle {
  id: number
  question: string
  hint: string
  answer: string
  image: string
  memoryTitle: string
}

const riddles: Riddle[] = [
  {
    id: 1,
    question: "I'm the place where hearts first knew, something special was born, just between me and you. Where did our story begin?",
    hint: "Think about our first meaningful moment together...",
    answer: "heart",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-WoPAJEMVYJGhEqLlhDWMYsUCdqrtBv.jpeg",
    memoryTitle: "Where It All Began",
  },
  {
    id: 2,
    question: "I'm not a word, but I speak so loud. In your eyes, I see it proud. What feeling makes us who we are?",
    hint: "The most powerful feeling in the world...",
    answer: "love",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-Gy2s9r8yZZJLeFgOuEOzFxiWY70Is7.jpeg",
    memoryTitle: "A Beautiful Moment",
  },
  {
    id: 3,
    question: "We laugh, we cry, we share our dreams. In every moment, our bond just gleams. What are we called, you and me?",
    hint: "Two people who share everything...",
    answer: "soulmates",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-o9TvSIeEv2QusN9X99b4NRmLD1asWL.jpeg",
    memoryTitle: "Forever Together",
  },
]

export function ScavengerHunt({ onComplete }: ScavengerHuntProps) {
  const [currentRiddle, setCurrentRiddle] = useState(0)
  const [answer, setAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [solvedRiddles, setSolvedRiddles] = useState<number[]>([])
  const [shake, setShake] = useState(false)

  const riddle = riddles[currentRiddle]

  const checkAnswer = () => {
    const normalizedAnswer = answer.toLowerCase().trim()
    const correctAnswers = riddle.answer.toLowerCase().split("|")

    if (correctAnswers.some((a) => normalizedAnswer.includes(a))) {
      setSolvedRiddles([...solvedRiddles, riddle.id])
      setShowImage(true)
      setAnswer("")
      setShowHint(false)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  const nextRiddle = () => {
    if (currentRiddle < riddles.length - 1) {
      setCurrentRiddle(currentRiddle + 1)
      setShowImage(false)
    } else {
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 overflow-auto">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-script text-3xl sm:text-4xl text-gold-gradient mb-2">
            The Journey of Us
          </h2>
          <p className="text-pink-light/70 text-sm">
            Solve the riddles to unlock our memories, Pancha
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-3 mb-8">
          {riddles.map((r, i) => (
            <div
              key={r.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                solvedRiddles.includes(r.id)
                  ? "bg-gold/20 border-gold text-gold"
                  : i === currentRiddle
                    ? "border-pink bg-pink/10 text-pink"
                    : "border-gray-600 text-gray-600"
              }`}
            >
              {solvedRiddles.includes(r.id) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{i + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className={`glass rounded-2xl p-6 sm:p-8 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          style={{
            animation: shake ? "shake 0.5s ease-in-out" : undefined,
          }}
        >
          {!showImage ? (
            <>
              {/* Riddle */}
              <div className="flex items-start gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <p className="text-foreground text-lg sm:text-xl leading-relaxed font-script" style={{ fontWeight: 400 }}>
                  <span className="text-gold text-3xl">"</span>
                  {riddle.question}
                  <span className="text-gold text-3xl">"</span>
                </p>
              </div>

              {/* Hint */}
              {showHint && (
                <div className="mb-6 p-4 bg-pink/10 rounded-lg border border-pink/20">
                  <p className="text-pink-light text-sm italic">
                    <Heart className="w-4 h-4 inline mr-2" />
                    {riddle.hint}
                  </p>
                </div>
              )}

              {/* Input */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-background/50 border border-gold/30 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowHint(true)}
                    disabled={showHint}
                    className="flex-1 px-4 py-3 bg-pink/10 hover:bg-pink/20 border border-pink/30 rounded-xl text-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hint
                  </button>
                  <button
                    onClick={checkAnswer}
                    className="flex-1 px-4 py-3 bg-gold/20 hover:bg-gold/30 border border-gold/50 rounded-xl text-gold font-medium transition-all hover:scale-[1.02]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Memory Revealed */}
              <div className="text-center">
                <h3 className="font-script text-2xl text-gold mb-4">{riddle.memoryTitle}</h3>
                <div className="relative aspect-[4/3] w-full mb-6 rounded-xl overflow-hidden bg-gray-800 border-2 border-gold/30">
                  <Image
                    src={riddle.image}
                    alt={riddle.memoryTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                <button
                  onClick={nextRiddle}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold/20 hover:bg-gold/30 border border-gold/50 rounded-full text-gold font-medium transition-all hover:scale-105"
                >
                  {currentRiddle < riddles.length - 1 ? (
                    <>
                      Next Memory <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Continue to Gallery <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Level indicator */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Level {currentRiddle + 1} of {riddles.length}
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
