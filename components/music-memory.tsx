"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Memory {
  id: string
  title: string
  artist: string
  albumCover: string
  note: string
  username: string
  likes: number
  color: string
  rotation: number
  type: "polaroid" | "album" | "ticket"
}

interface MusicMemoryProps {
  memory: Memory
}

export function MusicMemory({ memory }: MusicMemoryProps) {
  const [likes, setLikes] = useState(memory.likes)
  const [hasLiked, setHasLiked] = useState(false)

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setHasLiked(!hasLiked)
  }

  // Get color classes based on the memory color
  const getColorClasses = () => {
    switch (memory.color) {
      case "red":
        return {
          border: "border-red-300",
          bg: "bg-red-50",
          accent: "bg-red-200",
          text: "text-red-900",
        }
      case "blue":
        return {
          border: "border-blue-300",
          bg: "bg-blue-50",
          accent: "bg-blue-200",
          text: "text-blue-900",
        }
      case "green":
        return {
          border: "border-green-300",
          bg: "bg-green-50",
          accent: "bg-green-200",
          text: "text-green-900",
        }
      case "purple":
        return {
          border: "border-purple-300",
          bg: "bg-purple-50",
          accent: "bg-purple-200",
          text: "text-purple-900",
        }
      case "yellow":
        return {
          border: "border-yellow-300",
          bg: "bg-yellow-50",
          accent: "bg-yellow-200",
          text: "text-yellow-900",
        }
      default:
        return {
          border: "border-amber-300",
          bg: "bg-amber-50",
          accent: "bg-amber-200",
          text: "text-amber-900",
        }
    }
  }

  const colorClasses = getColorClasses()

  // Render different memory types
  const renderMemoryByType = () => {
    switch (memory.type) {
      case "polaroid":
        return (
          <div
            className={cn(
              "group relative overflow-hidden rounded-md border-8 border-t-[16px] border-b-[32px] bg-white p-2 shadow-md transition-all hover:shadow-lg",
              colorClasses.border,
            )}
            style={{ transform: `rotate(${memory.rotation}deg)` }}
          >
            {/* Thumbtack */}
            <div className="absolute -top-3 left-1/2 z-10 h-6 w-6 -translate-x-1/2 rounded-full bg-red-500 shadow-md"></div>

            {/* Album cover */}
            <div className="relative mb-2 aspect-square overflow-hidden">
              <img
                src={memory.albumCover || "/placeholder.svg"}
                alt={`${memory.title} by ${memory.artist}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 border border-gray-300 shadow-inner"></div>
            </div>

            {/* Song info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
              <h3 className="text-sm font-bold text-gray-900">{memory.title}</h3>
              <p className="text-xs text-gray-700">{memory.artist}</p>
            </div>

            {/* Note (appears on hover) */}
            <div className="absolute inset-0 flex flex-col justify-center bg-white bg-opacity-90 p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="mb-2 font-handwriting text-sm italic text-gray-800">"{memory.note}"</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-gray-600">- {memory.username}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${hasLiked ? "text-red-600" : "text-red-400"} hover:text-red-600`}
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                  </Button>
                  <span className="text-xs font-medium text-gray-800">{likes}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "album":
        return (
          <div
            className="group relative overflow-hidden rounded-md shadow-lg transition-all hover:shadow-xl"
            style={{ transform: `rotate(${memory.rotation}deg)` }}
          >
            {/* Tape element */}
            <div className="absolute -right-2 -top-2 z-10 h-8 w-16 rotate-45 bg-amber-300 bg-opacity-70 shadow"></div>

            {/* Album cover */}
            <div className="relative aspect-square overflow-hidden border-8 border-gray-900">
              <img
                src={memory.albumCover || "/placeholder.svg"}
                alt={`${memory.title} by ${memory.artist}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 border border-gray-300 shadow-inner"></div>
            </div>

            {/* Album info */}
            <div className={cn("p-3", colorClasses.bg)}>
              <h3 className="font-medium text-gray-900">{memory.title}</h3>
              <p className="text-sm text-gray-700">{memory.artist}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs italic text-gray-600">- {memory.username}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${hasLiked ? "text-red-600" : "text-red-400"} hover:text-red-600`}
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                  </Button>
                  <span className="text-xs font-medium text-gray-800">{likes}</span>
                </div>
              </div>
            </div>

            {/* Note on back (appears on hover) */}
            <div className="absolute inset-0 flex flex-col justify-center bg-white bg-opacity-95 p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <div className={cn("rounded-md p-4", colorClasses.bg)}>
                <p className="mb-2 font-handwriting text-sm italic text-gray-800">"{memory.note}"</p>
              </div>
            </div>
          </div>
        )

      case "ticket":
        return (
          <div
            className={cn(
              "group relative overflow-hidden rounded-md border-2 bg-white p-4 shadow-md transition-all hover:shadow-lg",
              colorClasses.border,
            )}
            style={{ transform: `rotate(${memory.rotation}deg)` }}
          >
            {/* Pushpin */}
            <div className="absolute -left-1 -top-1 z-10 h-4 w-4 rounded-full bg-red-600 shadow-sm"></div>

            {/* Ticket stub design */}
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-300">
                <img
                  src={memory.albumCover || "/placeholder.svg"}
                  alt={`${memory.title} by ${memory.artist}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{memory.title}</h3>
                <p className="text-sm text-gray-700">{memory.artist}</p>
                <div
                  className={cn(
                    "mt-1 inline-block rounded-sm px-2 py-0.5 text-xs",
                    colorClasses.accent,
                    colorClasses.text,
                  )}
                >
                  ADMIT ONE
                </div>
              </div>
            </div>

            {/* Perforated line */}
            <div className="my-3 border-t border-dashed border-gray-300"></div>

            {/* Note */}
            <div className="font-handwriting text-sm italic text-gray-800">"{memory.note}"</div>

            {/* Footer */}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs italic text-gray-600">- {memory.username}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${hasLiked ? "text-red-600" : "text-red-400"} hover:text-red-600`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                </Button>
                <span className="text-xs font-medium text-gray-800">{likes}</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return renderMemoryByType()
}

