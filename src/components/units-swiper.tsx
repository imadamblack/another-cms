'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import type { Media, Unit } from '@/payload-types'

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

export default function UnitsSwiper({ units }: { units: Unit[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    const slide = track?.children[index] as HTMLElement | undefined

    if (!track || !slide) {
      return
    }

    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const track = trackRef.current

    if (!track) {
      return
    }

    let frame: number

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const children = Array.from(track.children) as HTMLElement[]
        let closest = 0
        let closestDistance = Infinity

        children.forEach((child, index) => {
          const distance = Math.abs(child.offsetLeft - track.scrollLeft)

          if (distance < closestDistance) {
            closestDistance = distance
            closest = index
          }
        })

        setActive(closest)
      })
    }

    track.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  if (!units.length) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex flex-nowrap w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {units.map((unit, index) => {
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
            <div
              className="relative grid grid-cols-1 lg:grid-cols-3 lg:gap-8 w-full shrink-0 grow-0 basis-full snap-start px-8"
              style={{ width: '100%', minWidth: '100%' }}
              key={unit.id}
            >
              <div className="flex flex-col gap-4 py-8 justify-end border-y border-neutral-800">
                {soldOut && (
                  <div className="absolute right-8 bottom-0 ft-0 bg-brand-2 w-max px-4 py-2 font-bold text-brand-4 z-10">
                    SOLD OUT
                  </div>
                )}
                <p className="-ft-2 mono uppercase text-neutral-500 flex-grow">
                  {String(index + 1).padStart(2, '0')} / {String(units.length).padStart(2, '0')}
                </p>
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

              <div className="relative col-span-2 p-4 w-full aspect-square md:aspect-[2/1] overflow-hidden bg-brand-4">
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
      </div>

      {units.length > 1 && (
        <div className="flex items-center justify-between px-8 mt-6">
          <button
            type="button"
            aria-label="Unidad anterior"
            onClick={() => scrollToIndex(Math.max(active - 1, 0))}
            disabled={active === 0}
            className="!p-4 !bg-transparent hover:!text-brand-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <div className="flex gap-2">
            {units.map((unit, index) => (
              <div
                key={unit.id}
                aria-label={`Ir a la unidad ${index + 1}`}
                onClick={() => scrollToIndex(index)}
                className={`flex h-4 w-4 rounded-full transition-colors cursor-pointer ${
                  index === active ? 'bg-brand-2' : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Siguiente unidad"
            onClick={() => scrollToIndex(Math.min(active + 1, units.length - 1))}
            disabled={active === units.length - 1}
            className="!p-4 !bg-transparent hover:!text-brand-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  )
}
