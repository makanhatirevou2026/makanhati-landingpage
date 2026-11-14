# MakanHati — Catering Harian Landing Page

Landing page responsif untuk layanan catering harian MakanHati. Project menggunakan **Next.js 16 App Router, TypeScript, Tailwind CSS v4, React Hook Form, Zod, dan Lucide React**.

## Cara Menjalankan

### 1. Install dependency

```bash
npm install
```

### 2. Siapkan environment lokal

```bash
cp .env.local.example .env.local
```

Sesuaikan `NEXT_PUBLIC_APP_URL` dan nomor WhatsApp jika digunakan. Jangan commit `.env.local` ke Git.

### 3. Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:3000`.

### 4. Periksa sebelum deploy

```bash
npm run lint
npm test
npm run build
```

## Tech Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + stylesheet desain landing page
- **Form:** React Hook Form + Zod v4
- **Icons:** Lucide React
- **Images:** Next.js Image dan aset lokal WebP

## Form Pendaftaran Pra-peluncuran

Form pada desain terbaru adalah form pendaftaran minat, bukan checkout atau pemesanan makanan. Data yang diminta hanya:

- Nama lengkap
- Username Instagram
- Persetujuan Kebijakan Privasi

Endpoint form: `POST /api/registrations`.

### Penyimpanan Google Sheets

Form mengirim ke API server Next.js, lalu server meneruskan data ke web app Google Apps Script. Nama, Instagram, persetujuan, waktu dan ID pendaftaran disimpan di Sheet privat milik MakanHati. Endpoint dan kunci hanya ada di server; browser tidak memanggil Apps Script secara langsung.

Atur `APPS_SCRIPT_URL` ke URL web app `/exec` dan `REGISTRATION_SECRET` ke kunci yang sama dengan Script Properties Apps Script. Jangan awali kedua variabel itu dengan `NEXT_PUBLIC_`, jangan commit nilai kuncinya, dan jangan unggah `.env.local`. UTM mentah, paket, harga, WhatsApp dan alamat tidak dikirim ke Sheet.

### Konfirmasi dan retry

Pop-up terima kasih hanya muncul setelah Apps Script mengonfirmasi `success:true`, `persisted:true`, storage Google Sheets, ID yang sesuai dan waktu penyimpanan. HTTP 200 berisi halaman login atau kegagalan penyimpanan tetap dianggap gagal. Isian dan idempotency key dipertahankan saat gagal agar retry tidak menambah baris ganda. ID stabil lintas instance server; Apps Script mengunci dan membaca ulang data sebelum sukses.

Validasi Zod, pemeriksaan origin, batas ukuran body, honeypot dan pembatas 5 percobaan/jam per IP per instance tetap tersedia. Pembatas lokal ini bukan pembatas terdistribusi; untuk trafik besar gunakan perlindungan terdistribusi/aturan platform yang sesuai. Konfigurasi hilang, token salah atau upstream tidak terkonfirmasi menghasilkan `persisted:false`; tidak ada fallback filesystem production. Retensi data, notifikasi admin dan pengukuran eksternal belum diaktifkan oleh integrasi ini.

## SEO dan Web Crawling

- Metadata `title`, `description`, canonical, Open Graph, Twitter Card, dan robots dikelola dari `src/app/layout.tsx`.
- Preview dan domain tes tetap noindex. Aktifkan `SEO_INDEXING_ENABLED=true` hanya pada production ketika domain utama siap. `VERCEL_ENV=preview` tetap dipaksa noindex.
- Saat indexing aktif, robots mengizinkan halaman publik dan memblokir API/admin serta legal draft; sitemap hanya mencantumkan halaman utama.
- Konten utama landing page dirender melalui Server Components. Interaktivitas dibatasi pada navigasi mobile, form, menu harian, FAQ, dan CTA mobile.
- FAQ dilengkapi structured data JSON-LD `FAQPage`.
- Pastikan `NEXT_PUBLIC_APP_URL` mengarah ke domain kanonis yang benar sebelum production.

## Deployment ke Vercel

Hubungkan repo tim `makanhatirevou2026/makanhati-landingpage`, branch production `master`, dengan Framework Preset **Next.js**. Root Directory kosong, build/install/output default Next.js. Set `NEXT_PUBLIC_APP_URL=https://makanhati.my.id`, `SEO_INDEXING_ENABLED=false`, `APPS_SCRIPT_URL` dan `REGISTRATION_SECRET` sebelum redeploy. Kunci harus sama persis dengan yang disimpan pada Apps Script.

Jangan mengunggah HTML statis atau folder `.next` secara manual karena form membutuhkan runtime API Next.js. Perubahan environment memerlukan deployment baru. Domain/DNS tidak berubah hanya karena canonical diatur.

## Struktur Project

```text
src/
├── app/
│   ├── api/
│   │   ├── order-requests/route.ts   # Endpoint order lama, dipertahankan
│   │   └── registrations/route.ts    # Endpoint form pendaftaran baru
│   ├── kebijakan-privasi/page.tsx
│   ├── syarat-layanan/page.tsx
│   ├── layout.tsx                   # Root layout + SEO metadata
│   ├── page.tsx                     # Landing page baru
│   ├── globals.css                  # Tailwind + design tokens global
│   ├── landing.css                  # CSS hasil migrasi desain Netlify
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── sections/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── SignupForm.tsx            # Form pendaftaran pra-peluncuran
│   │   ├── Benefits.tsx
│   │   ├── MenuSection.tsx           # Navigasi menu Senin–Jumat
│   │   ├── Pricing.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FAQ.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── FormField.tsx
│       ├── MobileCTA.tsx
│       └── WhatsAppButton.tsx
├── data/
│   ├── packages.ts                   # Source of truth harga paket
│   ├── menu.ts                       # 15 menu, 5 hari, 3 kategori rasa
│   ├── serviceAreas.ts
│   └── faq.ts
├── lib/
│   ├── analytics.ts
│   ├── utils.ts
│   └── validation.ts
└── types/index.ts

public/
├── assets/                           # Logo, hero, dan foto menu
├── fonts/                            # Font lokal desain baru
├── favicon.ico
└── site.webmanifest
```

## Catatan Pemeliharaan

- Harga paket utama bersumber dari `src/data/packages.ts`; endpoint order lama menghitung ulang harga dari file ini.
- Konten FAQ bersumber dari `src/data/faq.ts`.
- Menu harian bersumber dari `src/data/menu.ts`.
- `src/components/sections/OrderForm.tsx`, `Coverage.tsx`, dan endpoint `/api/order-requests` tetap dipertahankan dari project Kiro sebagai kode lama/fitur yang dapat digunakan kembali, tetapi tidak ditampilkan pada landing page hasil redesign saat ini.
