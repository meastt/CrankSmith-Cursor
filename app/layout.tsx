import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CrankSmith 4.0 - The Definitive Cycling Calculator Platform',
  description: 'Never buy the wrong part again. Compare gears, check compatibility, and get expert advice before you buy, build, or ride.',
  keywords: 'bike gear calculator, cycling compatibility, bike parts, gear comparison, cycling calculator, bike setup',
  authors: [{ name: 'CrankSmith' }],
  creator: 'CrankSmith',
  publisher: 'CrankSmith',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cranksmith.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CrankSmith 4.0 - The Definitive Cycling Calculator Platform',
    description: 'Never buy the wrong part again. Compare gears, check compatibility, and get expert advice before you buy, build, or ride.',
    url: 'https://cranksmith.com',
    siteName: 'CrankSmith',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CrankSmith 4.0 - Cycling Calculator Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrankSmith 4.0 - The Definitive Cycling Calculator Platform',
    description: 'Never buy the wrong part again. Compare gears, check compatibility, and get expert advice before you buy, build, or ride.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {children}
        </div>
      </body>
    </html>
  )
} 