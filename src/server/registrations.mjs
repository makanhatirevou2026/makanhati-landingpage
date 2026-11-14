import { createHmac } from 'node:crypto';

const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
const reply = (status, value) => Response.json({ success: false, persisted: false, ...value }, { status, headers });
const unavailable = () => reply(503, { error: 'Pendaftaran belum dapat disimpan. Silakan coba kembali sebentar lagi.' });

export function registrationIdFor(key, secret) {
  const bytes = createHmac('sha256', secret).update('makanhati-registration:v1\0' + key).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function limitedJson(message, limit) {
  if (Number(message.headers.get('content-length')) > limit) throw Error('BODY_LIMIT');
  const reader = message.body?.getReader();
  if (!reader) throw Error('INVALID_BODY');
  const chunks = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw Error('BODY_LIMIT'); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createRegistrationHandler({ parseRegistration, getConfig, fetchImpl = fetch, rateLimit = 5, now = Date.now }) {
  const attempts = new Map();
  return async function handle(request) {
    const origin = request.headers.get('origin');
    const requestUrl = new URL(request.url);
    const host = request.headers.get('host');
    const forwardedProtocol = request.headers.get('x-forwarded-proto');
    const protocol = forwardedProtocol === 'https' || forwardedProtocol === 'http' ? forwardedProtocol + ':' : requestUrl.protocol;
    // Next.js may use localhost internally; Host is the browser's actual target.
    const browserOrigin = host ? `${protocol}//${host}` : requestUrl.origin;
    if ((origin && origin !== requestUrl.origin && origin !== browserOrigin) || request.headers.get('sec-fetch-site') === 'cross-site') {
      return reply(403, { error: 'Pengiriman harus dilakukan dari website MakanHati.' });
    }
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return reply(415, { error: 'Format permintaan tidak valid.' });
    }
    let body;
    try { body = await limitedJson(request, 8192); }
    catch { return reply(400, { error: 'Format permintaan tidak valid atau terlalu besar.' }); }
    const parsed = parseRegistration(body);
    if (!parsed.success) return reply(422, { error: 'Data pendaftaran belum valid.' });
    const data = parsed.data;
    if (data.website?.trim()) return reply(400, { error: 'Pendaftaran belum dapat diproses.' });
    const key = request.headers.get('idempotency-key');
    if (!key || !/^[a-zA-Z0-9_-]{16,128}$/.test(key)) {
      return reply(400, { error: 'Kunci permintaan tidak valid. Silakan muat ulang halaman.' });
    }
    const { endpoint, secret } = getConfig();
    let url;
    try { url = new URL(endpoint); } catch { return unavailable(); }
    if (url.origin !== 'https://script.google.com' || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname) ||
        url.username || url.password || url.search || url.hash || !secret || secret.length < 32 || secret.length > 256) return unavailable();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const ipKey = createHmac('sha256', secret).update('rate\0' + ip).digest('hex');
    const time = now();
    for (const [id, entry] of attempts) if (entry.resetAt <= time) attempts.delete(id);
    if (attempts.size >= 2000 && !attempts.has(ipKey)) attempts.delete(attempts.keys().next().value);
    const entry = attempts.get(ipKey) || { count: 0, resetAt: time + 3600000 };
    if (entry.count >= rateLimit) return reply(429, { error: 'Terlalu banyak percobaan. Silakan coba lagi nanti.' });
    entry.count++;
    attempts.set(ipKey, entry);
    const requestId = registrationIdFor(key, secret);
    let response, result;
    try {
      response = await fetchImpl(url.href, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: secret, requestId, customerName: data.customerName.replace(/\s+/g, ' '), instagramUsername: data.instagramUsername, consent: true }),
        redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(25000)
      });
      result = await limitedJson(response, 65536);
    } catch { return unavailable(); }
    if (!response.ok || result?.success !== true || result?.persisted !== true || result?.storage !== 'google-sheets' ||
        result?.requestId !== requestId || typeof result?.submittedAt !== 'string' || !Number.isFinite(Date.parse(result.submittedAt)) || typeof result?.duplicate !== 'boolean') {
      if (result?.code === 'ID_CONFLICT') return reply(409, { error: 'Kiriman ini sudah tercatat dengan data berbeda. Muat ulang halaman untuk pendaftaran baru.' });
      return unavailable();
    }
    return reply(result.duplicate ? 200 : 201, {
      success: true, persisted: true, storage: 'google-sheets', registrationId: requestId,
      submittedAt: result.submittedAt, duplicate: result.duplicate
    });
  };
}
