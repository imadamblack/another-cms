import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

// Recibe los eventos que dispara src/services/fbEvents.js desde el cliente
// y los reenvía a la Conversions API (server-side) de Meta.
const FB_GRAPH_VERSION = process.env.FB_GRAPH_VERSION || 'v21.0'

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

// Meta exige normalizar antes de hashear: email en minúsculas sin espacios,
// teléfono solo dígitos (con lada, sin '+').
function hashEmail(email?: string) {
  if (!email) return undefined
  return hash(email.trim().toLowerCase())
}

function hashPhone(phone?: string) {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  return digits ? hash(digits) : undefined
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { eventName, eventID, user, clientData } = body ?? {}

    if (!eventName) {
      return NextResponse.json({ success: false, error: 'eventName is required' }, { status: 400 })
    }

    const pixelId = process.env.PIXEL
    const accessToken = process.env.FB_CAPI_TOKEN

    if (!pixelId || !accessToken) {
      console.error('[fb-event] Faltan las env vars PIXEL o FB_CAPI_TOKEN')
      return NextResponse.json({ success: false, error: 'Missing Meta CAPI config' }, { status: 500 })
    }

    const referer = req.headers.get('referer') ?? undefined
    const userAgent = req.headers.get('user-agent') ?? undefined
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined

    // Las cookies _fbc/_fbp las setea el pixel en el navegador y viajan
    // automáticamente con el fetch same-origin de fbEvents.js.
    const fbc = req.cookies.get('_fbc')?.value
    const fbp = req.cookies.get('_fbp')?.value

    const userData = {
      em: hashEmail(user?.em),
      ph: hashPhone(user?.ph),
      external_id: user?.externalID ? hash(String(user.externalID)) : undefined,
      fbc,
      fbp,
      client_user_agent: userAgent,
      client_ip_address: ip,
    }

    const filteredUserData = Object.fromEntries(
      Object.entries(userData).filter(([, value]) => value !== undefined)
    )

    const payload = {
      data: [
        {
          event_name: eventName,
          event_id: String(eventID ?? Date.now()),
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: referer,
          user_data: filteredUserData,
          custom_data: clientData || {},
        },
      ],
      ...(process.env.FB_CAPI_TEST_EVENT_CODE
        ? { test_event_code: process.env.FB_CAPI_TEST_EVENT_CODE }
        : {}),
    }

    const url = `https://graph.facebook.com/${FB_GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`

    const fbResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await fbResponse.json()

    if (!fbResponse.ok) {
      console.error('[fb-event] Meta CAPI error', result)
      return NextResponse.json({ success: false, error: result }, { status: fbResponse.status })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('[fb-event] error', error)
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
