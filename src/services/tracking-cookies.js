import { getCookie } from 'cookies-next';

// NOTA: archivo generado (no incluido en los archivos compartidos). Lee los
// parámetros UTM de la URL y las cookies estándar de Meta Pixel (_fbc/_fbp)
// para acompañar los eventos de conversión y el webhook de opt-in.
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

export default function getTrackingData(searchParams) {
  const utm = {};

  UTM_KEYS.forEach((key) => {
    const value = searchParams?.get?.(key);
    if (value) utm[key] = value;
  });

  const fbc = getCookie('_fbc') ?? '';
  const fbp = getCookie('_fbp') ?? '';

  return { utm, fbc, fbp };
}
