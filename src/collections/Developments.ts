import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const Developments: CollectionConfig = {
  slug: 'developments',
  admin: {
    defaultColumns: ['name', 'status', 'featuredOnHome', 'updatedAt'],
    useAsTitle: 'name',
    livePreview: {
      url: ({ data }) => `/desarrollos/${data.slug}`,
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'heroImage',
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
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Publicado', value: 'published' },
        { label: 'Oculto', value: 'hidden' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Ej. Providencia | Guadalajara',
      },
    },
    {
      type: 'collapsible',
      label: 'Tarjeta en Home (sección Proyectos)',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'featuredOnHome',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Muestra este desarrollo en la sección "Proyectos" de la home.',
              },
            },
            {
              name: 'homeSortOrder',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Orden dentro de la sección (menor número = primero).',
              },
            },
          ],
        },
        {
          name: 'homeBadge',
          type: 'text',
          admin: {
            description: 'Etiqueta opcional sobre la imagen. Ej. "Últimas unidades".',
          },
        },
        {
          name: 'homeStartingPriceLabel',
          type: 'text',
          admin: {
            description: 'Ej. "$2.2 mdp". Si se deja vacío se muestra "Precio por definir".',
          },
        },
        {
          name: 'homeShortDescription',
          type: 'textarea',
          admin: {
            description: 'Descripción corta para la tarjeta. Si se deja vacío se usa "tagline".',
          },
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'neighborhood',
              type: 'text',
            },
            {
              name: 'postalCode',
              type: 'text',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
            },
            {
              name: 'state',
              type: 'text',
            },
          ],
        },
        {
          name: 'map',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Imagen del mapa de ubicación.',
          },
        },
      ],
    },
    {
      name: 'amenities',
      type: 'array',
      fields: [
        {
          name: 'amenity',
          type: 'relationship',
          relationTo: 'amenities',
          required: true,
        },
        {
          name: 'imageOverride',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Imagen específica de este desarrollo para la amenidad. Si se deja vacío se usa la imagen default de la amenidad.',
          },
        },
      ],
    },
    {
      name: 'units',
      type: 'join',
      collection: 'units',
      on: 'development',
    },
    {
      name: 'investmentSnapshot',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pricePerSqm',
              type: 'number',
            },
            {
              name: 'marketPricePerSqm',
              type: 'number',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'spread',
              type: 'number',
            },
            {
              name: 'projectedRoi',
              type: 'number',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'deliveryMonths',
              type: 'number',
            },
            {
              name: 'investedCapitalAtDelivery',
              type: 'number',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'projectedAppreciationLow',
              type: 'number',
            },
            {
              name: 'projectedAppreciationHigh',
              type: 'number',
            },
            {
              name: 'projectedAppreciationMid',
              type: 'number',
              admin: {
                readOnly: true,
                description: 'Calculado: (baja + alta) / 2.',
              },
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    const low = siblingData?.projectedAppreciationLow
                    const high = siblingData?.projectedAppreciationHigh

                    if (typeof low === 'number' && typeof high === 'number') {
                      return Math.round(((low + high) / 2) * 100) / 100
                    }

                    return null
                  },
                ],
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'capRateLow',
              type: 'number',
            },
            {
              name: 'capRateHigh',
              type: 'number',
            },
            {
              name: 'capRateMid',
              type: 'number',
              admin: {
                readOnly: true,
                description: 'Calculado: (bajo + alto) / 2.',
              },
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    const low = siblingData?.capRateLow
                    const high = siblingData?.capRateHigh

                    if (typeof low === 'number' && typeof high === 'number') {
                      return Math.round(((low + high) / 2) * 100) / 100
                    }

                    return null
                  },
                ],
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'equityAtDeliveryLow',
              type: 'number',
            },
            {
              name: 'equityAtDeliveryHigh',
              type: 'number',
            },
            {
              name: 'equityAtDeliveryMid',
              type: 'number',
              admin: {
                readOnly: true,
                description: 'Calculado: (bajo + alto) / 2.',
              },
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    const low = siblingData?.equityAtDeliveryLow
                    const high = siblingData?.equityAtDeliveryHigh

                    if (typeof low === 'number' && typeof high === 'number') {
                      return Math.round(((low + high) / 2) * 100) / 100
                    }

                    return null
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'paymentPlans',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'discountPercent',
              type: 'number',
            },
          ],
        },
        {
          name: 'chart',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
  ],
}
