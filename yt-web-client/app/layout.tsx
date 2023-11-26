import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './navbar/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Youtube',
  description: 'Youtube like video streaming service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* we always want the navbar to be rendered regardless of which page we are on */}
        <Navbar />
        {children}
      </body>
    </html>
  )
}
