# Pendaftaran Google Sheets — 14 November 2026

Source utama yang dipilih user: `makanhatirevou2026/makanhati-landingpage`, branch `master`. Vercel yang sudah terhubung dengan repo ini adalah project `makanhati/makanhati-landingpage` (alamat deployment default `makanhati-landingpage-zhld.vercel.app`). Project tes pribadi `tes-f93c/tewsww` bukan target integrasi ini.

## Alur dan konfigurasi

Browser mengirim Nama + Instagram + persetujuan ke `/api/registrations`. Server Next.js memvalidasi kiriman lalu memanggil Apps Script dengan kunci yang hanya disimpan pada server. Apps Script berjalan sebagai akun MakanHati, menulis ke Sheet privat, lalu membaca kembali barisnya sebelum mengonfirmasi sukses. Pop-up tidak muncul untuk response yang gagal/tidak terkonfirmasi.

Environment Vercel dan `.env.local` lokal:

| Nama | Nilai |
|---|---|
| `APPS_SCRIPT_URL` | URL web app Google Apps Script `/exec` yang aktif |
| `REGISTRATION_SECRET` | Sama dengan Script Properties Apps Script; rahasiakan dan jangan commit |
| `NEXT_PUBLIC_APP_URL` | `https://makanhati.my.id` |
| `SEO_INDEXING_ENABLED` | `false` pada preview/tes; aktifkan production hanya ketika domain/peluncuran siap |

Jangan beri prefix NEXT_PUBLIC pada endpoint/kunci penerima. Tidak ada OAuth token, password Google, kunci rahasia, atau data pendaftar yang disimpan di repo. Konfigurasi yang tidak lengkap menghasilkan kegagalan yang jujur, tanpa fallback ke filesystem Vercel.

ID penyimpanan diturunkan dari idempotency key menggunakan HMAC server dan stabil lintas instance. Retry memakai ID sama, sedangkan Apps Script mengunci perubahan dan mencegah penambahan baris yang sama. Jangan mengganti kunci saat masih ada kiriman yang akan dicoba ulang, karena penggantian kunci juga mengubah ID turunan.

## Verifikasi sebelum push

- 8 tes penerima Apps Script lokal dan 5 pemeriksaan endpoint Apps Script nyata lulus.
- 10 tes API repo tim lulus: konfirmasi penyimpanan, retry lintas instance, proxy/Host Next.js, response tidak pasti, HTML login, konflik ID, validasi/honeypot, origin/body limit, konfigurasi, dan pembatas percobaan.
- Build Next.js/TypeScript dan lint file yang diubah lulus. Audit paket production tidak menemukan kerentanan pada pemeriksaan ini.
- Form browser lokal benar-benar menambah record uji ke Sheet dan baru menampilkan pop-up setelah respons tersimpan.
- Isian tidak lengkap ditolak. Ketika server menolak kiriman, isian dipertahankan dan pop-up tidak tampil.
- Dialog memakai top layer native, fokus ke tombol Tutup, dapat ditutup dengan tombol/Escape, mengembalikan fokus ke konfirmasi form, dan memulihkan scroll.
- Pop-up diuji pada viewport 390×844: lebar sekitar 358 px, tetap berada dalam layar, tanpa overflow horizontal.
- Kelima hari menu mengubah nama/foto tiga menu dan kembali ke Senin; keenam FAQ terbuka/tertutup; empat CTA paket menuju form yang sama tanpa field paket.

Beberapa baris yang jelas bernama UJI ... bukan pendaftar adalah bukti tes integrasi, bukan pelanggan nyata. Jangan menganggapnya sebagai lead bisnis. Screenshot review dan konfigurasi lokal diabaikan Git.

## Batas operasional

Pembatas 5 percobaan/jam per IP masih berbasis instance, mengikuti fondasi project lama. Ini bukan rate limiter terdistribusi. Apps Script/Sheets memiliki kuota sendiri; untuk trafik besar perlu penilaian kapasitas dan perlindungan terdistribusi. Tidak ada notifikasi admin atau tracking eksternal baru yang diaktifkan. Kebijakan retensi, legal final, serta aktivasi indexing masih keputusan operasional terpisah.

Daftar harga, menu, CTA paket dan susunan landing page tidak dirombak. CSS existing dipertahankan; yang ditambahkan adalah gaya pop-up konfirmasi.
