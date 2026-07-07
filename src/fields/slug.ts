import type { Field } from 'payload'

type SlugFieldOptions = {
  source?: string
  unique?: boolean
}

export const formatSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = ({ source = 'name', unique = true }: SlugFieldOptions = {}): Field => ({
  name: 'slug',
  type: 'text',
  admin: {
    description: `Se genera automáticamente desde "${source}" si lo dejas vacío.`,
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ data, value }) => {
        if (typeof value === 'string' && value.trim()) {
          return formatSlug(value)
        }

        const sourceValue = data?.[source]

        if (typeof sourceValue === 'string') {
          return formatSlug(sourceValue)
        }

        return value
      },
    ],
  },
  required: true,
  unique,
})
