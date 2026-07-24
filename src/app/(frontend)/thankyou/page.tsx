'use client'

import { info } from '../../../../info'
import Image from 'next/image'
import logo from '../../../../public/logo.svg'
// import { InlineWidget } from 'react-calendly'
import { useEffect, useState } from 'react'

const emptyLead = { fullName: '', listing: '' }

function getLeadCookie() {
  if (typeof document === 'undefined') return emptyLead

  const raw = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('lead='))
    ?.split('=')
    .slice(1)
    .join('=')

  if (!raw) return emptyLead

  try {
    const clean = raw.startsWith('j%3A') ? raw.slice(4) : raw
    const parsed = JSON.parse(decodeURIComponent(clean))
    return {
      fullName: parsed?.fullName ?? '',
      listing: parsed?.listing ?? '',
    }
  } catch {
    return emptyLead
  }
}

export default function Thankyou() {
  const [lead, setLead] = useState({fullName: '', listing: ''})

  useEffect(() => {
    setLead(getLeadCookie())
  }, [])

  const name = lead.fullName.split(' ')[0];
  const listing = lead.listing;

  return (
    <div className="flex flex-col relative">
      <section className="reading-container relative justify-center items-center z-[1]">
        <div className="flex flex-col">
          <div className="hidden md:flex w-full h-24 mb-20 relative">
            <Image src={logo} fill={true} style={{ objectFit: 'contain' }} alt="Another Real Estate" />
          </div>
          <h2 className="ft-6 mb-8">
            Listo{name && ` ${name}`}, ya viste tu próxima inversión en{' '}
            {listing ? listing : 'bienes raíces'}. Ahora, lee esto:
          </h2>
          <p className="ft-2 mb-12">
            El 90% de la gente que pide información de un desarrollo termina eligiendo otro.
            <br />
            <br />
            No porque el proyecto esté mal, sino porque nadie les ayudó a revisar si ese proyecto
            servía realmente para sus fines.
            <br />
            <br />
            Nosotros no vendemos ladrillos, nosotros ponemos a trabajar tu capital.
            <br />
            <br />
            Y para eso necesitamos saber dos o tres cosas de ti que un formulario no te va a
            preguntar.
            <br />
            <br />
            Si al final {listing} es lo tuyo, avanzamos.
            <br />
            Si no, te decimos qué te puede funcionar y por qué.
          </p>
        </div>
      </section>
      <div className="border-t-2 py-6 text-center sticky bottom-0 bg-brand-4 z-10">
        <div className="flex flex-col mx-auto max-w-[34rem]">
          <p>Programa una llamada</p>
          <a
            className="ft-2 button !bg-brand-2 !text-brand-4 !w-full mt-4 mx-auto"
            href={info.schedulerWebhook}
            target="_blank"
          >
            ABRIR CALENDARIO
          </a>
          <p className="-ft-1 text-center mt-4">25 minutos. Sin costo. Sin compromiso de compra.</p>
        </div>
      </div>

      {/*<div className="mb-20">*/}
      {/*  <InlineWidget*/}
      {/*    url={`${info.schedulerWebhook}?hide_gdpr_banner=1&name=${lead.fullName}&email=${lead.email}`}*/}
      {/*    styles={{height: '1000px'}}*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  )
}
