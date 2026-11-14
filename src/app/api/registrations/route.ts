import { registrationApiSchema } from '@/lib/validation';
import { createRegistrationHandler } from '@/server/registrations.mjs';

export const maxDuration = 30;

export const POST = createRegistrationHandler({
  parseRegistration: (body: unknown) => registrationApiSchema.safeParse(body),
  getConfig: () => ({ endpoint: process.env.APPS_SCRIPT_URL, secret: process.env.REGISTRATION_SECRET }),
});

export function GET() {
  return Response.json({ success: false, persisted: false, error: 'Gunakan POST untuk pendaftaran.' }, {
    status: 405,
    headers: { Allow: 'POST', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}
