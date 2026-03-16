"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react"

const galleryImages = [
  { id: 1, src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-hMCovEiexNGsdFNkm7oPfwCV33nZTx.jpeg", caption: "Our First Adventure" },
  { id: 2, src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-1cgiGDb9rSJhb32a9uCf0dcXLO4gGX.jpeg", caption: "Laughing Together" },
  { id: 3, src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-wTh7LYtMqND8JXwxvEQD7tlorH3H33.jpeg", caption: "Golden Moments" },
  { id: 4, src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-jPGtmgaswJiGoPjeCYu8P5saPa8TOb.jpeg", caption: "Sweet Memories" },
  { id: 5, src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-GZ4Ppu6A1EQAQbXjRYKclJAMeuAHwX.jpeg", caption: "Always & Forever" },
  { id: 6, src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-is6j6fKaQEEk0sRIfJxIZcTY6dUZJq.jpeg", caption: "Our Happy Place" },
]

export function FinalGallery() {
  const [showEnding, setShowEnding] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [visibleImages, setVisibleImages] = useState<number[]>([])
  const [viewedImages, setViewedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Stagger image reveals
    galleryImages.forEach((_, index) => {
      setTimeout(() => {
        setVisibleImages((prev) => [...prev, index])
      }, index * 200)
    })
  }, [])



  const openImage = (index: number) => {
    setSelectedImage(index)
    setViewedImages((prev) => new Set([...prev, index]))
  }

  const closeImage = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      // If on the last image, show ending message
      if (selectedImage === galleryImages.length - 1) {
        setSelectedImage(null)
        setShowEnding(true)
      } else {
        const nextIndex = selectedImage + 1
        setSelectedImage(nextIndex)
        setViewedImages((prev) => new Set([...prev, nextIndex]))
      }
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      const prevIndex = selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1
      setSelectedImage(prevIndex)
      setViewedImages((prev) => new Set([...prev, prevIndex]))
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "Escape") closeImage()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 overflow-auto">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-4">
        <h2 className="font-script text-3xl sm:text-5xl text-gold-gradient mb-3 animate-pulse-gold">
          Our Beautiful Memories
        </h2>
        <p className="text-pink-light/70 text-sm sm:text-base">
          A collection of moments that make my heart smile, Pancha
        </p>
        <p className="text-gold/50 text-xs mt-2">
          Tap on each photo to view ({viewedImages.size}/{galleryImages.length} viewed)
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openImage(index)}
              className={`relative aspect-square rounded-xl overflow-hidden group transition-all duration-700 ${
                visibleImages.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } ${viewedImages.has(index) ? "ring-2 ring-gold/50" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gray-800">
                <Image
                  src={image.src}
                  alt={image.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Viewed indicator */}
              {viewedImages.has(index) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-gold/80 rounded-full flex items-center justify-center z-10">
                  <Heart className="w-3 h-3 text-black fill-black" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-foreground text-sm font-medium text-center">{image.caption}</p>
              </div>

              {/* Border Effect */}
              <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/50 rounded-xl transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Ending Message */}
      {showEnding && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 animate-fade-in-up">
          <div className="text-center px-6">
            {/* Floating Hearts */}
            <div className="relative mb-8">
              {[...Array(12)].map((_, i) => (
                <Heart
                  key={i}
                  className="absolute text-pink/40 animate-float"
                  style={{
                    left: `${50 + Math.cos((i * Math.PI * 2) / 12) * 80}%`,
                    top: `${50 + Math.sin((i * Math.PI * 2) / 12) * 80}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${i * 0.2}s`,
                    width: `${16 + Math.random() * 16}px`,
                    height: `${16 + Math.random() * 16}px`,
                  }}
                />
              ))}
              <Heart className="w-20 h-20 mx-auto text-rose-500 fill-rose-500 animate-pulse" />
            </div>

            <h2
              className="font-script text-gold-gradient mb-6"
              style={{ fontSize: "clamp(36px, 10vw, 72px)" }}
            >
              Until we meet again
            </h2>

            <p className="text-pink-light text-lg sm:text-xl mb-8 max-w-md mx-auto leading-relaxed font-script">
              Happy Birthday, my dearest Pancha. May all your dreams come true and may this year bring
              you endless happiness.
            </p>

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-gold">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-script text-xl">With all my love</span>
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <p className="font-script text-2xl sm:text-3xl text-gold-gradient animate-pulse-gold">
                Pancha
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox with Slider */}
      {selectedImage !== null && !showEnding && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeImage}
        >
          {/* Close button */}
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 p-2 text-foreground/70 hover:text-foreground transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-gold/20 hover:bg-gold/40 border border-gold/50 rounded-full text-gold transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 border border-gold/50 rounded-full text-gold transition-all z-10 ${
              selectedImage === galleryImages.length - 1
                ? "bg-gold/40 hover:bg-gold/60 animate-pulse"
                : "bg-gold/20 hover:bg-gold/40"
            }`}
          >
            {selectedImage === galleryImages.length - 1 ? (
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
            ) : (
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            )}
          </button>

          {/* Image */}
          <div 
            className="relative max-w-3xl w-full aspect-square mx-12 sm:mx-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].caption}
              fill
              className="object-contain"
            />
          </div>

          {/* Caption and Progress */}
          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <p className="font-script text-xl sm:text-2xl text-gold mb-3">
              {galleryImages[selectedImage].caption}
            </p>
            {/* Dots indicator */}
            <div className="flex justify-center gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    openImage(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedImage 
                      ? "bg-gold w-6" 
                      : viewedImages.has(index)
                        ? "bg-gold/60"
                        : "bg-gold/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-gold/50 text-xs mt-2">
              {selectedImage + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}

      {/* Ambient Sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
