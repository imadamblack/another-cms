import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const Neighborhoods: CollectionConfig = {
  slug: 'neighborhoods',
  admin: {
    defaultColumns: ['name', 'city', 'updatedAt'],
    useAsTitle: 'name',
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
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'investmentPitch',
      type: 'textarea',
      admin: {
        description: 'Texto comercial breve sobre plusvalía, estilo de vida o atractivo de la zona.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
