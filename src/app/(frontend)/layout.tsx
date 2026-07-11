import React from 'react'
import { IBM_Plex_Mono } from 'next/font/google'
import '@/styles/globals.scss'
import TrackingAnalytics from '@/components/trackingAnalytics'

// Self-hosteado por Next (sin request externo a Google Fonts, sin bloqueo de render).
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Another Real Estate Agency',
  description: 'Agencia boutique de inversión inmobiliaria en preventa',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es" className={`scroll-pt-[6rem] ${ibmPlexMono.variable}`}>
      <head>
        <TrackingAnalytics />

        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/xzk1zoy.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body
        className={`bg-neutral-100 text-[#1a1814] font-sans font-light leading-relaxed overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  )
}
