'use client'

import { info } from '../../../../info'
import Image from 'next/image'
import logo from '../../../../public/logo.svg'
// import { InlineWidget } from 'react-calendly'
import { useMemo } from 'react'
import getTrackingData from '@/services/tracking-cookies'

export default function Thankyou() {
  const { lead } = useMemo(() => {
    return getTrackingData()
  }, [])

  console.log(lead)

  return (
    <div className="reading-container flex flex-col relative">
      <div className="fixed flex items-center h-screen w-full z-[-1]" />
      <section className="relative justify-center items-center z-[1] py-24">
        <div className="flex flex-col">
          <div className="hidden md:flex items-center w-full h-32 mb-20 relative">
            <Image src={logo} fill={true} style={{ objectFit: 'contain' }} alt="Notoriovs Studio" />
          </div>
          <h2 className="ft-6 mb-8">Antes de que tu asesor te busque, lee esto:</h2>
          <p className="ft-2 mb-12">
            Nuestro portafolio cuenta con poco más de 15 desarrollos inmobiliarios,{' '}
            <b>solo los que pasaron filtro legal y financiero,</b> de los más de 100 que hemos
            revisado este año.
            <br />
            <br />
            Cuáles de esos aplican para ti depende de tu perfil, y eso es justo lo que vemos en tu
            evaluación. Tómate tu tiempo para platicarlo bien con tu asesor.
          </p>
          <p className="border-t-2 pt-12 text-center">
            Agendar mi Evaluación de perfil de inversión
          </p>
          <a
            className="ft-2 button !bg-brand-2 !text-brand-4 !w-full mt-4 mx-auto"
            href={info.schedulerWebhook}
            target="_blank"
          >
            CLICK AQUÍ
          </a>
          <p className="-ft-1 text-center mt-4">25 minutos. Sin costo. Sin compromiso de compra.</p>
        </div>
      </section>

      {/*<div className="mb-20">*/}
      {/*  <InlineWidget*/}
      {/*    url={`${info.schedulerWebhook}?hide_gdpr_banner=1&name=${lead.fullName}&email=${lead.email}`}*/}
      {/*    styles={{height: '1000px'}}*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  )
}
