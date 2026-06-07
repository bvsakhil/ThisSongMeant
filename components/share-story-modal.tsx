"use client"

import { useEffect, useState } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { shareStoryImage } from "@/lib/share-story-image"

interface ShareStory {
  id: string
  title: string
  artist: string
}

interface ShareStoryModalProps {
  story: ShareStory | null
  onClose: () => void
}

export function ShareStoryModal({ story, onClose }: ShareStoryModalProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [shareError, setShareError] = useState("")

  const imageUrl = story ? `/api/share-card/${story.id}` : ""

  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
    setShareError("")
  }, [story?.id])

  const handleShare = async () => {
    if (!story || isSharing) return

    try {
      setIsSharing(true)
      setShareError("")
      await shareStoryImage({
        songId: story.id,
        title: story.title,
        artist: story.artist,
        openOnError: false,
      })
    } catch (error) {
      console.error('Error sharing story image:', error)
      setShareError("Couldn't share the image. Open the preview and save it manually.")
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={!!story} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-md overflow-y-auto rounded-lg bg-[#FFF8E1] p-5 sm:p-6">
        <DialogHeader className="pr-6 text-left">
          <DialogTitle className="font-instrument text-2xl text-[#333]">
            Your story is live
          </DialogTitle>
          <DialogDescription className="font-sans text-[#666]">
            Share this square card with the people who need the song too.
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-md border border-black/10 bg-white shadow-sm">
          {!imageLoaded && !imageError && (
            <div className="flex aspect-square items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#333] border-t-transparent" />
            </div>
          )}

          {imageError ? (
            <div className="flex aspect-square flex-col items-center justify-center gap-3 px-8 text-center font-sans text-sm text-[#666]">
              <p>Preview could not load right now.</p>
              {story && (
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#333] underline underline-offset-4"
                >
                  Open image directly
                </a>
              )}
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={story ? `Share card for ${story.title} by ${story.artist}` : "Share card"}
              className={`aspect-square w-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {shareError && (
          <p className="font-sans text-sm text-red-700">{shareError}</p>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full border-[#333] bg-transparent px-5 text-[#333] hover:bg-black/5"
            onClick={onClose}
          >
            Done
          </Button>
          <Button
            type="button"
            className="h-11 rounded-full bg-[#333] px-5 text-white hover:bg-[#555]"
            onClick={handleShare}
            disabled={!story || isSharing || imageError}
          >
            {isSharing ? (
              "Preparing..."
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share image
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
