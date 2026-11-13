'use client';

import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertCircle, Package, MapPin, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  InputField,
  SelectField,
  TextareaField,
  CheckboxField,
} from '@/components/ui/FormField';
import { orderFormSchema, type OrderFormSchema } from '@/lib/validation';
import {
  PACKAGES,
  MEAL_SCHEDULE_LABELS,
  PACKAGE_LABELS,
  formatPrice,
  getPackageVariantPrice,
} from '@/data/packages';
import { SERVICE_AREAS } from '@/data/serviceAreas';
import {
  trackFormView,
  trackFormStart,
  trackPackageSelected,
  trackGenerateLead,
} from '@/lib/analytics';
import { generateIdempotencyKey, captureUtmParams } from '@/lib/utils';
import type { PrefillData } from '@/types';

interface OrderFormProps {
  prefill?: PrefillData;
  onPrefillConsumed?: () => void;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const STEPS = [
  { number: '01', label: 'Pilih paket sesuai kebutuhan' },
  { number: '02', label: 'Isi detail pemesanan' },
  { number: '03', label: 'Tim MakanHati menghubungi kamu' },
];

export function OrderForm({ prefill, onPrefillConsumed }: OrderFormProps) {
  const formId = useId();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestId, setRequestId] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  const idempotencyKey = useRef<string>('');
  const sectionRef = useRef<HTMLElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormSchema>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onBlur',
    defaultValues: {
      customerName: '',
      instagramUsername: '',
      whatsapp: '',
      packageId: prefill?.packageId,
      mealSchedule: prefill?.mealSchedule,
      startDate: '',
      areaId: '',
      address: '',
      preference: 'fleksibel',
      allergyNote: '',
      consent: false,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedPackageId = watch('packageId');
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedMealSchedule = watch('mealSchedule');

  // Client-side only initialization — avoid prerender issues with crypto and Date
  useEffect(() => {
    idempotencyKey.current = generateIdempotencyKey();
    const today = new Date();
    setMinDate(today.toISOString().split('T')[0]);
    const maxD = new Date();
    maxD.setMonth(maxD.getMonth() + 2);
    setMaxDate(maxD.toISOString().split('T')[0]);
  }, []);

  // Apply prefill from pricing section
  useEffect(() => {
    if (prefill?.packageId) {
      setValue('packageId', prefill.packageId, { shouldValidate: false });
    }
    if (prefill?.mealSchedule) {
      setValue('mealSchedule', prefill.mealSchedule, { shouldValidate: false });
    }
    onPrefillConsumed?.();
  }, [prefill, setValue, onPrefillConsumed]);

  // Track form view with IntersectionObserver
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          trackFormView();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFirstInteraction = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      trackFormStart(formId);
    }
  }, [hasStarted, formId]);

  // Computed selected package variant
  const getSelectedVariant = useCallback(() => {
    if (!watchedPackageId || !watchedMealSchedule) return null;
    const pkg = PACKAGES.find((p) => p.id === watchedPackageId);
    if (!pkg) return null;
    const variant = pkg.variants.find((v) => v.mealSchedule === watchedMealSchedule);
    return variant ? { pkg, variant } : null;
  }, [watchedPackageId, watchedMealSchedule]);

  const currentSelection = getSelectedVariant();

  const onSubmit = async (data: OrderFormSchema) => {
    setStatus('submitting');
    setErrorMessage('');

    const utmParams = captureUtmParams();

    try {
      const res = await fetch('/api/order-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          idempotencyKey: idempotencyKey.current,
          utmSource: utmParams.utmSource,
          utmMedium: utmParams.utmMedium,
          utmCampaign: utmParams.utmCampaign,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setStatus('error');
        setErrorMessage(
          result.error ??
            'Permintaan belum berhasil dikirim. Silakan coba kembali. Data yang sudah kamu isi tetap tersimpan.',
        );
        return;
      }

      setRequestId(result.requestId);
      setStatus('success');

      // Fire generate_lead ONLY after confirmed persistence
      trackGenerateLead(data.packageId, utmParams.utmCampaign);
    } catch {
      setStatus('error');
      setErrorMessage(
        'Koneksi bermasalah. Data yang sudah kamu isi tetap tersimpan. Silakan coba kembali.',
      );
    }
  };

  const handleRetry = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
    // New idempotency key ensures no duplicate record on retry
    idempotencyKey.current = generateIdempotencyKey();
  }, []);

  const areaOptions = SERVICE_AREAS.map((a) => ({
    value: a.id,
    label:
      a.eligible === false
        ? `${a.name} ⚠️`
        : a.coverageTier === 'secondary'
          ? `${a.name} (konfirmasi dulu)`
          : a.name,
  }));

  // ─── Success State ───────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <section
        id="pesan"
        ref={sectionRef}
        aria-labelledby="form-success-heading"
        className="scroll-mt-20 bg-gradient-to-br from-[#F9F3EE] to-white py-16 md:py-20"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EDE0D4]">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
            </div>
            <h2
              id="form-success-heading"
              className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3"
            >
              Permintaan Pesanan Berhasil Dikirim!
            </h2>
            {requestId && (
              <p className="text-sm text-[#9C8A80] mb-4">
                ID Permintaan:{' '}
                <strong className="text-[#4A3728]">{requestId}</strong>
              </p>
            )}
            <p className="text-[#6B5C52] leading-relaxed mb-8">
              Tim MakanHati akan menghubungi kamu melalui WhatsApp untuk
              mengonfirmasi detail pesanan, ketersediaan layanan, dan
              pembayaran.
            </p>
            <div className="bg-[#F9F3EE] rounded-2xl p-4 text-sm text-[#6B5C52] text-left">
              <strong className="text-[#4A3728]">Langkah selanjutnya:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Pantau pesan WhatsApp dari tim MakanHati</li>
                <li>Tim akan memvalidasi area dan ketersediaan layanan</li>
                <li>Konfirmasi detail dan lakukan pembayaran manual</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Form ────────────────────────────────────────────────────────────────────
  return (
    <section
      id="pesan"
      ref={sectionRef}
      aria-labelledby="form-section-heading"
      className="scroll-mt-20 bg-gradient-to-br from-[#F9F3EE] to-white py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: Value Reassurance */}
          <div className="flex flex-col gap-8">
            <div>
              <h2
                id="form-section-heading"
                className="text-3xl md:text-4xl font-bold text-[#2D1810] leading-tight"
              >
                Siap Makan Enak{' '}
                <span className="text-[#8B1A2B]">Setiap Hari?</span>
              </h2>
              <p className="mt-3 text-lg text-[#6B5C52] leading-relaxed">
                Pilih paket, isi detail pengiriman, dan tim MakanHati akan
                menghubungi kamu untuk mengonfirmasi pesanan.
              </p>
            </div>

            {/* 3-Step Summary */}
            <div className="flex flex-col gap-4">
              {STEPS.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#8B1A2B] text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {step.number}
                  </div>
                  <p className="text-[#4A3728] font-medium pt-1.5">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Reassurance Notice */}
            <div className="bg-[#FFF8F0] border border-[#EDCFAB] rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5" aria-hidden="true">
                  ℹ️
                </span>
                <p className="text-sm text-[#6B5C52] leading-relaxed">
                  <strong className="text-[#4A3728]">
                    Pengisian form ini belum berarti pesanan otomatis
                    dikonfirmasi atau dibayar.
                  </strong>{' '}
                  Tim MakanHati akan melakukan validasi area, ketersediaan
                  layanan, dan detail pesanan terlebih dahulu sebelum
                  konfirmasi.
                </p>
              </div>
            </div>

            {/* Selected Package Summary */}
            {currentSelection && (
              <div
                className="bg-white border-2 border-[#8B1A2B] rounded-2xl p-5"
                aria-live="polite"
                aria-label="Paket yang dipilih"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Package
                    className="w-4 h-4 text-[#8B1A2B]"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-[#8B1A2B]">
                    Paket Dipilih
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-[#2D1810] text-lg">
                      {PACKAGE_LABELS[currentSelection.pkg.id]}
                    </div>
                    <div className="text-sm text-[#6B5C52]">
                      {MEAL_SCHEDULE_LABELS[currentSelection.variant.mealSchedule]}{' '}
                      • {currentSelection.variant.portions} porsi •{' '}
                      {currentSelection.pkg.durationLabel}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#8B1A2B] text-xl">
                      {formatPrice(currentSelection.variant.price)}
                    </div>
                    <div className="text-xs text-[#9C8A80]">
                      belum termasuk ongkir
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Form Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#EDE0D4] overflow-hidden">
            <div className="bg-[#8B1A2B] px-6 py-5">
              <h3 className="text-xl font-bold text-white">
                Pesan Catering MakanHati
              </h3>
              <p className="text-sm text-white/80 mt-1">
                Isi form di bawah — gratis, tanpa daftar akun
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              onFocus={handleFirstInteraction}
              noValidate
              aria-label="Form permintaan pesanan catering"
              className="px-6 py-6 flex flex-col gap-5"
            >
              {/* Error Banner */}
              {status === 'error' && errorMessage && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle
                    className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="mt-1.5 text-sm font-semibold text-red-700 underline hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                    >
                      Coba lagi
                    </button>
                  </div>
                </div>
              )}

              {/* Section: Identitas */}
              <fieldset className="flex flex-col gap-4 border-0 p-0 m-0">
                <legend className="text-xs font-bold text-[#9C8A80] uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span className="text-base" aria-hidden="true">
                    👤
                  </span>
                  Identitas
                </legend>

                <InputField
                  id="customerName"
                  label="Nama Lengkap"
                  required
                  placeholder="Contoh: Budi Santoso"
                  error={errors.customerName?.message}
                  {...register('customerName')}
                />

                <InputField
                  id="instagramUsername"
                  label="Username Instagram"
                  required
                  placeholder="@namainstagrammu"
                  hint="Format: @username — contoh: @makanhati.catering"
                  error={errors.instagramUsername?.message}
                  {...register('instagramUsername')}
                />

                <InputField
                  id="whatsapp"
                  label="Nomor WhatsApp"
                  required
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  hint="Tim kami akan menghubungi di nomor ini"
                  error={errors.whatsapp?.message}
                  {...register('whatsapp')}
                />
              </fieldset>

              <hr className="border-[#EDE0D4]" />

              {/* Section: Detail Pesanan */}
              <fieldset className="flex flex-col gap-4 border-0 p-0 m-0">
                <legend className="text-xs font-bold text-[#9C8A80] uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Package className="w-4 h-4" aria-hidden="true" />
                  Detail Pesanan
                </legend>

                <Controller
                  name="packageId"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      id="packageId"
                      label="Paket Catering"
                      required
                      placeholder="-- Pilih Paket --"
                      error={errors.packageId?.message}
                      options={PACKAGES.map((p) => ({
                        value: p.id,
                        label: `${p.name} (${p.durationLabel})`,
                      }))}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value && watchedMealSchedule) {
                          trackPackageSelected(
                            e.target.value,
                            watchedMealSchedule,
                          );
                        }
                      }}
                    />
                  )}
                />

                <Controller
                  name="mealSchedule"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      id="mealSchedule"
                      label="Jadwal Makan"
                      required
                      placeholder="-- Pilih Jadwal --"
                      error={errors.mealSchedule?.message}
                      options={[
                        { value: 'siang', label: 'Makan Siang' },
                        { value: 'malam', label: 'Makan Malam' },
                        {
                          value: 'siang-malam',
                          label: 'Siang & Malam (2x/hari)',
                        },
                      ]}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e);
                        if (watchedPackageId && e.target.value) {
                          trackPackageSelected(
                            watchedPackageId,
                            e.target.value,
                          );
                        }
                      }}
                    />
                  )}
                />

                {/* Price indicator */}
                {watchedPackageId && watchedMealSchedule && (() => {
                  const price = getPackageVariantPrice(
                    watchedPackageId,
                    watchedMealSchedule,
                  );
                  return price ? (
                    <div
                      className="flex items-center justify-between bg-[#F9F3EE] rounded-xl px-4 py-3 text-sm"
                      aria-live="polite"
                    >
                      <span className="text-[#6B5C52]">
                        Estimasi harga paket:
                      </span>
                      <span className="font-bold text-[#8B1A2B]">
                        {formatPrice(price)}
                      </span>
                    </div>
                  ) : null;
                })()}

                <InputField
                  id="startDate"
                  label="Tanggal Mulai"
                  required
                  type="date"
                  min={minDate || undefined}
                  max={maxDate || undefined}
                  error={errors.startDate?.message}
                  {...register('startDate')}
                />
              </fieldset>

              <hr className="border-[#EDE0D4]" />

              {/* Section: Lokasi & Preferensi */}
              <fieldset className="flex flex-col gap-4 border-0 p-0 m-0">
                <legend className="text-xs font-bold text-[#9C8A80] uppercase tracking-widest mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  Lokasi &amp; Preferensi
                </legend>

                <Controller
                  name="areaId"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      id="areaId"
                      label="Area Pengiriman"
                      required
                      placeholder="-- Pilih Area --"
                      error={errors.areaId?.message}
                      options={areaOptions}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  )}
                />

                <TextareaField
                  id="address"
                  label="Alamat Lengkap"
                  required
                  placeholder="Nama jalan, nomor, RT/RW, kelurahan, kecamatan..."
                  hint="Semakin detail semakin baik untuk koordinasi pengiriman"
                  error={errors.address?.message}
                  {...register('address')}
                />

                <Controller
                  name="preference"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      id="preference"
                      label="Preferensi Rasa"
                      required
                      error={errors.preference?.message}
                      options={[
                        { value: 'pedas', label: '🌶️ Pedas' },
                        { value: 'manis-gurih', label: '🍯 Manis-Gurih' },
                        { value: 'creamy', label: '🥛 Creamy' },
                        {
                          value: 'fleksibel',
                          label: '✨ Fleksibel / Surprise Me',
                        },
                      ]}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  )}
                />

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#9C8A80]" aria-hidden="true" />
                    <span className="text-xs font-bold text-[#9C8A80] uppercase tracking-widest">
                      Catatan Alergi / Pantangan (Opsional)
                    </span>
                  </div>
                  <TextareaField
                    id="allergyNote"
                    label=""
                    placeholder="Contoh: alergi kacang, tidak makan seafood..."
                    hint="Tim MakanHati akan mempertimbangkan catatan ini — bukan jaminan bebas alergen"
                    error={errors.allergyNote?.message}
                    {...register('allergyNote')}
                  />
                </div>
              </fieldset>

              <hr className="border-[#EDE0D4]" />

              {/* Consent */}
              <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                  <CheckboxField
                    id="consent"
                    label={
                      <span>
                        Saya menyetujui{' '}
                        <a
                          href="/kebijakan-privasi"
                          className="text-[#8B1A2B] underline hover:text-[#6E1522] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1A2B] rounded"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Kebijakan Privasi
                        </a>{' '}
                        dan penggunaan data saya untuk proses permintaan
                        pemesanan ini.
                      </span>
                    }
                    error={errors.consent?.message}
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={status === 'submitting'}
                disabled={status === 'submitting'}
              >
                {status === 'submitting'
                  ? 'Mengirim Permintaan...'
                  : 'Kirim Permintaan Pesanan'}
              </Button>

              <p className="text-xs text-center text-[#9C8A80]">
                Pengiriman form ini tidak berarti pesanan otomatis disetujui
                atau dibayar. Admin MakanHati akan menghubungi kamu.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
