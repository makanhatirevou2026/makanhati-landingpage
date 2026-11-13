import { CalendarDays, Clock3, House, Smile } from 'lucide-react';

const BENEFITS = [
  {
    icon: Smile,
    title: 'Mood-Based Preference',
    description: 'Gurih, pedas, atau creamy—pilih rasa yang sesuai dengan mood kamu.',
  },
  {
    icon: CalendarDays,
    title: 'Menu Variatif Setiap Hari',
    description: 'Menu yang berganti setiap hari, supaya waktu makan kamu tidak terasa itu-itu saja.',
  },
  {
    icon: Clock3,
    title: 'Praktis untuk Aktivitas Padat',
    description: 'Kamu fokus beraktivitas. Urusan memasak dan mengantar makanan, biar kami yang menangani.',
  },
  {
    icon: House,
    title: 'Home-style',
    description: 'Masakan rumahan yang familiar untuk menemani aktivitas kamu.',
  },
];

export function Benefits() {
  return (
    <section className="benefits" id="keunggulan" aria-labelledby="benefits-heading">
      <div className="container">
        <h2 id="benefits-heading">Kenapa <em>MakanHati?</em></h2>
        <div className="benefits-doodle" aria-hidden="true">
          <svg viewBox="0 0 150 135" fill="none"><path d="M75 121C42 98 9 73 12 43 15 12 51 5 75 31c24-26 60-19 63 12 3 30-30 55-63 78Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" /><path d="M49 49c-8 1-13 7-13 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
          <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3"><path d="M25 2c0 16-7 23-23 23 16 0 23 7 23 23 0-16 7-23 23-23C32 25 25 18 25 2Z" /></svg>
        </div>
        <div className="benefit-grid">
          {BENEFITS.map(({ icon: Icon, title, description }, index) => (
            <article className="benefit-item" key={title}>
              <span className="benefit-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="benefit-icon"><Icon className="section-icon" aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
