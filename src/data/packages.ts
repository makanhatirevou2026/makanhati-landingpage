import type { Package, WeekendAddon } from '@/types';

// ─── Package Configuration ─────────────────────────────────────────────────
// Source of truth for all pricing. Server recalculates prices from this config.
// Do NOT trust price values from the frontend.

export const PACKAGES: Package[] = [
  {
    id: 'trial',
    name: 'Paket Magang',
    durationDays: 3,
    durationLabel: '3 hari kerja',
    allowedMealSchedules: ['siang', 'malam', 'siang-malam'],
    variants: [
      { mealSchedule: 'siang', portions: 3, price: 110000 },
      { mealSchedule: 'malam', portions: 3, price: 110000 },
      { mealSchedule: 'siang-malam', portions: 6, price: 220000 },
    ],
    active: true,
    updatedAt: '2026-11-12',
  },
  {
    id: 'mingguan',
    name: 'Mingguan',
    durationDays: 5,
    durationLabel: '5 hari kerja',
    allowedMealSchedules: ['siang', 'malam', 'siang-malam'],
    variants: [
      { mealSchedule: 'siang', portions: 5, price: 175000 },
      { mealSchedule: 'malam', portions: 5, price: 175000 },
      { mealSchedule: 'siang-malam', portions: 10, price: 350000 },
    ],
    badge: 'Paling Fleksibel',
    active: true,
    updatedAt: '2026-11-12',
  },
  {
    id: 'bulanan',
    name: 'Bulanan',
    durationDays: 20,
    durationLabel: '20 hari kerja',
    allowedMealSchedules: ['siang', 'malam', 'siang-malam'],
    variants: [
      { mealSchedule: 'siang', portions: 20, price: 660000 },
      { mealSchedule: 'malam', portions: 20, price: 660000 },
      { mealSchedule: 'siang-malam', portions: 40, price: 1280000 },
    ],
    active: true,
    updatedAt: '2026-11-12',
  },
];

export const WEEKEND_ADDON: WeekendAddon = {
  id: 'weekend-addon',
  name: 'Weekend Add-on',
  durationDays: 2,
  durationLabel: '2 hari (Sabtu & Minggu)',
  variants: [
    { mealSchedule: 'siang', portions: 2, price: 80000 },
    { mealSchedule: 'malam', portions: 2, price: 80000 },
    { mealSchedule: 'siang-malam', portions: 4, price: 160000 },
  ],
  note: 'Weekend add-on dipesan bersamaan dengan paket utama atau maksimal Jumat pukul 18.00 sebelum akhir pekan terkait. Hanya untuk pelanggan paket utama.',
  active: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPackageById(id: string): Package | undefined {
  return PACKAGES.find((p) => p.id === id && p.active);
}

export function getPackageVariantPrice(
  packageId: string,
  mealSchedule: string,
): number | null {
  const pkg = getPackageById(packageId);
  if (!pkg) return null;
  const variant = pkg.variants.find((v) => v.mealSchedule === mealSchedule);
  return variant?.price ?? null;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const MEAL_SCHEDULE_LABELS: Record<string, string> = {
  siang: 'Siang',
  malam: 'Malam',
  'siang-malam': 'Siang & Malam',
};

export const PACKAGE_LABELS: Record<string, string> = {
  trial: 'Paket Magang',
  mingguan: 'Mingguan',
  bulanan: 'Bulanan',
};
