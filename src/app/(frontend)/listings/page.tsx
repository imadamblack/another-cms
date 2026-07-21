import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'

import config from '@payload-config'
import type { Development, Media } from '@/payload-types'

// Igual que en el home: cache de 5 min para no pegarle a Payload en cada
// visita.
export const revalidate = 300

type Proyecto = {
  id: number
  slug: string | null
  zona: string
  name: string
  price: string
  timeframe: string
  desc: string
  badge: string | null
  img?: string
}

const FALLBACK_PROJECT_IMAGE = '/images/home/hero.jpg'
const DEFAULT_VALIDATORS = ['Legal', 'Finanzas', 'Licencias', 'Trayectoria']

const getMediaUrl = (media?: number | Media | null) => {
  if (!media || typeof media === 'number') {
    return undefined
  }

  return media.url || undefined
}

async function getDevelopments(): Promise<Development[]> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'developments',
    depth: 1,
    limit: 100,
    sort: ['homeSortOrder', 'id'],
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return docs as Development[]
}

export default async function DesarrollosPage() {
  const developments = await getDevelopments()

  const proyectos: Proyecto[] = developments.map((d) => ({
    id: d.id,
    slug: d.slug || null,
    zona: [d.location?.neighborhood, d.location?.city].filter(Boolean).join(' · ') || 'Zona por definir',
    name: d.name,
    price: d.homeStartingPriceLabel || 'Precio por definir',
    timeframe: d.investmentSnapshot?.deliveryMonths
      ? `${d.investmentSnapshot.deliveryMonths} meses`
      : 'Entrega por definir',
    desc: d.homeShortDescription || d.tagline || '',
    badge: d.homeBadge || null,
    img: getMediaUrl(d.heroImage),
  }))

  return (
    <section className="w-full py-20 px-8">
      <div className="reading-container mb-12">
        <h1 className="font-bold">Desarrollos</h1>
        <p>
          Portafolio completo de proyectos en la Zona Metropolitana de Guadalajara y otros mercados
          estratégicos.
        </p>
      </div>

      {proyectos.length === 0 ? (
        <div className="reading-container">
          <p>Todavía no hay desarrollos publicados.</p>
        </div>
      ) : (
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          {proyectos.map((p) => {
            const href = p.slug ? `/listings/${p.slug}` : null

            const card = (
              <>
                <div className="relative flex w-full aspect-video bg-brand-5">
                  <Image
                    src={p.img || FALLBACK_PROJECT_IMAGE}
                    fill
                    alt={p.name}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {p.badge && (
                    <div className="absolute top-8 right-8 bg-brand-2 px-6 py-1 ft-0 font-bold text-brand-4">
                      {p.badge}
                    </div>
                  )}
                </div>

                <div className="flex flex-col pt-8 pb-16 flex-grow">
                  <div className="-ft-3 uppercase text-neutral-600">{p.zona}</div>
                  <h3 className="ft-4 !my-0 font-semibold group-hover:opacity-50">{p.name}</h3>
                  <p className="group-hover:opacity-50 pb-4 flex-grow">{p.desc}</p>
                  <p className="font-semibold group-hover:opacity-50">→ Desde {p.price}</p>
                  <p className="font-semibold group-hover:opacity-50">→ Entrega en {p.timeframe}</p>
                  <div className="flex gap-4 my-8">
                    {DEFAULT_VALIDATORS.map((v) => (
                      <p key={v} className="py-1 px-2 border-2 -ft-3 font-medium tracking-wide">
                        {v} ✓
                      </p>
                    ))}
                  </div>
                </div>

              </>
            )

            return (
              <div
                key={p.slug || p.id}
                className="w-full flex flex-col group border-neutral-300 cursor-default"
              >
                {href ? (
                  <Link href={href} className="contents no-underline text-inherit">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
