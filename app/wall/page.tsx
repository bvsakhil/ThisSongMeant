import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MusicCard } from "@/components/music-card"

export default function WallPage() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <header className="border-b border-amber-200 bg-amber-100 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-red-500">
              <div className="absolute inset-0 flex items-center justify-center text-white">♪</div>
            </div>
            <span className="text-xl font-bold tracking-tight text-red-800">MusicWall</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link href="/" className="text-sm font-medium text-red-800 hover:text-red-600">
              Home
            </Link>
            <Link href="/wall" className="text-sm font-medium text-red-800 hover:text-red-600">
              Wall
            </Link>
            <Link href="/about" className="text-sm font-medium text-red-800 hover:text-red-600">
              About
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h1 className="font-serif text-3xl font-bold text-red-800">The Music Wall</h1>
            <div className="flex w-full max-w-xs items-center gap-2">
              <Input
                type="search"
                placeholder="Filter stories..."
                className="border-2 border-red-200 bg-white text-red-800 placeholder:text-red-300"
              />
              <Button className="bg-red-600 text-white hover:bg-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MusicCard
                key={i}
                song={{
                  id: i.toString(),
                  title: ["Bohemian Rhapsody", "Imagine", "Hotel California", "Stairway to Heaven"][i % 4],
                  artist: ["Queen", "John Lennon", "Eagles", "Led Zeppelin"][i % 4],
                  albumCover: `/placeholder.svg?height=80&width=80&text=${i + 1}`,
                  note: "This song reminds me of road trips with my family when I was a kid. We would all sing along at the top of our lungs.",
                  username: `MusicFan${i + 1}`,
                  likes: Math.floor(Math.random() * 50),
                }}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <Button variant="outline" className="rounded-l-md rounded-r-none border-red-200">
                Previous
              </Button>
              <Button variant="outline" className="rounded-none border-l-0 border-r-0 border-red-200">
                1
              </Button>
              <Button variant="outline" className="rounded-none border-l-0 border-r-0 border-red-200 bg-red-100">
                2
              </Button>
              <Button variant="outline" className="rounded-none border-l-0 border-r-0 border-red-200">
                3
              </Button>
              <Button variant="outline" className="rounded-l-none rounded-r-md border-l-0 border-red-200">
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-amber-200 bg-amber-100 px-4 py-6 text-center text-sm text-red-700">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} MusicWall. Share your musical memories.</p>
        </div>
      </footer>
    </div>
  )
}

