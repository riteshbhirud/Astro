import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/lib/AuthContext'
import StarsBackground from '@/components/StarsBackground'

export const metadata: Metadata = {
  title: 'AstroChat - Connect with Expert Vedic Astrologers',
  description: 'Get personalized astrological guidance from experienced Vedic astrologers. Chat live about your horoscope, kundli, love, career, and more.',
  keywords: 'astrology, vedic astrology, horoscope, kundli, astrologer, jyotish, rashifal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col">
        <AuthProvider>
          <StarsBackground />
          <Navbar />
          <main className="flex-grow relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
