import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { snatchedFont, sportSolidFont } from '@/app/fonts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cardinal Power Invitational Records',
  description: 'Record board for Cardinal Power Invitational powerlifting records',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full min-h-screen ${snatchedFont.variable} ${sportSolidFont.variable}`}>
      <body className={`${inter.className} min-h-screen w-full bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
