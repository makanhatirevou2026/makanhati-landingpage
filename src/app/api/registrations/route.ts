import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { type NextRequest } from 'next/server';
import { registrationApiSchema } from '@/lib/validation';
import { generateRequestId, sanitizeInput } from '@/lib/utils';



interface RegistrationRecord {
  id: string;
  customerName: string;
  instagramUsername: string;
  consentAt: string;
  consentVersion: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
}

const localDataFile = join(process.cwd(), '.local-data', 'registrations.json');
const idempotencyStore = new Map<string, { registrationId: string; createdAt: number }>();
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const IDEMPOTENCY_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

async function readLocalRegistrations(): Promise<RegistrationRecord[]> {
  try {
    const raw = await readFile(localDataFile, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as RegistrationRecord[] : [];
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveLocalRegistration(record: RegistrationRecord): Promise<void> {
  await mkdir(dirname(localDataFile), { recursive: true });
  const registrations = await readLocalRegistrations();
  registrations.push(record);
  const temporaryFile = `${localDataFile}.${randomUUID()}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(registrations, null, 2), 'utf8');
  await rename(temporaryFile, localDataFile);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return Response.json(
      { success: false, error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
      { status: 429, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: 'Format permintaan tidak valid.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const parsed = registrationApiSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || '_';
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return Response.json(
      { success: false, error: 'Data pendaftaran belum valid.', fieldErrors },
      { status: 422, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const data = parsed.data;
  // Quietly accept automated submissions caught by the hidden honeypot field.
  if (data.website?.trim()) {
    return Response.json(
      { success: true, persisted: false, registrationId: 'MH-AUTO' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // This implementation deliberately persists only to a local JSON file.
  // Production deployments must connect a durable database before accepting registrations.
  if (process.env.NODE_ENV !== 'development') {
    return Response.json(
      {
        success: false,
        error: 'Pendaftaran online belum diaktifkan. Tim MakanHati perlu menghubungkan penyimpanan database terlebih dahulu.',
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const idempotencyKey = request.headers.get('Idempotency-Key');
  if (!idempotencyKey || idempotencyKey.length > 128) {
    return Response.json(
      { success: false, error: 'Kunci permintaan tidak valid. Silakan muat ulang halaman.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const existing = idempotencyStore.get(idempotencyKey);
  if (existing && Date.now() - existing.createdAt < IDEMPOTENCY_WINDOW_MS) {
    return Response.json(
      { success: true, persisted: true, registrationId: existing.registrationId },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const now = new Date().toISOString();
  const registrationId = generateRequestId();
  const instagram = data.instagramUsername.startsWith('@')
    ? data.instagramUsername
    : `@${data.instagramUsername}`;

  const record: RegistrationRecord = {
    id: registrationId,
    customerName: sanitizeInput(data.customerName).replace(/\s+/g, ' '),
    instagramUsername: sanitizeInput(instagram),
    consentAt: now,
    consentVersion: '1.0',
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
    createdAt: now,
  };

  try {
    await saveLocalRegistration(record);
  } catch {
    return Response.json(
      { success: false, error: 'Data belum berhasil disimpan. Silakan coba kembali.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  idempotencyStore.set(idempotencyKey, { registrationId, createdAt: Date.now() });

  return Response.json(
    { success: true, persisted: true, registrationId },
    { status: 201, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function GET() {
  return Response.json(
    { error: 'Akses tidak diizinkan.' },
    { status: 403, headers: { 'Cache-Control': 'no-store' } },
  );
}
