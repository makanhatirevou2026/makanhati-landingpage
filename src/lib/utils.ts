// ─── Class Name Utility ───────────────────────────────────────────────────────

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

export function generateRequestId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MH-${timestamp}${random}`;
}

// ─── Idempotency Key ──────────────────────────────────────────────────────────

export function generateIdempotencyKey(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  }
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Scroll Utility ───────────────────────────────────────────────────────────

export function smoothScrollTo(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─── UTM Capture ─────────────────────────────────────────────────────────────

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export function captureUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
    utmContent: params.get('utm_content') ?? undefined,
    utmTerm: params.get('utm_term') ?? undefined,
  };
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/** Returns the minimum selectable start date (today in YYYY-MM-DD) */
export function getMinStartDate(): string {
  return new Date().toISOString().split('T')[0];
}

/** Returns 1 month from now as max start date suggestion */
export function getMaxStartDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  return d.toISOString().split('T')[0];
}

// ─── Input Sanitization ───────────────────────────────────────────────────────

/** Strip HTML tags and control characters from user input */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
}

// ─── WhatsApp URL Builder ─────────────────────────────────────────────────────

export function buildWhatsAppUrl(message?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '628000000000';
  const defaultMsg =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Halo+MakanHati%2C+saya+ingin+menanyakan+tentang+layanan+catering.';
  const msg = message ? encodeURIComponent(message) : defaultMsg;
  return `https://wa.me/${number}?text=${msg}`;
}
