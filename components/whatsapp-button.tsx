"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const phoneNumber = "56939022969"
  const whatsappUrl = `https://wa.me/${phoneNumber}`

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-18 md:w-18 overflow-hidden ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      }`}
    >
      <Image 
        src="/banner-logo.png" 
        alt="AIntegration" 
        width={48} 
        height={48} 
        className="object-contain p-1"
      />
      <span className="sr-only">Contactar por WhatsApp</span>
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
    </a>
  )
}
