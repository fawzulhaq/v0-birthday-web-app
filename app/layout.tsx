import type { Metadata, Viewport } from 'next'
import { Inter, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const dancingScript = Dancing_Script({ 
  subsets: ["latin"],
  variable: '--font-dancing'
});

export const metadata: Metadata = {
  title: 'Happy Birthday Pancha',
  description: 'A special birthday celebration for Pancha',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dancingScript.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
