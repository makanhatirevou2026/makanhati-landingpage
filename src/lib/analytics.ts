'use client';

// ─── Analytics Abstraction Layer ──────────────────────────────────────────────
// Push events to window.dataLayer for GA4/GTM integration.
// IMPORTANT: Never include PII (name, WhatsApp, Instagram, email, address) in any event.

declare global {
  interface Window {
    dataLayer?: object[];
    gtag?: (...args: unknown[]) => void;
  }
}

type SafeParams = Record<string, string | number | boolean | undefined>;

function pushEvent(event: string, params?: SafeParams): void {
  if (typeof window === 'undefined') return;

  // GTM dataLayer push
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });

  // Direct gtag support
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }

  // Development debug
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Analytics]', event, params);
  }
}

// ─── Typed Event Functions ────────────────────────────────────────────────────

/** Hero CTA button clicked */
export function trackHeroCtaClick(): void {
  pushEvent('hero_cta_click', { section: 'hero' });
}

/** Section 2 order form becomes visible in viewport */
export function trackFormView(): void {
  pushEvent('form_view', { section: 'order_form' });
}

/** User starts interacting with the order form */
export function trackFormStart(formId: string): void {
  pushEvent('form_start', { form_id: formId });
}

/** New pre-launch registration form becomes visible. */
export function trackRegistrationFormView(): void {
  pushEvent('form_view', { section: 'registration_form' });
}

/** User starts interacting with the pre-launch registration form. */
export function trackRegistrationFormStart(formId: string): void {
  pushEvent('form_start', { form_id: formId, form_type: 'registration' });
}

/** User selects a package (no PII) */
export function trackPackageSelected(
  packageType: string,
  mealSchedule: string,
): void {
  pushEvent('package_selected', {
    package_type: packageType,
    meal_schedule: mealSchedule,
  });
}

/** User selects a mood/food category */
export function trackMoodSelected(moodCategory: string): void {
  pushEvent('mood_selected', { mood_category: moodCategory });
}

/**
 * Lead generated — ONLY fire after confirmed server-side persistence.
 * No PII allowed. Called from the form component after a successful POST.
 */
export function trackGenerateLead(packageType: string, campaign?: string): void {
  pushEvent('generate_lead', {
    package_type: packageType,
    ...(campaign ? { campaign } : {}),
  });
}

/** WhatsApp button clicked */
export function trackWhatsappClick(sectionName: string): void {
  pushEvent('whatsapp_click', { section_name: sectionName });
}

/** FAQ item expanded */
export function trackFaqExpand(faqId: string): void {
  pushEvent('faq_expand', { faq_id: faqId });
}

/** User moves to another weekday in the sample menu carousel. */
export function trackMenuDaySelected(day: string): void {
  pushEvent('menu_day_selected', { day });
}
