// ─── Package Types ────────────────────────────────────────────────────────────

export type MealSchedule = 'siang' | 'malam' | 'siang-malam';

export type PackageId = 'trial' | 'mingguan' | 'bulanan';

export interface PackageVariant {
  mealSchedule: MealSchedule;
  portions: number;
  price: number;
}

export interface Package {
  id: PackageId;
  name: string;
  durationDays: number;
  durationLabel: string;
  allowedMealSchedules: MealSchedule[];
  variants: PackageVariant[];
  badge?: string;
  active: boolean;
  updatedAt: string;
}

export interface WeekendAddon {
  id: 'weekend-addon';
  name: string;
  durationDays: number;
  durationLabel: string;
  variants: PackageVariant[];
  note: string;
  active: boolean;
}

// ─── Menu Types ───────────────────────────────────────────────────────────────

export type MoodCategory = 'gurih' | 'pedas' | 'manis-gurih' | 'creamy' | 'semua';

export interface MenuCategory {
  id: MoodCategory;
  name: string;
  slug: string;
  emoji: string;
  active: boolean;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  categoryIds: MoodCategory[];
  image: string;
  imageAlt: string;
  active: boolean;
  availabilityDate?: string;
  day?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
}

// ─── Service Area Types ───────────────────────────────────────────────────────

export type CoverageTier = 'primary' | 'secondary';

export interface ServiceArea {
  id: string;
  name: string;
  coverageTier: CoverageTier;
  eligible: boolean;
  deliveryFeePolicy: string;
}

// ─── Order Request Types ──────────────────────────────────────────────────────

export type OrderStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'payment_pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'unreachable'
  | 'out_of_coverage';

export type FoodPreference = 'pedas' | 'manis-gurih' | 'creamy' | 'fleksibel';

export interface OrderRequest {
  id: string;
  customerName: string;
  instagramUsername: string;
  whatsapp: string;
  email?: string;
  packageId: PackageId;
  mealSchedule: MealSchedule;
  startDate: string;
  areaId: string;
  address: string;
  preference: FoodPreference;
  allergyNote?: string;
  consentAt: string;
  consentVersion: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  status: OrderStatus;
  createdAt: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface OrderFormData {
  customerName: string;
  instagramUsername: string;
  whatsapp: string;
  packageId: PackageId;
  mealSchedule: MealSchedule;
  startDate: string;
  areaId: string;
  address: string;
  preference: FoodPreference;
  allergyNote?: string;
  consent: boolean;
}

export interface PrefillData {
  packageId?: PackageId;
  mealSchedule?: MealSchedule;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface OrderRequestResponse {
  success: true;
  requestId: string;
  message: string;
}

export interface OrderRequestError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export type OrderRequestResult = OrderRequestResponse | OrderRequestError;

// ─── FAQ Types ────────────────────────────────────────────────────────────────

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  sortOrder: number;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  event: string;
  params?: Record<string, string | number | boolean | undefined>;
}
