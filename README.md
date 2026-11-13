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

### Penyimpanan saat development

Saat `npm run dev`, data pendaftaran disimpan secara lokal ke `.local-data/registrations.json`. Folder `.local-data` masuk `.gitignore` karena berisi data pribadi.

Endpoint memakai validasi Zod, rate limiting, honeypot, dan idempotency key. Jangan mengandalkan file JSON lokal sebagai database produksi.

### Sebelum mengaktifkan form di production

Penyimpanan database permanen belum dihubungkan. Karena itu endpoint `/api/registrations` sengaja mengembalikan HTTP `503` pada environment production, alih-alih menampilkan pesan sukses palsu.

Sebelum form digunakan pengunjung, hubungkan route tersebut ke database permanen (misalnya Supabase/Postgres), siapkan kontrol akses untuk admin, serta tetapkan kebijakan retensi dan penghapusan data.

## SEO dan Web Crawling

- Metadata `title`, `description`, canonical, Open Graph, Twitter Card, dan robots dikelola dari `src/app/layout.tsx`.
- `src/app/robots.ts` mengizinkan crawling halaman publik dan memblokir `/api/` serta `/admin/`.
- `src/app/sitemap.ts` hanya mencantumkan halaman utama karena halaman legal saat ini memiliki metadata `noindex`.
- Konten utama landing page dirender melalui Server Components. Interaktivitas dibatasi pada navigasi mobile, form, menu harian, FAQ, dan CTA mobile.
- FAQ dilengkapi structured data JSON-LD `FAQPage`.
- Pastikan `NEXT_PUBLIC_APP_URL` mengarah ke domain kanonis yang benar sebelum production.

## Deployment ke Netlify

Jangan deploy dengan mengunggah folder HTML export atau folder `.next` secara manual jika website memerlukan API route. Hubungkan repository Next.js ke Netlify dan gunakan build/runtime Next.js agar App Router serta endpoint API berjalan sebagai aplikasi Next.js.

Form produksi belum aktif sampai database permanen dihubungkan.

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
