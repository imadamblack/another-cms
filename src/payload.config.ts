import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Amenities } from './collections/Amenities'
import { Cities } from './collections/Cities'
import { Developers } from './collections/Developers'
import { Developments } from './collections/Developments'
import { Neighborhoods } from './collections/Neighborhoods'
import { Units } from './collections/Units'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: '/components/AdminLogo#AdminLogo',
        Icon: '/components/Favicon#Favicon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Amenities, Cities, Neighborhoods, Developers, Developments, Units],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      // Se desactiva sola si no hay token (dev local sigue usando disco).
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      clientUploads: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    }),
  ],
})
