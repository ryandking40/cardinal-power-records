import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { snatchedFont } from './fonts'

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
    <html lang="en" className={`h-full ${snatchedFont.variable}`}>
      <body className={`${inter.className} h-full bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
