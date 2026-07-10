import React from 'react'
import '@/styles/globals.scss'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Another® Real Estate Agency',
  description: 'Agencia boutique de inversión inmobiliaria en preventa',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <>
        <Header />
        <main>{children}</main>
        <Footer />
    </>
  )
}
