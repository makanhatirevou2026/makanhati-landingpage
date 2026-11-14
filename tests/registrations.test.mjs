import test from 'node:test';
import assert from 'node:assert/strict';
import { createRegistrationHandler } from '../src/server/registrations.mjs';
import { registrationApiSchema } from '../src/lib/validation.ts';

const secret = 'test-only-secret-never-used-for-production';
const endpoint = 'https://script.google.com/macros/s/test-deployment/exec';
const values = { customerName: 'Uji MakanHati', instagramUsername: '@uji_makanhati', consent: true };
const key = 'abcd1234abcd1234abcd1234abcd1234';
function request(value = values, options = {}) {
  return new Request(options.url || 'https://tewsww.vercel.app/api/registrations', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'idempotency-key': key, origin: 'https://tewsww.vercel.app', ...options.headers },
    body: options.raw ?? JSON.stringify(value)
  });
}
function setup(options = {}) {
  const sent = [];
  const handler = createRegistrationHandler({
    parseRegistration: value => registrationApiSchema.safeParse(value),
    getConfig: () => ({ endpoint, secret }),
    fetchImpl: async (url, config) => {
      const payload = JSON.parse(config.body);
      sent.push({ url, config, payload });
      return Response.json({ success: true, persisted: true, storage: 'google-sheets', requestId: payload.requestId, submittedAt: '2026-11-14T00:00:00.000Z', duplicate: false });
    },
    ...options
  });
  return { handler, sent };
}

test('Confirmed persistence returns success and forwards only the agreed registration data', async () => {
  const { handler, sent } = setup();
  const response = await handler(request({ ...values, packageId: 'bulanan', utmCampaign: 'private-data', whatsapp: 'ignored' }));
  const result = await response.json();
  assert.equal(response.status, 201);
  assert.equal(result.persisted, true);
  assert.equal(result.storage, 'google-sheets');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  assert.deepEqual(Object.keys(sent[0].payload).sort(), ['token', 'requestId', 'customerName', 'instagramUsername', 'consent'].sort());
  assert.equal(sent[0].payload.token, secret);
  assert.equal(sent[0].config.redirect, 'follow');
  assert.match(result.registrationId, /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  assert.equal(JSON.stringify(result).includes(secret), false);
  assert.equal(JSON.stringify(result).includes(values.instagramUsername), false);
});

test('Retries retain the same storage ID across independently created server instances', async () => {
  const first = setup(), second = setup();
  const a = await (await first.handler(request())).json();
  const b = await (await second.handler(request())).json();
  assert.equal(a.registrationId, b.registrationId);
});

test('Next.js internal localhost URLs still accept the actual browser Host and forwarded scheme', async () => {
  const { handler } = setup();
  const response = await handler(request(values, { url: 'http://localhost:3003/api/registrations', headers: {
    origin: 'http://127.0.0.1:3003', host: '127.0.0.1:3003', 'x-forwarded-proto': 'http'
  } }));
  assert.equal(response.status, 201);
});

test('Missing, mismatched or unconfirmed upstream acknowledgements never become successful registrations', async () => {
  for (const patch of [
    { success: false }, { persisted: false }, { storage: 'local' },
    { requestId: 'different' }, { submittedAt: '' }, { duplicate: undefined }
  ]) {
    const { handler } = setup({ fetchImpl: async (_, config) => Response.json({
      success: true, persisted: true, storage: 'google-sheets',
      requestId: JSON.parse(config.body).requestId, submittedAt: '2026-11-14T00:00:00Z', duplicate: false, ...patch
    }) });
    const response = await handler(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).persisted, false);
  }
});

test('HTML login responses, network errors and upstream HTTP failure are honest failures', async () => {
  for (const fetchImpl of [
    async () => new Response('<html>Sign in</html>'),
    async () => { throw new Error('timeout'); },
    async () => Response.json({ success: true }, { status: 500 })
  ]) {
    const response = await setup({ fetchImpl }).handler(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).success, false);
  }
});

test('A confirmed duplicate succeeds; a conflicting ID is never treated as a new registration', async () => {
  const duplicate = setup({ fetchImpl: async (_, config) => Response.json({
    success: true, persisted: true, storage: 'google-sheets', requestId: JSON.parse(config.body).requestId,
    submittedAt: '2026-11-14T00:00:00Z', duplicate: true
  }) });
  assert.equal((await duplicate.handler(request())).status, 200);
  const conflict = setup({ fetchImpl: async () => Response.json({ success: false, persisted: false, code: 'ID_CONFLICT' }) });
  const response = await conflict.handler(request());
  assert.equal(response.status, 409);
  assert.equal((await response.json()).persisted, false);
});

test('Invalid data, absent consent, honeypot and invalid idempotency keys never reach Sheets', async () => {
  const { handler, sent } = setup();
  for (const change of [{ consent: false }, { customerName: '<script>' }, { instagramUsername: 'bad url' }, { website: 'bot' }]) {
    const response = await handler(request({ ...values, ...change }));
    assert.equal((await response.json()).persisted, false);
  }
  assert.equal((await handler(request(values, { headers: { 'idempotency-key': '' } }))).status, 400);
  assert.equal(sent.length, 0);
});

test('Foreign origin, malformed JSON, wrong content type and oversized bodies are rejected', async () => {
  const { handler, sent } = setup();
  assert.equal((await handler(request(values, { headers: { origin: 'https://other.example' } }))).status, 403);
  assert.equal((await handler(request(values, { headers: { 'content-type': 'text/plain' } }))).status, 415);
  assert.equal((await handler(request(values, { raw: '{' }))).status, 400);
  assert.equal((await handler(request(values, { raw: 'x'.repeat(8193) }))).status, 400);
  assert.equal(sent.length, 0);
});

test('Absent credentials or an unapproved destination never sends data elsewhere', async () => {
  for (const config of [
    { endpoint, secret: '' }, { endpoint: 'https://attacker.example/exec', secret },
    { endpoint: endpoint + '?token=unsafe', secret }, { endpoint: '', secret }
  ]) {
    const { handler, sent } = setup({ getConfig: () => config });
    const response = await handler(request());
    assert.equal(response.status, 503);
    assert.equal(sent.length, 0);
  }
});

test('The existing five-per-hour per-instance rate guard expires and never forwards a rejected attempt', async () => {
  let time = 1000;
  const { handler, sent } = setup({ now: () => time });
  for (let i = 0; i < 5; i++) assert.equal((await handler(request())).status, 201);
  assert.equal((await handler(request())).status, 429);
  assert.equal(sent.length, 5);
  time += 3600001;
  assert.equal((await handler(request())).status, 201);
});
