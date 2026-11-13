import { MapPin, AlertCircle, MessageCircle } from 'lucide-react';
import { SERVICE_AREAS } from '@/data/serviceAreas';
import { buildWhatsAppUrl } from '@/lib/utils';

export function Coverage() {
  const primaryAreas = SERVICE_AREAS.filter(
    (a) => a.coverageTier === 'primary' && a.eligible,
  );
  const secondaryAreas = SERVICE_AREAS.filter(
    (a) => a.coverageTier === 'secondary' && a.eligible,
  );

  return (
    <section
      id="area-layanan"
      aria-labelledby="coverage-heading"
      className="scroll-mt-20 bg-white py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-[#8B1A2B] uppercase tracking-widest">
            Area Layanan
          </span>
          <h2
            id="coverage-heading"
            className="mt-2 text-3xl md:text-4xl font-bold text-[#2D1810]"
          >
            MakanHati Antar ke{' '}
            <span className="text-[#8B1A2B]">Area Mana?</span>
          </h2>
          <p className="mt-4 text-[#6B5C52] max-w-2xl mx-auto">
            Kami fokus melayani area Kuningan dan sekitar Jakarta Selatan.
            Ketersediaan layanan akan dikonfirmasi tim MakanHati sebelum
            pesanan disetujui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Area lists */}
          <div className="flex flex-col gap-6">
            {/* Primary */}
            <div className="bg-[#F9F3EE] rounded-2xl p-6 border border-[#EDE0D4]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#8B1A2B]" aria-hidden="true" />
                <h3 className="font-bold text-[#2D1810]">Area Utama</h3>
                <span className="text-xs bg-[#8B1A2B]/10 text-[#8B1A2B] font-semibold px-2 py-0.5 rounded-full">
                  Prioritas
                </span>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Area pengiriman utama">
                {primaryAreas.map((area) => (
                  <li
                    key={area.id}
                    className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl text-sm text-[#4A3728] border border-[#EDE0D4]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#8B1A2B]" aria-hidden="true" />
                    {area.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary */}
            <div className="bg-white rounded-2xl p-6 border border-[#EDE0D4]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#C9A84C]" aria-hidden="true" />
                <h3 className="font-bold text-[#2D1810]">Area Sekunder</h3>
                <span className="text-xs bg-[#C9A84C]/10 text-[#C9A84C] font-semibold px-2 py-0.5 rounded-full">
                  Konfirmasi dulu
                </span>
              </div>
              <ul className="flex flex-wrap gap-2 mb-3" aria-label="Area pengiriman sekunder">
                {secondaryAreas.map((area) => (
                  <li
                    key={area.id}
                    className="flex items-center gap-1.5 bg-[#FAF7F4] px-3 py-1.5 rounded-xl text-sm text-[#4A3728] border border-[#EDE0D4]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" aria-hidden="true" />
                    {area.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Info card */}
          <div className="flex flex-col gap-4">
            {/* Map placeholder */}
            <div className="relative bg-[#F5EDE6] rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-[#EDE0D4]">
              <div className="text-center p-8">
                <MapPin className="w-10 h-10 text-[#8B1A2B] mx-auto mb-3" aria-hidden="true" />
                <div className="font-bold text-[#2D1810] mb-1">Kuningan &amp; Sekitarnya</div>
                <div className="text-sm text-[#6B5C52]">Jakarta Selatan</div>
                <div className="mt-2 text-xs text-[#9C8A80]">
                  Radius utama sekitar Kuningan
                </div>
              </div>
            </div>

            {/* Important notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">
                    Penting untuk Diketahui
                  </p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Area pengiriman di atas bersifat indikatif. Ketersediaan layanan
                    tetap akan dikonfirmasi oleh tim MakanHati sebelum pesanan
                    disetujui. Tidak di area tersebut? Hubungi kami untuk memastikan.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp inquiry */}
            <a
              href={buildWhatsAppUrl('Halo MakanHati, saya ingin mengecek apakah area saya masuk dalam jangkauan pengiriman.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 px-6 rounded-2xl hover:bg-[#1EB656] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dataLayer = window.dataLayer ?? [];
                  window.dataLayer.push({ event: 'whatsapp_click', section_name: 'coverage' });
                }
              }}
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Tanya Area Pengiriman via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
