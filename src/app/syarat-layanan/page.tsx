import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat Layanan | MakanHati',
  description: 'Syarat dan ketentuan layanan catering MakanHati.',
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F4]">
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
            Syarat Layanan
          </h1>
          <p className="text-[#9C8A80] text-sm mb-8">
            Terakhir diperbarui: 12 November 2026
          </p>

          {/* TODO: Replace with actual terms of service content */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <p className="text-amber-800 text-sm font-semibold mb-2">
              ⚠️ Halaman ini sedang dalam proses penyusunan
            </p>
            <p className="text-amber-700 text-sm">
              Syarat dan ketentuan layanan lengkap sedang disiapkan dan akan
              dipublikasikan sebelum peluncuran resmi. Konten halaman ini perlu
              disetujui oleh tim hukum dan operasional MakanHati.
            </p>
          </div>

          <div className="text-[#4A3728] space-y-4">
            <p>
              Dengan menggunakan layanan MakanHati, kamu setuju untuk terikat
              oleh syarat dan ketentuan berikut ini. Harap baca dengan seksama
              sebelum melakukan pemesanan.
            </p>
            <p>
              Pengisian form pemesanan tidak berarti pesanan otomatis
              dikonfirmasi. Konfirmasi final hanya diberikan oleh tim MakanHati
              setelah validasi area dan ketersediaan layanan.
            </p>
            <p>
              Pembayaran dilakukan secara manual setelah konfirmasi pesanan dari
              tim MakanHati. MakanHati bukan platform pembayaran online.
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
