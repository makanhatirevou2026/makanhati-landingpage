import * as z from 'zod';

// ─── Order Form Schema ─────────────────────────────────────────────────────────

export const orderFormSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .trim(),

  instagramUsername: z
    .string()
    .min(2, 'Username Instagram tidak valid')
    .max(50, 'Username Instagram terlalu panjang')
    .trim()
    .transform((val) => (val.startsWith('@') ? val : `@${val}`))
    .refine(
      (val) => /^@[a-zA-Z0-9._]{1,49}$/.test(val),
      'Format username Instagram tidak valid. Contoh: @makanhati.catering',
    ),

  whatsapp: z
    .string()
    .min(9, 'Nomor WhatsApp minimal 9 digit')
    .max(15, 'Nomor WhatsApp maksimal 15 digit')
    .trim()
    .refine(
      (val) => /^(\+62|62|0)[0-9]{8,13}$/.test(val.replace(/\s|-/g, '')),
      'Nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx atau +628xxxxxxxxxx',
    ),

  packageId: z.enum(['trial', 'mingguan', 'bulanan'], {
    error: 'Pilih paket terlebih dahulu',
  }),

  mealSchedule: z.enum(['siang', 'malam', 'siang-malam'], {
    error: 'Pilih jadwal makan terlebih dahulu',
  }),

  startDate: z
    .string()
    .min(1, 'Pilih tanggal mulai')
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, 'Tanggal mulai tidak boleh di masa lalu'),

  areaId: z
    .string()
    .min(1, 'Pilih area pengiriman'),

  address: z
    .string()
    .min(10, 'Alamat lengkap minimal 10 karakter')
    .max(500, 'Alamat terlalu panjang')
    .trim(),

  preference: z.enum(['pedas', 'manis-gurih', 'creamy', 'fleksibel'], {
    error: 'Pilih preferensi rasa',
  }),

  allergyNote: z
    .string()
    .max(300, 'Catatan alergi maksimal 300 karakter')
    .trim()
    .optional(),

  consent: z
    .boolean()
    .refine((v) => v === true, {
      message: 'Kamu harus menyetujui Kebijakan Privasi untuk melanjutkan',
    }),
});

export type OrderFormSchema = z.infer<typeof orderFormSchema>;

// ─── Server-side API validation schema ────────────────────────────────────────
// Stricter version without transform for server use

export const orderRequestApiSchema = z.object({
  customerName: z.string().min(2).max(100).trim(),
  instagramUsername: z.string().min(2).max(50).trim(),
  whatsapp: z.string().min(9).max(20).trim(),
  packageId: z.enum(['trial', 'mingguan', 'bulanan']),
  mealSchedule: z.enum(['siang', 'malam', 'siang-malam']),
  startDate: z.string().min(1),
  areaId: z.string().min(1),
  address: z.string().min(10).max(500).trim(),
  preference: z.enum(['pedas', 'manis-gurih', 'creamy', 'fleksibel']),
  allergyNote: z.string().max(300).trim().optional(),
  consent: z.boolean().refine((v) => v === true, 'Consent required'),
  idempotencyKey: z.string().min(1).max(64).optional(),
  // UTM params (stripped of PII risk)
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
});

export type OrderRequestApiSchema = z.infer<typeof orderRequestApiSchema>;

// ─── Pre-launch registration form schema ─────────────────────────────────────
export const registrationFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter.')
    .max(100, 'Nama lengkap maksimal 100 karakter.'),
  instagramUsername: z
    .string()
    .trim()
    .min(2, 'Username Instagram tidak valid.')
    .max(31, 'Username Instagram maksimal 30 karakter setelah @.')
    .refine(
      (value) => /^@?[a-zA-Z0-9._]{1,30}$/.test(value),
      'Gunakan format @username Instagram yang valid.',
    ),
  consent: z.boolean().refine((value) => value === true, {
    message: 'Setujui Kebijakan Privasi sebelum mendaftar.',
  }),
  website: z.string().max(200).optional(),
});

export const registrationApiSchema = registrationFormSchema.extend({
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
});

export type RegistrationFormSchema = z.infer<typeof registrationFormSchema>;
export type RegistrationApiSchema = z.infer<typeof registrationApiSchema>;
