import { type NextRequest } from 'next/server';
import { orderRequestApiSchema } from '@/lib/validation';
import { getPackageVariantPrice } from '@/data/packages';
import { getAreaById } from '@/data/serviceAreas';
import { generateRequestId, sanitizeInput } from '@/lib/utils';

// In-memory idempotency store (use Redis or DB in production)
const idempotencyStore = new Map<string, { requestId: string; createdAt: number }>();
const IDEMPOTENCY_WINDOW_MS = (Number(process.env.IDEMPOTENCY_WINDOW) || 300) * 1000;

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = Number(process.env.ORDER_RATE_LIMIT) || 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // ─── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return Response.json(
      {
        success: false,
        error:
          'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.',
      },
      { status: 429 },
    );
  }

  // ─── Parse body ────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: 'Format permintaan tidak valid.' },
      { status: 400 },
    );
  }

  // ─── Validate ──────────────────────────────────────────────────────────────
  const parsed = orderRequestApiSchema.safeParse(body);
  if (!parsed.success) {
    // Extract field errors safely for Zod v4
    const fieldErrors: Record<string, string[]> = {};
    const issues = parsed.error.issues;
    for (const issue of issues) {
      const key = issue.path.join('.') || '_';
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return Response.json(
      {
        success: false,
        error: 'Data tidak valid. Periksa kembali isian form.',
        fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // ─── Idempotency ───────────────────────────────────────────────────────────
  if (data.idempotencyKey) {
    const existing = idempotencyStore.get(data.idempotencyKey);
    if (existing && Date.now() - existing.createdAt < IDEMPOTENCY_WINDOW_MS) {
      // Return same response — do not create duplicate
      return Response.json(
        {
          success: true,
          requestId: existing.requestId,
          message:
            'Permintaan pesanan kamu sudah diterima. Tim MakanHati akan segera menghubungi kamu.',
        },
        { status: 200 },
      );
    }
  }

  // ─── Server-side price validation ─────────────────────────────────────────
  // Never trust price from frontend — recalculate server-side
  const serverPrice = getPackageVariantPrice(data.packageId, data.mealSchedule);
  if (!serverPrice) {
    return Response.json(
      {
        success: false,
        error: 'Paket atau jadwal makan tidak valid. Silakan refresh dan coba lagi.',
      },
      { status: 422 },
    );
  }

  // ─── Service area check ───────────────────────────────────────────────────
  const area = getAreaById(data.areaId);
  // area.eligible = false means out of service area but we still accept the request
  // Admin will follow up with out_of_coverage status
  const orderStatus = area && !area.eligible ? 'out_of_coverage' : 'new';

  // ─── Sanitize inputs ──────────────────────────────────────────────────────
  const sanitized = {
    customerName: sanitizeInput(data.customerName),
    instagramUsername: sanitizeInput(data.instagramUsername),
    whatsapp: data.whatsapp.replace(/\s|-/g, ''),
    address: sanitizeInput(data.address),
    allergyNote: data.allergyNote ? sanitizeInput(data.allergyNote) : undefined,
  };

  // ─── Create request record ────────────────────────────────────────────────
  const requestId = generateRequestId();
  const now = new Date().toISOString();

  const orderRecord = {
    id: requestId,
    customerName: sanitized.customerName,
    instagramUsername: sanitized.instagramUsername,
    whatsapp: sanitized.whatsapp,
    packageId: data.packageId,
    mealSchedule: data.mealSchedule,
    serverCalculatedPrice: serverPrice,
    startDate: data.startDate,
    areaId: data.areaId,
    address: sanitized.address,
    preference: data.preference,
    allergyNote: sanitized.allergyNote,
    consentAt: now,
    consentVersion: '1.0',
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
    status: orderStatus,
    createdAt: now,
  };

  // ─── TODO: Persist to database ────────────────────────────────────────────
  // Replace this section with your DB integration:
  // e.g., await db.orderRequests.create({ data: orderRecord })
  // e.g., await supabase.from('order_requests').insert(orderRecord)
  // e.g., await prisma.orderRequest.create({ data: orderRecord })

  // For MVP demo: log to server console (no PII in production logs)
  if (process.env.NODE_ENV === 'development') {
    console.log('[OrderRequest] New request created:', {
      id: orderRecord.id,
      packageId: orderRecord.packageId,
      mealSchedule: orderRecord.mealSchedule,
      status: orderRecord.status,
      createdAt: orderRecord.createdAt,
      // NOTE: Do not log PII fields (customerName, whatsapp, etc.) in production
    });
  }

  // ─── TODO: Notify admin ───────────────────────────────────────────────────
  // Replace this section with your notification integration:
  // e.g., await sendEmail({ to: process.env.ADMIN_EMAIL, subject: 'New Order Request', ... })
  // e.g., await sendWhatsAppNotification(adminNumber, requestId)
  // e.g., await sendSlackWebhook(process.env.SLACK_WEBHOOK_URL, orderRecord.id)

  // ─── Store idempotency key ─────────────────────────────────────────────────
  if (data.idempotencyKey) {
    idempotencyStore.set(data.idempotencyKey, {
      requestId,
      createdAt: Date.now(),
    });
  }

  // ─── Respond ──────────────────────────────────────────────────────────────
  return Response.json(
    {
      success: true,
      requestId,
      message:
        'Permintaan pesanan kamu sudah diterima. Tim MakanHati akan menghubungi kamu melalui WhatsApp untuk konfirmasi.',
    },
    { status: 201 },
  );
}

// Only GET is allowed for authenticated admins — not exposed publicly
export async function GET() {
  return Response.json(
    { error: 'Akses tidak diizinkan.' },
    { status: 403 },
  );
}
