import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | MakanHati',
  description: 'Kebijakan privasi layanan catering MakanHati.',
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      {/* Simple header */}
      <header className="bg-white border-b border-[#EDE0D4] px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1A2B] rounded"
          >
            <div className="w-8 h-8 bg-[#8B1A2B] rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#2D1810]">
              Makan<span className="text-[#8B1A2B]">Hati</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#EDE0D4]">
          <h1 className="text-3xl font-bold text-[#2D1810] mb-2">
            Kebijakan Privasi
          </h1>
          <p className="text-[#9C8A80] text-sm mb-8">
            Terakhir diperbarui: 14 November 2026
          </p>

          {/* TODO: Replace with actual privacy policy content approved by legal/operations */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <p className="text-amber-800 text-sm font-semibold mb-2">
              ⚠️ Halaman ini sedang dalam proses penyusunan
            </p>
            <p className="text-amber-700 text-sm">
              Kebijakan privasi lengkap sedang disiapkan dan akan dipublikasikan
              sebelum peluncuran resmi. Konten halaman ini perlu disetujui oleh
              tim hukum dan operasional MakanHati.
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-[#4A3728]">
            <h2 className="text-xl font-bold text-[#2D1810] mt-6 mb-3">
              Data yang Kami Kumpulkan
            </h2>
            <p>
              Saat kamu mengisi form pendaftaran pra-peluncuran, kami mengumpulkan
              nama lengkap dan username Instagram. Kami juga mencatat waktu
              pendaftaran, persetujuan privasi, dan ID pendaftaran.
            </p>

            <h2 className="text-xl font-bold text-[#2D1810] mt-6 mb-3">
              Penggunaan Data
            </h2>
            <p>
              Data yang kamu berikan digunakan untuk mencatat pendaftaran minat
              dan keperluan konfirmasi oleh tim MakanHati. Pengisian form ini
              belum merupakan pemesanan makanan atau pembayaran.
            </p>

            <h2 className="text-xl font-bold text-[#2D1810] mt-6 mb-3">
              Keamanan Data
            </h2>
            <p>
              Data pendaftaran disimpan di Google Sheets melalui Google Apps Script
              yang dikelola akun MakanHati. Spreadsheet tidak dibagikan ke publik.
              Akses ke data pribadi dibatasi kepada tim MakanHati yang berwenang.
            </p>

            <h2 className="text-xl font-bold text-[#2D1810] mt-6 mb-3">
              Hubungi Kami
            </h2>
            <p>
              Jika kamu memiliki pertanyaan tentang kebijakan privasi ini, silakan
              hubungi kami melalui Instagram{' '}
              <a
                href="https://www.instagram.com/makanhati.catering"
                className="text-[#8B1A2B] underline"
              >
                @makanhati.catering
              </a>
              .
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#EDE0D4]">
            <Link
              href="/"
              className="text-[#8B1A2B] font-semibold hover:text-[#6E1522] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1A2B] rounded"
            >
              ← Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
