function parseCookieValue(raw) {
  if (!raw) return null;

  try {
    const clean = raw.startsWith('j%3A') ? raw.slice(4) : raw;
    return JSON.parse(decodeURIComponent(clean));
  } catch {
    return decodeURIComponent(raw);
  }
}

function getCookieFromDocument(name) {
  if (typeof document === 'undefined') return undefined;

  const entry = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`));

  return entry?.split('=').slice(1).join('=');
}

function getQueryValue(searchParams, key) {
  if (!searchParams) return null;

  if (typeof searchParams.get === 'function') {
    return searchParams.get(key);
  }

  const value = searchParams[key];

  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default function getTrackingData(searchParams) {
  const utmCookie = parseCookieValue(getCookieFromDocument('utm'));
  const lead = parseCookieValue(getCookieFromDocument('lead'));
  const fbc = parseCookieValue(getCookieFromDocument('_fbc'));
  const fbp = parseCookieValue(getCookieFromDocument('_fbp'));

  const utmFromQuery = {};
  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ];

  for (const key of utmKeys) {
    const value = getQueryValue(searchParams, key);
    if (value) utmFromQuery[key] = value;
  }

  const utm =
    Object.keys(utmFromQuery).length > 0
      ? utmFromQuery
      : utmCookie ?? null;

  const id = getQueryValue(searchParams, 'id') ?? lead?.id ?? null;

  return {
    shouldRedirect: !id || id === 'undefined' || id === '',
    lead: {
      id,
      fullName: lead?.fullName ?? '',
      email: lead?.email ?? '',
      phone: lead?.phone ?? '',
      whatsapp: lead?.whatsapp ?? '',
      sheetRow: lead?.sheetRow ?? '',
      lastClick: lead?.lastClick ?? '',
    },
    utm,
    fbc,
    fbp,
  };
}
