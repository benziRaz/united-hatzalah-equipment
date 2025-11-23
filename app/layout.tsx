import type React from "react"
import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
})

export const metadata: Metadata = {
  title: "איחוד הצלה - הזמנת ציוד",
  description: "מערכת הזמנת ציוד למתנדבי איחוד הצלה",
  openGraph: {
    title: "איחוד הצלה - הזמנת ציוד",
    description: "מערכת הזמנת ציוד למתנדבי איחוד הצלה",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D7%94%D7%95%D7%A8%D7%93%D7%94-ISagQqBniHe0TvLCMHtFaCIE8Mmqwz.png",
        width: 800,
        height: 800,
        alt: "לוגו איחוד הצלה",
      },
    ],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "איחוד הצלה - הזמנת ציוד",
    description: "מערכת הזמנת ציוד למתנדבי איחוד הצלה",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D7%94%D7%95%D7%A8%D7%93%D7%94-ISagQqBniHe0TvLCMHtFaCIE8Mmqwz.png",
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${rubik.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
