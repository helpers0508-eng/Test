import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Helpers - Find Trusted Local Professionals',
  description: 'Book vetted experts for home services, cleaning, plumbing, beauty, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} font-display bg-background-light dark:bg-background-dark`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}