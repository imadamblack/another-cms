import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      // Assets estáticos del landing (public/)
      {
        pathname: '/logo.svg',
      },
      {
        pathname: '/logo-outline.svg',
      },
      {
        pathname: '/notoriovs.png',
      },
      {
        pathname: '/images/**',
      },
    ],
    // Media en producción vive en Vercel Blob (media.url apunta ahí, no a
    // /api/media/file/**). Sin este pattern, next/image rechaza optimizar
    // esas URLs y sirve el archivo original sin resize/webp/responsive
    // srcset, lo que explica buena parte de la carga lenta.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
