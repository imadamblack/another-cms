import config from '../../../payload.config'
import { getPayload } from 'payload'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

async function getDevelopments() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const developments = await payload.find({
    collection: 'developments',
    depth: 0,
    limit: 100
  })

  if (!developments) {
    return null
  }

  return {
    developments: developments.docs,
  }
}

export default async function Developments({ params }: PageProps) {
  const devs = await getDevelopments();
  return (
    <section className="container py-20">
      <h1>Desarrollos</h1>
      <ul>
        {devs?.developments.map((d) => (
          <li key={d.id}>
            <a href={`/desarrollos/${d.slug}`} className="link">
              {d.name} ({d.status})
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}