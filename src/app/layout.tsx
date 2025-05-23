import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { ClientLayoutProvider } from './client-layout-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Health-flow',
  description:
    'Health-flow is a platform for registering and managing patient data made with pglite',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-dark-300 min-h-screen font-sans antialiased',
          inter.className,
        )}
      >
        <ClientLayoutProvider>{children}</ClientLayoutProvider>
        <Toaster />
      </body>
    </html>
  )
}
