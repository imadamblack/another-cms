import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Amenity, Development, Media, Unit } from '@/payload-types'

import OptInForm from '@/components/opt-in-form'

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

const formatArea = (value?: number | null) => {
  if (!value) {
    return null
  }

  return `${value.toLocaleString('es-MX')} m²`
}

const formatRooms = (value?: number | null, singular = 'recámara', plural = 'recámaras') => {
  if (!value) {
    return null
  }

  return `${value} ${value === 1 ? singular : plural}`
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
        {
          status: {
            equals: 'published',
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
      description: development.description || undefined,
      images: image ? [{ url: image }] : undefined,
      title: `Another Listing: ${development.name}`,
    },
    title: `Another Listing: ${development.name}`,
  }
}

export default async function DevelopmentPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getDevelopment(slug)

  if (!result) {
    notFound()
  }

  const development = result.development as Development
  const units = result.units as Unit[]
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
          <p className="ft-3">{development.tagline}</p>
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
      <section className="relative flex flex-col items-center justify-center aspect-[3/2] md:aspect-[3/1] bg-brand-1">
        <div className="absolute flex inset-0 overflow-hidden">
          {getGalleryImage(1) && (
            <Image
              src={getGalleryImage(1) as string}
              alt={development.name}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute flex inset-0 bg-neutral-800/60" />
        </div>
        <div className="z-10 text-center">
          <p className="-ft-1 mono uppercase text-neutral-200">{development.name}</p>
          <h2 className="ft-10 text-neutral-200 font-black">Ubicación</h2>
        </div>
      </section>

      <section className="px-8 py-20 grid md:grid-cols-2 gap-8">
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
      </section>

      {/* AMENIDADES */}
      {amenities.length && (
        <>
          <section className="relative flex flex-col items-center justify-center aspect-[3/2] md:aspect-[3/1] bg-brand-1">
            <div className="absolute flex inset-0 overflow-hidden">
              {getGalleryImage(2) && (
                <Image
                  src={getGalleryImage(2) as string}
                  alt={development.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              )}
              <div className="absolute flex inset-0 bg-neutral-800/60" />
            </div>
            <div className="z-10 text-center">
              <p className="-ft-1 mono uppercase text-neutral-200">{development.name}</p>
              <h2 className="ft-10 text-neutral-200 font-black">Amenidades</h2>
            </div>
          </section>

          <section className="px-8 py-20 grid md:grid-cols-2 gap-8">
            {amenities.map((item) => {
              const amenity = item.amenity as Amenity | number

              if (typeof amenity === 'number') {
                return null
              }

              const image = getMediaUrl(item.imageOverride || amenity.image)

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8" key={item.id}>
                  <div className="flex flex-col gap-4 py-8 justify-end border-y border-neutral-800">
                    <h3 className="ft-6 font-bold">{amenity.name}</h3>
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
          </section>
        </>
      )}

      {/* UNIDADES */}
      <section className="relative flex flex-col items-center justify-center aspect-[3/2] md:aspect-[3/1] bg-brand-1">
        <div className="absolute flex inset-0 overflow-hidden">
          {getGalleryImage(3) && (
            <Image
              src={getGalleryImage(3) as string}
              alt={development.name}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute flex inset-0 bg-neutral-800/60" />
        </div>
        <div className="z-10 text-center">
          <p className="-ft-1 mono uppercase text-neutral-200">{development.name}</p>
          <h2 className="ft-10 text-neutral-200 font-black">Unidades</h2>
        </div>
      </section>

      {units.length ? (
        <section className="px-8 py-20 grid md:grid-cols-2 gap-8">
          {units.map((unit) => {
            const image = getMediaUrl(unit.floorPlan)
            const soldOut = unit.status === 'soldOut'
            const totalArea = formatArea(unit.attributes?.totalArea)
            const bedrooms = formatRooms(unit.attributes?.bedrooms)
            const bathrooms = formatRooms(unit.attributes?.bathrooms, 'baño', 'baños')
            const parking = formatRooms(
              unit.attributes?.parkingSpaces,
              'estacionamiento',
              'estacionamientos',
            )

            return (
              <div className="relative grid grid-cols-1 lg:grid-cols-3 lg:gap-8" key={unit.id}>
                <div className="flex flex-col gap-4 py-8 justify-end border-y border-neutral-800">
                  {soldOut && (
                    <div className="absolute right-0 bottom-0 ft-0 bg-brand-2 w-max px-4 py-2 font-bold text-brand-4 z-10">
                      SOLD OUT
                    </div>
                  )}
                  <h3 className="ft-6 font-bold">{unit.name}</h3>
                  <p>{unit.pricing?.priceLabel}</p>
                  <div className="-ft-2 mono uppercase text-neutral-600">
                    {totalArea && <span>{totalArea} | </span>}
                    {bedrooms && <span>{bedrooms} | </span>}
                    {bathrooms && <span>{bathrooms} | </span>}
                    {parking && <span>{parking} | </span>}
                    {unit.attributes?.hasTerrace && <span>Terraza</span>}
                  </div>
                </div>

                <div className="relative col-span-2 p-4 w-full aspect-square md:aspect-[4/3] overflow-hidden">
                  {image && (
                    <Image
                      alt={unit.name}
                      src={image}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-center object-contain"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </section>
      ) : (
        <p className="ft-1">Unidades por definir.</p>
      )}

      {/* PLAN PAGOS */}
      <section className="relative flex flex-col items-center justify-center aspect-[3/2] md:aspect-[3/1] bg-brand-1">
        <div className="absolute flex inset-0 overflow-hidden">
          {getGalleryImage(4) && (
            <Image
              src={getGalleryImage(4) as string}
              alt={development.name}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute flex inset-0 bg-neutral-800/60" />
        </div>
        <div className="z-10 text-center">
          <p className="-ft-1 mono uppercase text-neutral-200">{development.name}</p>
          <h2 className="ft-10 text-neutral-200 font-black">Planes de Pago</h2>
        </div>
      </section>

      {paymentPlans.length ? (
        <section className="px-8 py-20 grid md:grid-cols-2 gap-8">
          {paymentPlans.map((pm) => {
            const chart = getMediaUrl(pm.chart)
            const discount = pm.discountPercent

            return (
              <div className="relative grid grid-cols-1 lg:grid-cols-3 lg:gap-8" key={pm.id}>
                <div className="flex flex-col gap-4 py-8 justify-end border-y border-neutral-800">
                  <h3 className="ft-6 font-bold">{pm.name}</h3>
                  {discount !== 0 && (
                    <div className="ft-0 bg-brand-2 w-max px-4 py-2 font-bold text-brand-4">
                      Descuento del {discount}%
                    </div>
                  )}
                </div>

                <div className="relative col-span-2 w-full aspect-square md:aspect-[4/3] overflow-hidden">
                  {chart && (
                    <Image
                      alt={pm.name}
                      src={chart}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-center object-cover"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </section>
      ) : (
        <p className="ft-1">Unidades por definir.</p>
      )}

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
