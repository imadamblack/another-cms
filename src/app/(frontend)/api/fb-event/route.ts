import { NextRequest, NextResponse } from 'next/server'

// NOTA: endpoint generado (no incluido en los archivos compartidos).
// Recibe los eventos que dispara src/services/fbEvents.js desde el cliente.
// TODO: conectar aquí la Conversions API de Meta (server-side) usando
// process.env.PIXEL y un access token, en vez de solo responder ok.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[fb-event]', body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[fb-event] error', error)
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
