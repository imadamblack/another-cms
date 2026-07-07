'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import scrollDepth from '@/utils/scrollDepth';
import OptInForm from '@/components/opt-in-form';
import fbEvent from '@/services/fbEvents';

function FaqItem({question, answer}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-t border-[#1a1814]/10 cursor-pointer last:border-b last:border-[#1a1814]/10"
      onClick={() => setOpen(!open)}
    >
      <h3 className="flex justify-between items-center py-6 gap-6">
        <span
          className={`font-medium transition-opacity duration-300 ${
            open ? 'opacity-100' : 'hover:opacity-50'
          }`}
        >
          {question}
        </span>
        <span
          className={`ft-2 w-8 h-8 rounded-full border border-[#1a1814]/10 flex items-center justify-center text-base font-light text-[#8a8680] flex-shrink-0 transition-all duration-300 select-none ${
            open ? 'rotate-45 bg-[#1a1814] text-[#edeae3] border-[#1a1814]' : ''
          }`}
        >
          +
        </span>
      </h3>
      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p className="pb-7 max-w-[600px]">
          {answer}
        </p>
      </div>
    </div>
  );
}

function CTA({
  button = 'Contáctanos',
  cta = 'Programa una cita para conocer las mejores oportunidades de inversión',
  onClick = () => {}
}) {
  return (
    <div className="w-full">
      <Link
        href="#contact"
        className="button !bg-brand-5 !text-brand-4 -ft-1 hover:!bg-brand-1 !w-full mb-4"
        onClick={onClick}
      >
        {button} (→)
      </Link>
      <div className="text-center -ft-2">{cta}</div>
    </div>
  );
}

const problemQuestions = [
  {
    title: '(LICENCIA)',
    desc: '¿El desarrollo ya tiene licencia de construcción o apenas está en trámite?',
  },
  {
    title: '(FIDEICOMISO)',
    desc: '¿Existe un fideicomiso que proteja tu capital?',
  },
  {
    title: '(FINANCIAMIENTO)',
    desc: '¿Cuenta con crédito puente o capital aportado por inversionistas, o depende de las preventas?',
  },
  {
    title: '(TRAYECTORIA)',
    desc: '¿El desarrollador ya ha entregado proyectos antes, o este es el primero?',
  },
];

const criterios = [
  {
    num: '01',
    title: 'Estructura Legal',
    body: 'Situación del terreno, licencias de construcción y fideicomisos. Si algo no está en orden, no listamos el proyecto.',
  },
  {
    num: '02',
    title: 'Respaldo Financiero',
    body: 'Crédito puente y estructura del capital. Un proyecto dependiente de preventas es un riesgo vs al que tiene financiamiento asegurado.',
  },
  {
    num: '03',
    title: 'Historial del Desarrollador',
    body: 'Trayectoria y proyectos previos del desarrollador. El historial importa más que cualquier render. Sin excepciones.',
  },
  {
    num: '04',
    title: 'Lógica del Producto',
    body: '¿Hay demanda real en esa zona? ¿El precio tiene sentido frente al potencial de renta o plusvalía?',
  },
];

const pasos = [
  {
    n: '01',
    title: 'Entendemos tu perfil',
    body: 'Hablamos primero. Presupuesto, horizonte de inversión y objetivo: plusvalía a largo plazo, renta mensual o diversificación de portafolio.',
  },
  {
    n: '02',
    title: 'Opciones ya filtradas',
    body: 'Solo proyectos que pasaron nuestra revisión. No decenas de opciones — únicamente las que tienen sentido para tu perfil.',
  },
  {
    n: '03',
    title: 'Analizamos juntos',
    body: 'Precio de entrada, proyección de plusvalía, potencial de renta y riesgos reales. Sin presión. Sin urgencia artificial.',
  },
  {
    n: '04',
    title: 'Te acompañamos',
    body: 'Desde la selección de unidad hasta la firma. Cada paso del proceso de compra.',
  },
];

const testimonios = [
  {
    message: 'Llevo varios años invirtiendo en bienes raíces y ustedes, en lugar de venderme a huevo un proyecto, me presentaron opciones que ya habían revisado y que encajaban mejor. Y ya viste, en tres semanas firmamos. Ya vi el primer reporte de avance.',
    nombre: 'Edgardo L.',
  },
  {
    message: 'Mira, normalmente no tengo tiempo para ponerme a revisar desarrollos uno por uno. Me gustó que en la cita ya tenían filtrado lo que tenía sentido para mi. Todo muy fluido, sin presión y sin sorpresas.',
    nombre: 'Omar M.',
  },
  {
    message: 'Quería entrar al mundo de inversión inmobiliaria pero no sabía bien por dónde. La verdad me explicaste muy claro qué revisar y por qué el proyecto que elegí tenía sentido. Me sentí más segura y no como si estuviera apostando.',
    nombre: 'Luz M.',
  },
];

// Datos de ejemplo: se muestran solo si Payload todavía no tiene desarrollos
// con featuredOnHome=true (ver src/app/(frontend)/page.tsx).
const defaultProyectos = [
  {
    slug: null,
    zona: 'Vallarta Norte · GDL',
    name: 'Altare',
    price: '$2.2 mdp',
    timeframe: '30 meses',
    desc: 'Suites a un costado de La Matera sobre Av. México',
    badge: null,
    img: '/images/home/altare.jpg',
  },
  {
    slug: null,
    zona: 'Americana · GDL',
    name: 'Torre XII',
    price: '$3.2 mdp',
    timeframe: '24 meses',
    desc: 'Lofts y Suites ideales para Airbnb',
    badge: 'Últimas unidades',
    img: '/images/home/torrexii.jpg',
  },
  {
    slug: null,
    zona: 'The Woodlands · TX',
    name: 'The Meadows',
    price: '$300,000 usd',
    timeframe: '6 meses',
    desc: 'La ciudad más segura de USA en 2025',
    badge: null,
    img: '/images/home/meadows.jpg',
  },
  {
    slug: null,
    zona: 'Camino Real · ZAP',
    name: 'Rock Residence',
    price: '$3.3 mdp',
    timeframe: '30 meses',
    desc: 'Parte del complejo Hard Rock Hotel',
    badge: null,
    img: '/images/home/rockresidence.jpg',
  },
];

const DEFAULT_VALIDATORS = ['Legal', 'Finanzas', 'Licencias', 'Trayectoria'];
const FALLBACK_PROJECT_IMAGE = '/images/home/hero.jpg';

const faqs = [
  {
    question: '¿El servicio tiene costo para mí?',
    answer:
      'No. Nuestro servicio es gratuito para el inversionista. La comisión la recibimos del desarrollador cuando se concreta una operación. Si no hay cierre, no hay comisión, así que nuestro incentivo está alineado con el tuyo desde el inicio.',
  },
  {
    question: '¿Solo trabajan con preventas?',
    answer:
      'Principalmente sí. La preventa puede ser muy atractiva cuando el proyecto está bien estructurado. Ese "cuando" es exactamente lo que nosotros revisamos antes de mostrarte cualquier cosa.',
  },
  {
    question: '¿Trabajan con exclusividad?',
    answer:
      'No, y eso es intencional. Si tuviéramos exclusividad con alguien, nuestro criterio dejaría de ser independiente. Analizamos proyectos de distintos desarrolladores y solo presentamos los que pasan el filtro, sin importar quién los construye.',
  },
  {
    question: '¿Qué pasa si ningún proyecto se ajusta a mi perfil?',
    answer:
      'Te lo decimos directo. Preferimos esperar a tener algo que tenga sentido para ti antes que empujarte hacia una opción que no la tiene. Si hoy no hay nada para tu perfil, te lo decimos en la primera conversación.',
  },
  {
    question: '¿Qué pasa si quiero entrar pero no tengo el 100% del capital?',
    answer:
      'Hay opciones. Parte del proceso incluye asesoría en crédito hipotecario, no para complicar la operación, sino para que la falta de liquidez inmediata no sea el único obstáculo entre tú y una buena inversión.',
  },
];

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function HomeLanding({ proyectos: proyectosProp }) {
  const proyectos = proyectosProp && proyectosProp.length ? proyectosProp : defaultProyectos;
  const [lastClick, setLastClick] = useState('hero');
  useEffect(() => {
    scrollDepth({
      values: [25, 50, 75, 100],
      callback: (value) => fbEvent(`Scroll Depth: ${value}`),
    });
  });

  return (
    <>
      {/* ── HERO ── */}
      <div className="px-10">
        {/* Top editorial row */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-8 py-12">
          <div className="col-span-2">
            <h1 className="ft-8 font-bold text-[#1a1814]">
              La ZMG está saturada de preventas.
              La mayoría no merece tu dinero.
              Este es el portafolio de las que sí.
            </h1>
          </div>

          {/* Tag — hidden on mobile */}
          <p className="uppercase text-[#8a8680] self-end">
            Solo listamos proyectos que pasaron nuestra revisión legal, financiera y de trayectoria.
          </p>
        </div>

        {/* Hero image */}
        <div className="delay-1 relative w-full overflow-hidden" style={{height: 'clamp(280px, 50vw, 580px)'}}>
          <Image src="/images/home/hero.jpg" alt="Interior" fill sizes="100vw" style={{objectFit: 'cover'}} priority/>
          <a
            href="#proyectos"
            onClick={() => setLastClick('hero')}
            className="absolute bottom-8 inset-x-8 px-10 py-6 bg-brand-2 flex items-center justify-center text-center no-underline text-brand-4 text-[11px] font-semibold tracking-[0.1em] uppercase leading-snug shadow-[0_4px_24px_rgba(0,0,0,0.10)] transition-all duration-300 hover:bg-brand-1 hover:text-[#edeae3]"
          >
            Ver proyectos
          </a>
        </div>
      </div>

      <section className="py-20">
        <div className="reading-container">
          <h2>
            La mayoría de los inversionistas toman decisiones con la mitad de la información
          </h2>
          <p>
            Llevas semanas investigando desarrollos en preventa.<br/>
            Has visto:<br/>
            — renders impecables<br/>
            — showrooms<br/>
            — proyecciones de plusvalía que suenan muy bien<br/><br/>
            El vendedor te dice que quedan pocas unidades.<br/>
            Sientes que si no decides hoy, pierdes la oportunidad.<br/><br/>
            Lo que nadie te está contando es esto:<br/>
            <span className="ft-2 font-bold">Esa presión es su modelo de negocio. <br/>No es tu oportunidad, es la de ellos.</span><br/><br/>
            El trabajo del agente es vender unidades.<br/><br/>
            El incentivo del desarrollador es cerrar preventas para fondear la construcción.<br/><br/>
            Ninguno de los dos tiene el mandato de revisar si ese proyecto es una buena inversión para ti.<br/>
            Nosotros sí.
          </p>
          <CTA
            button="Contáctanos, da clic"
            onClick={() => setLastClick('intro')}
          />
        </div>
      </section>

      <section className="w-full py-20 border-t border-neutral-300">
        <div className="container">
          <div className="reading-container">
            <h2>Porque lo que determina si tu dinero está seguro no es el render, es la
              estructura real detrás del proyecto</h2>
          </div>
          {problemQuestions.map((row) => (
            <div
              key={row.title}
              className="group grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-10 py-7 border-t border-neutral-300 last:border-b last:border-neutral-300 cursor-default"
            >
              <h3 className="ft-6 font-semibold">
                {row.title}
              </h3>
              <p>
                {row.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="reading-container">
          <p>
            Casi nadie hace estas preguntas.<br/><br/>
            Nosotros sí las hacemos, y si las respuestas no nos convencen, el proyecto no entra al portafolio.<br/><br/>
            Así de simple.
          </p>
        </div>
        <div className="reading-container">
          <CTA
            button="Quieres saber más? Clic"
            onClick={() => setLastClick('problemas')}
          />
        </div>
      </section>

      {/*── STATS ── */}
      <div className="grid grid-cols-1 bg-neutral-900">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-neutral-100 p-0">
          {[
            {num: '+100', desc: `proyectos analizados\nen ${new Date().getFullYear()}`},
            {num: '15', desc: 'pasaron nuestro\nfiltro de criterios'},
            {num: '$0', desc: 'costo para el\ninversionista'},
            {num: 'ZMG / TX', desc: 'mercados activos'},
          ].map((s) => (
            <div key={s.num} className="p-20 bg-neutral-900">
              <div className="ft-8 font-normal text-neutral-100 tracking-[-0.03em] leading-none mb-2.5">
                {s.num}
              </div>
              <div className="-ft-1 font-light text-neutral-300 leading-snug whitespace-pre-line">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CRITERIOS ── */}
      <section id="criterios" className="w-full py-20 border-t border-neutral-300">
        <div className="container">
          <div className="reading-container mb-12">
            <h2 className="font-bold">Revisamos, filtramos y omitimos desarrollos que no pasan la prueba</h2>
            <p>De todos los proyectos que hemos analizado, menos de la mitad cumplieron nuestros criterios. <br/>
              Los demás quedaron fuera, sin importar qué tan bien se veían en el showroom.</p>
            <p className="ft-2 font-semibold">¿Qué revisamos antes de mostrarte un proyecto?</p>
          </div>

          <div className="delay-1 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1814]/10">
            {criterios.map((c) => (
              <div
                key={c.num}
                className="bg-[#edeae3] hover:bg-[#e6e2da] transition-colors duration-300 p-9"
              >
                <p className="-ft-2 mb-5">{c.num}</p>
                <p className="ft-1 font-medium">{c.title}</p>
                <p className="text-neutral-600">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="reading-container">
            <CTA
              button="Agenda una cita"
              onClick={() => setLastClick('criterios')}
            />
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section id="proceso" className="w-full pt-20 px-8 border-t border-neutral-300">
        <div className="reading-container mb-12">
          <h2 className="font-bold">Un proceso simple<br/>para inversionistas serios</h2>
          <p>Sin presentaciones genéricas.<br/>Sin urgencia artificial.<br/>Sin rollo.</p>
        </div>

        <div className="container">
          {pasos.map((p) => (
            <div
              key={p.n}
              className="group grid grid-cols-[40px_1fr] md:grid-cols-[48px_1fr_1fr] items-start gap-0 py-8 border-t border-neutral-300 last:border-b last:border-neutral-300"
            >
              <div className="text-[11px] font-normal text-[#8a8680] tracking-[0.1em] pt-0.5">{p.n}</div>
              <h3
                className="text-paso font-medium tracking-[-0.01em] leading-none text-[#1a1814] group-hover:opacity-50">
                {p.title}
              </h3>
              <p
                className="text-neutral-500 col-start-2 md:col-start-3 mt-2 md:mt-0">
                {p.body}
              </p>
            </div>
          ))}
        </div>
        <div className="reading-container">
          <CTA
            button="Programa tu sesión, clic"
            onClick={() => setLastClick('proceso')}
          />
        </div>
      </section>

      <section className="w-full bg-neutral-900 flex items-center mt-20 py-40 px-8">
        <div className="reading-container">
          <h3
            className="ft-8 font-semibold text-neutral-300">
            Nuestro incentivo está alineado con el tuyo, no con el del desarrollador
          </h3>
          <p className="text-neutral-100 leading-[1.8]">
            Nuestro servicio no tiene costo para el inversionista.<br/>
            Tampoco damos exclusividad a desarrolladores para no ofrecerte una opción sesgada.<br/>
          </p>
        </div>
      </section>

      {/* ── PROYECTOS ── */}
      <section id="proyectos" className="w-full py-20 px-8 border-t border-neutral-300">

        <div className="reading-container mb-12">
          <h2 className="font-bold">Estas son algunos de los proyectos que hoy cumplen nuestros criterios</h2>
          <p>Desarrollos en la Zona Metropolitana de Guadalajara y otros mercados estratégicos.</p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 md:container gap-8">
          {proyectos.map((p) => {
            const href = p.slug ? `/desarrollos/${p.slug}` : null;
            const card = (
              <>
                <div className="relative w-full aspect-video">
                  <Image
                    src={p.img || FALLBACK_PROJECT_IMAGE}
                    fill
                    alt={p.name}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{objectFit: 'cover'}}
                  />
                  {p.badge &&
                    <div
                      className="absolute top-8 right-8 bg-brand-2 px-6 py-1 ft-0 font-bold text-brand-4">{p.badge}</div>
                  }
                </div>

                <div className="flex flex-col pt-8">
                  <div className="-ft-3 uppercase text-neutral-600">
                    {p.zona}
                  </div>
                  <h3 className="ft-6 !my-0 font-semibold group-hover:opacity-50">
                    {p.name}
                  </h3>
                  <p className="group-hover:opacity-50 pb-4">
                    {p.desc}
                  </p>
                  <p className="font-semibold group-hover:opacity-50">
                    → Desde {p.price}
                  </p>
                  <p className="font-semibold group-hover:opacity-50">
                    → Entrega en {p.timeframe}
                  </p>
                  <div className="flex gap-4 my-8">
                    {(p.validators || DEFAULT_VALIDATORS).map(v => (
                      <p key={v} className="py-1 px-2 border-2 -ft-3 font-medium tracking-wide">{v} ✓</p>
                    ))}
                  </div>
                </div>
              </>
            );

            return (
              <div
                key={p.slug || p.id || p.name}
                className="group grid grid-cols-1 items-center border-y border-neutral-300 cursor-default"
              >
                {href ? (
                  <Link href={href} className="contents no-underline text-inherit">
                    {card}
                  </Link>
                ) : card}
                {/* El CTA queda fuera del <Link> de la tarjeta: es un <a> propio
                    (va a #contact) y un <a> no puede anidarse dentro de otro <a>.
                    Anidarlos causaba el error de hidratación reportado. */}
                <div className="pb-16">
                  <CTA
                    button={`Me interesa ${p.name}`}
                    cta={`Programa una cita para conocer más sobre ${p.name}`}
                    onClick={() => setLastClick(p.name)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full py-20 border-y border-neutral-400 bg-neutral-800">
        <div className="reading-container">
          <h2 className="font-bold text-neutral-50">Partners con quienes hemos validado proyectos</h2>
        </div>
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-40 py-20">
          <div className="relative w-full aspect-video overflow-hidden">
            <Image src="/images/home/logos/lopx.png" fill alt="Lopx" sizes="(max-width: 1024px) 50vw, 25vw" style={{objectFit: 'contain'}}/>
          </div>
          <div className="relative w-full aspect-video overflow-hidden">
            <Image src="/images/home/logos/dala.png" fill alt="Dala" sizes="(max-width: 1024px) 50vw, 25vw" style={{objectFit: 'contain'}}/>
          </div>
          <div className="relative w-full aspect-video overflow-hidden">
            <Image src="/images/home/logos/dezka.svg" fill alt="Dezka" sizes="(max-width: 1024px) 50vw, 25vw" style={{objectFit: 'contain'}}/>
          </div>
          <div className="relative w-full aspect-video overflow-hidden">
            <Image src="/images/home/logos/ccu.png" fill alt="CompraCasasUSA" sizes="(max-width: 1024px) 50vw, 25vw" style={{objectFit: 'contain'}}/>
          </div>
        </div>
      </section>


      {/* --- TESTIMONIOS --- */}
      <section className="w-full py-20 border-t border-neutral-300">
        <div className="reading-container">
          <h2 className="font-bold">Ahora, nuestros inversionistas</h2>
        </div>
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((t, i) => (
            <div
              className="bg-[#edeae3] p-8 flex flex-col"
              key={i}
            >
              <p className="mb-8 flex-grow">
                {t.message}
              </p>
              <p className="-ft-1 mt-auto font-semibold text-right">
                — {t.nombre}
              </p>
            </div>
          ))}
        </div>
        <div className="reading-container">
          <CTA
            button="Dale clic, platiquemos"
            onClick={() => setLastClick('testimonios')}
          />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="w-full py-20 border-y border-neutral-400">
        <div className="reading-container">
          <h2 className="ft-6 font-bold">Preguntas que nos hacen normalmente</h2>
        </div>

        <div className="container">
          {faqs.map((f) => (
            <FaqItem key={f.question} question={f.question} answer={f.answer}/>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section id="contact" className="w-full py-20">
        <div className="reading-container">
          <h2 className="font-bold">
            Programa una sesión para explorar los proyectos inmobiliarios disponibles para tu perfil, sin
            costo.
          </h2>
          <p className="">
            Ayúdanos con tus datos y a responder un par de preguntas para programar tu sesión de exploración.
            <br/><br/>
            No te vamos a presionar.<br/>
            Si no hay algo para ti hoy, te lo decimos en los primeros minutos.
          </p>
          <OptInForm lastClick={lastClick} />
        </div>
      </section>
    </>
  );
}
