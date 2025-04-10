import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Instrument_Sans, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PostHogProvider from "@/components/providers/PostHogProvider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-instrument",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "A Music Scrapbook",
  description: "Showcase collection of songs that mean something to you",
  openGraph: {
    title: "A Music Scrapbook",
    description: "Showcase collection of songs that mean something to you",
    images: [
      {
        url: '/images/song_preview.png',
        width: 1200,
        height: 630,
        alt: 'A Music Scrapbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "A Music Scrapbook",
    description: "Showcase collection of songs that mean something to you",
    images: ['/images/song_preview.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans">
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="color-theme"
          >

              {children}

            
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}