'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registrationFormSchema } from '@/lib/validation';
import { generateIdempotencyKey } from '@/lib/utils';
import { trackRegistrationFormStart, trackRegistrationFormView, trackGenerateLead } from '@/lib/analytics';

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function SignupForm() {
  const formId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const hasStarted = useRef(false);
  const idempotencyKey = useRef('');
  const submittingRef = useRef(false);
  const leadIdRef = useRef('');
  const thankYouDialogRef = useRef<HTMLDialogElement>(null);
  const successSummaryRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [registrationId, setRegistrationId] = useState('');

  useEffect(() => {
    if (status !== 'success') return;
    const dialog = thankYouDialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [status]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    mode: 'onBlur',
    defaultValues: {
      customerName: '',
      instagramUsername: '',
      consent: false,
      website: '',
    },
  });

  useEffect(() => {
    idempotencyKey.current = generateIdempotencyKey();
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        trackRegistrationFormView();
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleFirstInteraction = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackRegistrationFormStart(formId);
  };

  const onSubmit = async (values: RegistrationFormValues) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setStatus('submitting');
    setStatusMessage('');

    if (!idempotencyKey.current) idempotencyKey.current = generateIdempotencyKey();

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey.current,
        },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(30000),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true || result?.persisted !== true || result?.storage !== 'google-sheets' ||
          typeof result?.registrationId !== 'string' || !/^[0-9a-f-]{36}$/.test(result.registrationId)) {
        throw new Error(result?.error || 'Pendaftaran belum berhasil disimpan. Silakan coba kembali.');
      }

      setRegistrationId(result.registrationId);
      setStatus('success');
      if (leadIdRef.current !== result.registrationId) {
        leadIdRef.current = result.registrationId;
        try { trackGenerateLead('waitlist'); } catch { /* Analytics cannot undo a saved registration. */ }
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Terjadi kendala. Silakan coba kembali.');
    } finally {
      submittingRef.current = false;
    }
  };

  const registerAnother = () => {
    thankYouDialogRef.current?.close();
    reset();
    setStatus('idle');
    setStatusMessage('');
    setRegistrationId('');
    hasStarted.current = false;
    idempotencyKey.current = generateIdempotencyKey();
  };

  return (
    <>
    <section className="signup-section" id="pesan" ref={sectionRef} aria-labelledby="signup-heading">
      <div className="container">
        <div className="signup-shell">
          <div className="signup-invitation">
            <div className="signup-top">
              <div>
                <h2 id="signup-heading">Siap Makan <em>Enak</em> Setiap Hari?</h2>
              </div>
              <p>Daftar sekarang dan nikmati harga spesial saat MakanHati hadir di Kuningan!</p>
            </div>
            <div className="signup-doodle" aria-hidden="true">
              <svg viewBox="0 0 150 135" fill="none"><path d="M75 121C42 98 9 73 12 43 15 12 51 5 75 31c24-26 60-19 63 12 3 30-30 55-63 78Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" /><path d="M49 49c-8 1-13 7-13 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
              <svg viewBox="0 0 180 90" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M4 62c36-58 73 5 49 13-22 8-26-24-4-39 34-24 61 29 120-17M143 12l28 5-8 27" /></svg>
            </div>
          </div>

          <div className="signup-card">
            {status === 'success' ? (
              <div className="signup-success" role="status" tabIndex={-1} ref={successSummaryRef}>
                <div>
                  <h3>Pendaftaran kamu diterima!</h3>
                  <p>Data pendaftaran berhasil disimpan. Pendaftaran ini belum merupakan pemesanan makanan; pilihan paket akan dibahas saat tim MakanHati menghubungi kamu.</p>
                  <small id="registration-id">ID pendaftaran: {registrationId}</small>
                </div>
                <button className="btn btn-outline" type="button" onClick={registerAnother}>Daftarkan nama lain</button>
              </div>
            ) : (
              <form
                id="signup-form"
                aria-label="Form pendaftaran MakanHati"
                noValidate
                onSubmit={(event) => { void handleSubmit(onSubmit)(event); }}
                onFocusCapture={handleFirstInteraction}
                onChangeCapture={handleFirstInteraction}
                aria-busy={status === 'submitting'}
              >
                <div className="signup-fields">
                  <div className="field">
                    <label htmlFor="customerName">Nama lengkap</label>
                    <input
                      id="customerName"
                      autoComplete="name"
                      placeholder="Nama lengkapmu"
                      maxLength={100}
                      disabled={status === 'submitting'}
                      aria-invalid={Boolean(errors.customerName)}
                      aria-describedby="name-error"
                      {...register('customerName')}
                    />
                    <p className="field-error" id="name-error">{errors.customerName?.message ?? ''}</p>
                  </div>
                  <div className="field">
                    <label htmlFor="instagramUsername">Username Instagram</label>
                    <input
                      id="instagramUsername"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="@usernamekamu"
                      maxLength={31}
                      disabled={status === 'submitting'}
                      aria-invalid={Boolean(errors.instagramUsername)}
                      aria-describedby="instagram-error"
                      {...register('instagramUsername')}
                    />
                    <p className="field-error" id="instagram-error">{errors.instagramUsername?.message ?? ''}</p>
                  </div>
                </div>

                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
                </div>

                <div className="signup-bottom">
                  <div>
                    <label className="consent" htmlFor="consent">
                      <input id="consent" type="checkbox" disabled={status === 'submitting'} aria-invalid={Boolean(errors.consent)} aria-describedby="consent-error" {...register('consent')} />
                      <span>Dengan mencentang kotak ini, kamu menyetujui <a href="/kebijakan-privasi" target="_blank" rel="noopener noreferrer">Kebijakan Privasi</a> dan penggunaan nama serta username Instagram kamu untuk proses pendaftaran.</span>
                    </label>
                    <p className="field-error" id="consent-error">{errors.consent?.message ?? ''}</p>
                  </div>
                </div>

                <p className="registration-note">Pendaftaran ini bukan pemesanan makanan. Pilihan paket akan dibahas saat kamu dihubungi untuk konfirmasi.</p>
                <button className="btn" type="submit" id="signup-submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Menyimpan…' : 'Daftar Sekarang'}
                  <svg className="cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
                </button>
                {status === 'error' && <p className="form-status error" role="alert">{statusMessage}</p>}
                <noscript><p className="form-status">Aktifkan JavaScript untuk mengirim form pendaftaran.</p></noscript>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
    <dialog
      ref={thankYouDialogRef}
      className="registration-dialog"
      aria-labelledby="registration-thank-you-title"
      aria-describedby="registration-thank-you-description"
      onClose={() => {
        document.documentElement.style.overflow = '';
        successSummaryRef.current?.focus();
      }}
    >
      <div className="registration-dialog-heart" aria-hidden="true">
        <svg viewBox="0 0 100 90" fill="none"><path d="M50 79C28 64 7 48 9 28 11 8 34 4 50 21 66 4 89 8 91 28c2 20-19 36-41 51Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" /></svg>
      </div>
      <p className="registration-dialog-kicker">MakanHati · Pendaftaran</p>
      <h2 id="registration-thank-you-title">Terima <em>kasih!</em></h2>
      <p id="registration-thank-you-description">Pendaftaran kamu sudah kami terima dan datanya berhasil disimpan.</p>
      <p className="registration-dialog-note">Pendaftaran ini bukan pemesanan makanan. Pilihan paket akan dibahas saat tim MakanHati menghubungi kamu.</p>
      <small>ID pendaftaran: {registrationId}</small>
      <button className="btn" type="button" autoFocus onClick={() => thankYouDialogRef.current?.close()}>Tutup</button>
    </dialog>
    </>
  );
}
