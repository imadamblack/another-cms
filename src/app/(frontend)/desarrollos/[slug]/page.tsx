import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Amenity, Development, Media, Unit } from '@/payload-types'

import OptInForm from '@/components/opt-in-form'
import UnitsSwiper from '@/components/units-swiper'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const getMediaUrl = (media?: number | Media | null) => {
  if (!media || typeof media === 'number') {
    return undefined
  }

  return media.url || undefined
}

function formatCurrency(value: string | number | null | undefined): string {
  const sanitizedValue = typeof value === 'string' ? value.replace(/[^0-9.-]/g, '') : value

  const number = Number(sanitizedValue)

  if (!Number.isFinite(number)) return '$0.00'

  return number.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

async function getDevelopment(slug: string) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const developments = await payload.find({
    collection: 'developments',
    depth: 2,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
      ],
    },
  })

  const development = developments.docs[0]

  if (!development) {
    return null
  }

  const units = await payload.find({
    collection: 'units',
    depth: 1,
    limit: 100,
    sort: 'sortOrder',
    where: {
      and: [
        {
          development: {
            equals: development.id,
          },
        },
        {
          status: {
            not_equals: 'hidden',
          },
        },
      ],
    },
  })

  return {
    development,
    units: units.docs,
  }
}

const Blockbuster = ({
  title,
  img,
  development,
}: {
  title: string
  img: string
  development: string
}) => {
  return (
    <>
      <div className="sticky top-[4rem] md:top-[6rem] w-full flex items-end justify-start bg-brand-1 gap-4 px-8 py-2 z-10">
        <span className="-ft-2 inline-flex items-end !leading-[1] mono uppercase text-neutral-200">
          {development}
        </span>
        <span className="ft-1 inline-flex items-end !leading-[1] text-neutral-200 font-bold">
          {title}
        </span>
      </div>
      <div className="p-8 relative flex flex-col items-start justify-end w-full aspect-[3/2] md:aspect-[3/1] bg-brand-1 z-0">
        <div className="absolute flex inset-0 overflow-hidden">
          {img && <Image src={img} alt={development} fill sizes="100vw" className="object-cover" />}
          <div className="absolute flex inset-0 bg-neutral-800/40" />
        </div>
        <div className="z-10">
          <p className="-ft-1 mono uppercase text-neutral-200">{development}</p>
          <h2 className="ft-10 text-neutral-200 font-black">{title}</h2>
        </div>
      </div>
    </>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getDevelopment(slug)

  if (!result) {
    return {}
  }

  const { development } = result
  const image = getMediaUrl(development.heroImage)

  return {
    description: development.tagline || undefined,
    openGraph: {
      description: development.tagline || undefined,
      images: image ? [{ url: image }] : undefined,
      title: `Another® Listing: ${development.name}`,
    },
    title: `Another® Listing: ${development.name}`,
  }
}

export default async function DevelopmentPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getDevelopment(slug)

  if (!result) {
    notFound()
  }

  const development = result.development as Development
  const units = result.units.sort((a, b) => {
    const priceA = a.pricing?.price ?? Infinity
    const priceB = b.pricing?.price ?? Infinity

    return priceA - priceB
  }) as Unit[]
  const heroImage = getMediaUrl(development.heroImage)
  const gallery = development.gallery?.map((i) => getMediaUrl(i.image))
  const getGalleryImage = (index: number) => gallery?.[index] || undefined
  const amenities = development.amenities || []
  const paymentPlans = development.paymentPlans || []

  return (
    <>
      {/* HERO */}
      <section className="relative px-8 w-full flex flex-col items-center">
        <div className="relative my-8 flex aspect-square w-full sm:aspect-[2/1] 2xl:aspect-[3/1] overflow-hidden border border-neutral-200 bg-neutral-200">
          {heroImage && (
            <Image
              src={heroImage}
              alt={development.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="flex flex-col w-full pb-8 z-20 border-b border-brand-1">
          <h1 className="uppercase ft-10">{development.name}</h1>
          <p className="ft-2 mb-4">{development.tagline}</p>
          <p className="-ft-1 mono uppercase text-neutral-600">
            {development.location?.neighborhood} — {development.location?.city}
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="w-full py-20 relative border-b border-brand-1">
        <div className="container grid md:grid-cols-2 gap-8">
          <p className="ft-2 md:max-w-[32ch]">{development.description}</p>
          <div className="relative w-full aspect-video">
            {getGalleryImage(0) && (
              <Image
                src={getGalleryImage(0) as string}
                alt={development.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* UBICACION */}
      <section className="relative">
        <Blockbuster
          title="Ubicación"
          img={getGalleryImage(1) as string}
          development={development.name}
        />

        <div className="w-full px-8 py-20 grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 py-8 justify-end border-y border-neutral-800">
            <h3 className="ft-6 font-bold">{development.location?.neighborhood}</h3>
            <p className="mono uppercase tracking-wider font-light text-neutral-500">
              {development.location?.address}
              <br />
              {development.location?.city} — {development.location?.state}
              <br />
              {development.location?.postalCode}
            </p>
          </div>

          <div className="relative w-full aspect-square lg:aspect-video">
            {getMediaUrl(development.location?.map) && (
              <Image
                src={getMediaUrl(development.location?.map) as string}
                alt={development.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* AMENIDADES */}
      {amenities.length && (
        <section>
          <Blockbuster
            title="Amenidades"
            img={getGalleryImage(2) as string}
            development={development.name}
          />

          <div className="w-full px-8 py-20 grid md:grid-cols-2 gap-8">
            {amenities.map((item) => {
              const amenity = item.amenity as Amenity | number

              if (typeof amenity === 'number') {
                return null
              }

              const image = getMediaUrl(item.imageOverride || amenity.image)

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8" key={item.id}>
                  <div className="flex flex-col gap-4 py-8 justify-end border-y border-neutral-800">
                    <h3 className="ft-3 font-bold">{amenity.name}</h3>
                    {amenity.description && <p>{amenity.description}</p>}
                  </div>

                  <div className="relative col-span-2 w-full aspect-square md:aspect-video">
                    {image && (
                      <Image
                        alt={amenity.name}
                        src={image}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* UNIDADES */}
      <section>
        <Blockbuster
          title="Unidades"
          img={getGalleryImage(3) as string}
          development={development.name}
        />

        {units.length ? (
          <div className="w-full py-20">
            <UnitsSwiper units={units} />
          </div>
        ) : (
          <div className="reading-container px-8 py-20 flex flex-col gap-4 justify-center items-center">
            <p>Consulta disponibilidad y lista de precios</p>
            <a href="#contact" className="button !bg-brand-2 !text-brand-4 !w-full">
              Habla con un asesor
            </a>
          </div>
        )}
      </section>

      {/* PLAN PAGOS */}
      <section>
        <Blockbuster
          title="Planes de pago"
          img={getGalleryImage(4) as string}
          development={development.name}
        />

        {paymentPlans.length ? (
          <div className="w-full px-8 py-20 grid md:grid-cols-2 gap-8">
            {paymentPlans.map((pm) => {
              const chart = getMediaUrl(pm.chart)
              const discount = pm.discountPercent

              return (
                <div className="relative grid grid-cols-1 lg:grid-cols-3 lg:gap-8" key={pm.id}>
                  <div className="flex flex-col py-8 justify-end border-y border-neutral-800">
                    <h3 className="ft-3 font-bold">{pm.name}</h3>
                    {discount !== 0 && (
                      <div className="ft-0 text-brand-2 font-bold">Descuento del {discount}%</div>
                    )}
                  </div>

                  <div className="relative col-span-2 w-full aspect-square md:aspect-[4/3] overflow-hidden bg-brand-4">
                    {chart && (
                      <Image
                        alt={pm.name}
                        src={chart}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-center object-contain"
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="reading-container px-8 py-20 flex flex-col gap-4 justify-center items-center">
            <p>Consulta planes de pago</p>
            <a href="#contact" className="button !bg-brand-2 !text-brand-4 !w-full">
              Habla con un asesor
            </a>
          </div>
        )}
      </section>

      {/* SNAPSHOT */}
      <section>
        <Blockbuster
          title="Investment Snapshot"
          img={getGalleryImage(5) as string}
          development={development.name}
        />

        <div className="w-full px-8 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-4 p-6 border border-brand-1 bg-neutral-800">
              <p className="-ft-2 mono uppercase text-brand-4">
                Precio m<sup>2</sup>
              </p>
              <p className="flex ft-6 font-black text-brand-4 mb-8 ml-auto">
                {formatCurrency(development.investmentSnapshot?.pricePerSqm)}
              </p>
              <p className="-ft-2 text-brand-4">Hoy en preventa</p>
            </div>
            <div className="flex flex-col gap-4 p-6 border border-brand-1 bg-neutral-800">
              <p className="-ft-2 mono uppercase text-brand-4">
                Precio m<sup>2</sup> Mercado
              </p>
              <p className="flex ft-6 font-black text-brand-4 mb-8 ml-auto">
                {formatCurrency(development.investmentSnapshot?.marketPricePerSqm)}
              </p>
              <p className="-ft-2 text-brand-4">
                Punto de comparación en {development.location?.neighborhood}
              </p>
            </div>
            <div className="flex flex-col gap-4 p-6 border border-brand-1 bg-neutral-800">
              <p className="-ft-2 mono uppercase text-brand-4">Spread</p>
              <p className="flex ft-6 font-black text-brand-4 mb-8 ml-auto gap-2 items-end">
                <span className="material-icons text-brand-3 rotate-90">arrow_outward</span>
                {development.investmentSnapshot?.spread}%
              </p>
              <p className="-ft-2 text-brand-4">El descuento vs el mercado</p>
            </div>
            <div className="flex flex-col gap-4 p-6 border border-brand-1 bg-neutral-800">
              <p className="-ft-2 mono uppercase text-brand-4">
                ROI a {development.investmentSnapshot?.deliveryMonths} meses
              </p>
              <p className="flex ft-6 font-black text-brand-4 mb-8 ml-auto gap-2 items-end">
                <span className="material-icons text-brand-3">arrow_outward</span>
                {development.investmentSnapshot?.projectedRoi}%
              </p>
              <p className="-ft-2 text-brand-4">Cuánto generas al año en rentas cortas.</p>
            </div>

            <div className="flex flex-col col-span-2 gap-4 p-6 border border-brand-2 bg-brand-2">
              <p className="-ft-2 mono uppercase text-brand-4">
                Plusvalía a {development.investmentSnapshot?.deliveryMonths} meses
              </p>
              <div className="flex flex-col items-end mb-8 ml-auto">
                <p className="ft-6 font-black text-brand-4">
                  {development.investmentSnapshot?.projectedAppreciationMid}%
                </p>
                <p className="-ft-1 font-medium text-brand-4">
                  {'Rango proyectado de: '}
                  {development.investmentSnapshot?.projectedAppreciationLow}
                  {'% a '}
                  {development.investmentSnapshot?.projectedAppreciationHigh}
                  {'%'}
                </p>
              </div>
              <p className="-ft-2 text-brand-4">
                Cuánto se espera que suba el valor de la zona en lo que se entrega tu departamento.
              </p>
            </div>
            <div className="flex flex-col col-span-2 gap-4 p-6 border border-brand-2 bg-brand-2">
              <p className="-ft-2 mono uppercase text-brand-4">Cap Rate Rentas Cortas</p>
              <div className="flex flex-col items-end mb-8 ml-auto">
                <p className="ft-6 font-black text-brand-4">
                  {development.investmentSnapshot?.capRateMid}%
                </p>
                <p className="-ft-1 font-medium text-brand-4">
                  {'Rango proyectado de: '}
                  {development.investmentSnapshot?.capRateLow}
                  {'% a '}
                  {development.investmentSnapshot?.capRateHigh}
                  {'%'}
                </p>
              </div>
              <p className="-ft-2 text-brand-4">
                Cuánto te genera al año en renta de Airbnb, antes de gastos.
              </p>
            </div>
          </div>
          <div className="-ft-3 mt-8">
            Las proyecciones de mercado se basan en datos históricos y estimaciones de fuentes
            externas y no representan una garantía.
          </div>
        </div>
      </section>

      <section className="px-8 py-4 bg-brand-4/60 backdrop-blur sticky bottom-0 z-20">
        <a href="#contact" className="button !bg-brand-2 !text-brand-4 !w-full">
          Habla con un asesor
        </a>
      </section>

      <section id="contact" className="w-full py-20 border-t border-brand-1">
        <div className="reading-container">
          <h2 className="font-bold">
            Programa una sesión para explorar tu inversión en <span>{development.name}</span>, sin
            costo.
          </h2>
          <p className="">
            Ayúdanos con tus datos y a responder un par de preguntas para programar una cita.
            <br />
            <br />
            Incluso podemos explorar otros proyectos afines a tu perfil de inversionista.
          </p>
          <OptInForm />
        </div>
      </section>
    </>
  )
}
