export function LoadingSkeleton() {
  return (
    <div className="columns-1 gap-4 sm:gap-5 sm:columns-2 md:columns-3 lg:columns-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="mb-4 sm:mb-5 break-inside-avoid animate-pulse"
        >
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-sm bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-5/6 bg-gray-200 rounded" />
              <div className="h-3 w-4/6 bg-gray-200 rounded" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="h-3 w-1/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 