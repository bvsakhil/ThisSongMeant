import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Lato, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PostHogProvider from "@/components/providers/PostHogProvider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const lato = Lato({
  weight: ["300", "400", "700"],
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
  title: "ThisSongMeant - Share Your Musical Memories",
  description: "A place to share what songs mean to you and discover others' musical memories",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${instrumentSerif.variable}`}>
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