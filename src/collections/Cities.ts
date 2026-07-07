import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const Cities: CollectionConfig = {
  slug: 'cities',
  admin: {
    defaultColumns: ['name', 'state', 'country'],
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
      name: 'state',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      defaultValue: 'México',
      required: true,
    },
  ],
}
