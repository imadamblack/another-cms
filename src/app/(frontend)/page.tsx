import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Development, Media } from '@/payload-types'
import HomeLanding from '@/components/home-landing'

// home-landing.js es JS puro (sin chequeo de tipos), así que el tipo de cada
// tarjeta de proyecto se define aquí, del lado del Server Component.
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

// Campos agregados a src/collections/Developments.ts para controlar la
// tarjeta del home (featuredOnHome, homeSortOrder, homeBadge,
// homeStartingPriceLabel, homeShortDescription). Se tipan aquí aparte por si
// todavía no corriste `npm run generate:types` después del cambio de schema.
type DevelopmentWithHomeCard = Development & {
  featuredOnHome?: boolean | null
  homeSortOrder?: number | null
  homeBadge?: string | null
  homeStartingPriceLabel?: string | null
  homeShortDescription?: string | null
}

const getMediaUrl = (media?: number | Media | null) => {
  if (!media || typeof media === 'number') {
    return undefined
  }

  return media.url || undefined
}

async function getFeaturedDevelopments(): Promise<DevelopmentWithHomeCard[]> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'developments',
    depth: 1,
    limit: 8,
    // 'id' como desempate: homeSortOrder tiene defaultValue=0, así que varios
    // desarrollos pueden empatar. Sin un segundo criterio, Postgres no
    // garantiza el mismo orden entre ejecuciones y eso rompía la hidratación
    // en el home (el orden de las tarjetas cambiaba entre el HTML del server
    // y el árbol del cliente).
    sort: ['homeSortOrder', 'id'],
    where: {
      and: [
        {
          status: {
            equals: 'published',
          },
        },
        {
          featuredOnHome: {
            equals: true,
          },
        },
      ],
    },
  })

  return docs as DevelopmentWithHomeCard[]
}

export default async function HomePage() {
  const developments = await getFeaturedDevelopments()

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

  return <HomeLanding proyectos={proyectos} />
}
