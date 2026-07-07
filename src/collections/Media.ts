import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    bulkUpload: true,
    withMetadata: false,
    formatOptions: { format: 'webp', options: { quality: 75 } },
    resizeOptions: { width: 2000, withoutEnlargement: true },
  },
}
