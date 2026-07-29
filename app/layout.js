import localFont from 'next/font/local'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

const cooperHewitt = localFont({
  src: [
    { path: './fonts/CooperHewitt-Book.otf', weight: '400', style: 'normal' },
    { path: './fonts/CooperHewitt-Medium.otf', weight: '500', style: 'normal' },
    { path: './fonts/CooperHewitt-Bold.otf', weight: '700', style: 'normal' },
  ],
})

export const metadata = {
  title: 'Wekkle',
  description: 'Track your job applications across every platform in one place.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${cooperHewitt.className} min-h-full flex flex-col`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}