import React from 'react'
import '@/styles/globals.scss'
import TrackingAnalytics from '@/components/trackingAnalytics'

export const metadata = {
  title: 'Another Real Estate Agency',
  description: 'Agencia boutique de inversión inmobiliaria en preventa',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es" className="scroll-pt-[6rem]">
      <head>
        <TrackingAnalytics />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="bg-neutral-100 text-[#1a1814] font-sans font-light leading-relaxed overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
