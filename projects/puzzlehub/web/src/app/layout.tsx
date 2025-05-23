import './globals.css'

import PuzzleHubLogo from '@/../public/puzzlehub-logo.svg'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { Metadata, Viewport } from 'next'
import Image from 'next/image'
import { galindo, montserrat } from './fonts'

export const metadata: Metadata = {
  title: 'PuzzleHub',
  description: 'PuzzleHub is a collection of puzzle games',
  icons: PuzzleHubLogo,
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${galindo.variable} ${montserrat.variable} antialiased relative`}
      >
        {/* Background decorative elements */}
        <div className="fixed top-[15%] left-[8%] w-48 h-48 bg-pink-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed top-[45%] right-[12%] w-64 h-64 bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-[20%] left-[25%] w-56 h-56 bg-purple-300/5 rounded-full blur-3xl pointer-events-none" />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <header className="my-8 flex justify-between items-center px-8">
              <div className="flex items-center gap-4">
                <Image src={PuzzleHubLogo} alt="" className="h-14 w-14" />

                <h1 className="text-4xl font-bold font-galindo pt-1">
                  PuzzleHub
                </h1>
              </div>

              <ThemeToggle />
            </header>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
