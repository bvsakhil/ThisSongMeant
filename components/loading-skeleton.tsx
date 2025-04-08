export function LoadingSkeleton() {
  // Helper function to generate a random rotation like in MusicCard
  const getRandomRotation = (seed: number) => {
    return (seed % 5) - 2 // Range from -2 to 2 degrees
  }

  return (
    <div className="columns-1 gap-4 sm:gap-5 sm:columns-2 md:columns-4 lg:columns-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="mb-4 sm:mb-5 break-inside-avoid"
        >
          <div 
            className="relative overflow-hidden bg-white rounded-md shadow-md"
            style={{
              transform: `rotate(${getRandomRotation(i)}deg)`,
            }}
          >
            <div className="p-4 md:p-5 relative animate-pulse">
              {/* Album Cover, Title and Artist in one line */}
              <div className="mb-3 md:mb-4 flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
                {/* Spotify icon placeholder */}
                <div className="h-6 w-6 rounded-full bg-gray-200" />
              </div>

              {/* Note placeholder */}
              <div className="space-y-2 mb-3">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-5/6 bg-gray-200 rounded" />
                <div className="h-3 w-4/6 bg-gray-200 rounded" />
              </div>

              {/* Username and likes placeholder */}
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-gray-200" />
                  <div className="h-3 w-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* Sticker border effect */}
            <div className="absolute inset-0 border border-gray-200 rounded-md pointer-events-none" />
          </div>
        </div>
      ))}
    </div>
  )
} 