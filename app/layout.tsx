import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Calculator, CheckCircle, Trophy, Menu, X, User } from 'lucide-react'
import { Suspense } from 'react'
import { ToastContainer } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CrankSmith 4.0 - The Definitive Cycling Calculator Platform',
  description: 'Compare gears, check compatibility, calculate tire pressure, chain length, and more. Never buy the wrong part again.',
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
        <Suspense fallback={<div>Loading...</div>}>
          {/* Navigation Header */}
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">CrankSmith</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  <Link href="/calculators" className="text-gray-600 hover:text-gray-900 font-medium">
                    Calculators
                  </Link>
                  <Link href="/compatibility" className="text-gray-600 hover:text-gray-900 font-medium">
                    Compatibility
                  </Link>
                  <Link href="/pro-builds" className="text-gray-600 hover:text-gray-900 font-medium">
                    Pro Builds
                  </Link>
                  <Link href="/calculators/gear-comparison" className="btn-primary">
                    Compare Gears
                  </Link>
                  <Link href="/account" className="text-gray-600 hover:text-gray-900">
                    <User className="w-5 h-5" />
                  </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button className="text-gray-600 hover:text-gray-900">
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {children}
          </div>
          <ToastContainer />
        </Suspense>
      </body>
    </html>
  )
} 