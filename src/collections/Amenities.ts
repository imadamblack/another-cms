import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const Amenities: CollectionConfig = {
  slug: 'amenities',
  admin: {
    defaultColumns: ['name', 'updatedAt'],
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Nombre interno del icono, si se usa en el frontend.',
      },
    },
  ],
}
