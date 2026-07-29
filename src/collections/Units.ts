import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { slugField } from '@/fields/slug'

// Las unidades se muestran dentro de /listings/[slug] del desarrollo padre.
// Esa página se cachea (Full Route Cache) y no se invalida sola, así que sin
// esto el preview del desarrollo no refleja cambios hechos en sus unidades.
const revalidateParentDevelopment = async (
  developmentRelation: unknown,
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
) => {
  let developmentId: number | string | undefined

  if (typeof developmentRelation === 'number' || typeof developmentRelation === 'string') {
    developmentId = developmentRelation
  } else if (
    typeof developmentRelation === 'object' &&
    developmentRelation !== null &&
    'id' in developmentRelation
  ) {
    developmentId = (developmentRelation as { id: number | string }).id
  }

  if (!developmentId) return

  const development = await req.payload.findByID({
    collection: 'developments',
    id: developmentId,
    depth: 0,
  })

  if (development?.slug) {
    revalidatePath(`/listings/${development.slug}`)
  }
}

const revalidateUnit: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  await revalidateParentDevelopment(doc.development, req)

  if (previousDoc?.development && previousDoc.development !== doc.development) {
    await revalidateParentDevelopment(previousDoc.development, req)
  }

  return doc
}

const revalidateUnitDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateParentDevelopment(doc?.development, req)

  return doc
}

export const Units: CollectionConfig = {
  slug: 'units',
  admin: {
    defaultColumns: ['name', 'development', 'status', 'priceLabel', 'updatedAt'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateUnit],
    afterDelete: [revalidateUnitDelete],
  },
  fields: [
    {
      name: 'development',
      type: 'relationship',
      relationTo: 'developments',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({ unique: false }),
    {
      name: 'unitType',
      type: 'select',
      options: [
        { label: 'Suite', value: 'suite' },
        { label: 'Loft', value: 'loft' },
        { label: 'Departamento', value: 'apartment' },
        { label: 'Penthouse', value: 'penthouse' },
        { label: 'Casa', value: 'house' },
        { label: 'Lote', value: 'lot' },
        { label: 'Oficina', value: 'office' },
        { label: 'Otro', value: 'other' },
      ],
    },
    {
      name: 'recordType',
      type: 'select',
      defaultValue: 'typology',
      options: [
        { label: 'Tipología / modelo', value: 'typology' },
        { label: 'Unidad específica', value: 'specificUnit' },
      ],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Disponible', value: 'available' },
        { label: 'Apartada', value: 'reserved' },
        { label: 'Vendida', value: 'sold' },
        { label: 'Sold out', value: 'soldOut' },
        { label: 'Oculta', value: 'hidden' },
      ],
      required: true,
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'price',
          type: 'number',
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'MXN',
          options: ['MXN', 'USD'],
        },
        {
          name: 'isStartingPrice',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'priceLabel',
          type: 'text',
          admin: {
            description: 'Ej. Desde $4.5 MDP o SOLD OUT.',
          },
        },
      ],
    },
    {
      name: 'attributes',
      type: 'group',
      fields: [
        {
          name: 'interiorArea',
          type: 'number',
        },
        {
          name: 'terraceArea',
          type: 'number',
        },
        {
          name: 'totalArea',
          type: 'number',
        },
        {
          name: 'bedrooms',
          type: 'number',
        },
        {
          name: 'bathrooms',
          type: 'number',
        },
        {
          name: 'halfBathrooms',
          type: 'number',
        },
        {
          name: 'parkingSpaces',
          type: 'number',
        },
        {
          name: 'hasTerrace',
          type: 'checkbox',
        },
        {
          name: 'floor',
          type: 'text',
        },
      ],
    },
    {
      name: 'floorPlan',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
