"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, X } from "lucide-react"

const galleryImages = [
  { id: 1, src: "/images/gallery-1.jpg", caption: "Our First Adventure" },
  { id: 2, src: "/images/gallery-2.jpg", caption: "Laughing Together" },
  { id: 3, src: "/images/gallery-3.jpg", caption: "Golden Moments" },
  { id: 4, src: "/images/gallery-4.jpg", caption: "Sweet Memories" },
  { id: 5, src: "/images/gallery-5.jpg", caption: "Always & Forever" },
  { id: 6, src: "/images/gallery-6.jpg", caption: "Our Happy Place" },
]

export function FinalGallery() {
  const [showEnding, setShowEnding] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [visibleImages, setVisibleImages] = useState<number[]>([])

  useEffect(() => {
    // Stagger image reveals
    galleryImages.forEach((_, index) => {
      setTimeout(() => {
        setVisibleImages((prev) => [...prev, index])
      }, index * 200)
    })

    // Show ending after gallery is revealed
    const endingTimer = setTimeout(() => {
      setShowEnding(true)
    }, galleryImages.length * 200 + 3000)

    return () => clearTimeout(endingTimer)
  }, [])

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
      </div>

      {/* Gallery Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-xl overflow-hidden group transition-all duration-700 ${
                visibleImages.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <Image
                  src={image.src}
                  alt={image.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground z-0">
                  <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto mb-1 text-pink/30" />
                    <p className="text-xs">Photo {image.id}</p>
                  </div>
                </div>
              </div>

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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fade-in-up">
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

            <div className="flex items-center justify-center gap-2 text-gold/70">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-sm">With all my love</span>
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-3xl w-full aspect-square">
            <Image
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].caption}
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-2 text-pink/30" />
                <p className="text-lg">Photo {galleryImages[selectedImage].id}</p>
              </div>
            </div>
          </div>

          <p className="absolute bottom-8 left-0 right-0 text-center font-script text-xl text-gold">
            {galleryImages[selectedImage].caption}
          </p>
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
