import { CalendarCheck, MessageCircle, CookingPot, Truck } from 'lucide-react';

const STEPS = [
  { icon: CalendarCheck, title: 'Berlangganan', description: 'Pilih paket, beri notes jika kamu punya alergi makanan, lalu lakukan pembayaran.' },
  { icon: MessageCircle, title: 'Pilih Rasa', description: 'Tim kami menghubungimu untuk menentukan pilihan rasa.' },
  { icon: CookingPot, title: 'Dimasak', description: 'Kami memasak menu harian dengan rasa yang sudah kamu pilih.' },
  { icon: Truck, title: 'Diantar', description: 'Kurir kami mengantarkan makanan ke alamatmu, siap untuk dinikmati.' },
];

export function HowItWorks() {
  return (
    <section className="section how-section" id="cara-kerja" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Cara Kerja</p>
          <h2 id="how-heading">Proses Catering <em>di MakanHati</em></h2>
          <p>Begini gambaran alur layanan saat MakanHati hadir di Kuningan.</p>
        </div>
        <div className="how-grid">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <article className="how-step" key={title}>
              <span className="step-logo"><Icon aria-hidden="true" /></span>
              <div className="step-number"><span>LANGKAH</span><strong>{String(index + 1).padStart(2, '0')}</strong></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
