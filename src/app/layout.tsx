import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Car AI Assistant',
  description: 'Get information about your car using its VIN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}

