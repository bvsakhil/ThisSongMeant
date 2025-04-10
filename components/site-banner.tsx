"use client"

import { useState, useEffect } from "react"

interface SiteBannerProps {
  message: string
}

export function SiteBanner({ message }: SiteBannerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Subtle animation effect when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
        hasAnimated ? "bg-[#FFF2CC]" : "bg-[#FFF8E1]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background pattern - subtle dots */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-3 relative">
        <p
          className={`text-center text-sm font-medium text-[#333] transition-all duration-300 ${
            isHovered ? "tracking-wide scale-[1.01]" : "animate-subtle-pulse"
          }`}
        >
          {message}
        </p>
      </div>

      {/* Subtle gradient border at bottom */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-50"></div>

      {/* Add the enhanced pulse animation */}
      <style jsx global>{`
        @keyframes subtle-pulse {
          0% {
            opacity: 0.9;
            transform: scale(1);
            text-shadow: 0 0 0px rgba(0,0,0,0);
            color: #333333;
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
            text-shadow: 0 0 3px rgba(0,0,0,0.15);
            color: #000000;
          }
          100% {
            opacity: 0.9;
            transform: scale(1);
            text-shadow: 0 0 0px rgba(0,0,0,0);
            color: #333333;
          }
        }
        
        .animate-subtle-pulse {
          animation: subtle-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
