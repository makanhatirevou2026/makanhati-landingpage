import { MoonStar, Sun, SunMoon } from 'lucide-react';
import {
  PACKAGES,
  WEEKEND_ADDON,
  formatPrice,
} from '@/data/packages';
import type { MealSchedule } from '@/types';

const MAIN_CARDS: {
  id: string;
  title: string;
  schedule: MealSchedule;
  description: string;
  icon: typeof Sun;
  featured?: boolean;
}[] = [
  {
    id: 'dual',
    title: 'Paket Sibuk Seharian',
    schedule: 'siang-malam',
    description: 'Dua kali sehari, untuk makan siang dan malam.',
    icon: SunMoon,
    featured: true,
  },
  {
    id: 'lunch',
    title: 'Paket Setengah Hari',
    schedule: 'siang',
    description: 'Biar kamu tidak perlu memikirkan menu makan siang.',
    icon: Sun,
  },
  {
    id: 'dinner',
    title: 'Paket Lembur',
    schedule: 'malam',
    description: 'Setelah seharian beraktivitas, waktunya menikmati makan malam.',
    icon: MoonStar,
  },
];

function PriceOption({ label, price, portions, bestValue = false }: {
  label: string;
  price: number;
  portions: number;
  bestValue?: boolean;
}) {
  return (
    <div className="price-option">
      <div>
        <span className={bestValue ? 'duration-label' : undefined}>
          {label}
          {bestValue && <span className="best-value">Best value</span>}
        </span>
        <strong>{formatPrice(price)}</strong>
      </div>
      <small>{portions}x makan</small>
    </div>
  );
}

function PackageCard({ card, index }: { card: (typeof MAIN_CARDS)[number]; index: number }) {
  const weeklyPackage = PACKAGES.find((item) => item.id === 'mingguan');
  const monthlyPackage = PACKAGES.find((item) => item.id === 'bulanan');
  const weekly = weeklyPackage?.variants.find((variant) => variant.mealSchedule === card.schedule);
  const monthly = monthlyPackage?.variants.find((variant) => variant.mealSchedule === card.schedule);
  const Icon = card.icon;

  if (!weekly || !monthly) return null;

  return (
    <article className={`price-card${card.featured ? ' featured' : ''}`}>
      <div className="price-ordinal">
        <Icon className="package-icon" aria-hidden="true" />
        <span>Paket {String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3>{card.title}</h3>
      <p className="package-nickname">{card.schedule === 'siang-malam' ? 'Siang & Malam' : card.schedule === 'siang' ? 'Siang saja' : 'Malam saja'}</p>
      <p className="price-description">{card.description}</p>
      <div className="price-options">
        <PriceOption label="Mingguan" price={weekly.price} portions={weekly.portions} />
        <PriceOption label="Bulanan" price={monthly.price} portions={monthly.portions} bestValue={card.featured} />
      </div>
      <a className={`btn ${card.featured ? 'btn-primary' : 'btn-outline'} choose-subscription`} href="#pesan">
        Daftar Sekarang
        <svg className="cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
      </a>
    </article>
  );
}

export function Pricing() {
  const trial = PACKAGES.find((item) => item.id === 'trial');
  const trialLunch = trial?.variants.find((variant) => variant.mealSchedule === 'siang');
  const trialDual = trial?.variants.find((variant) => variant.mealSchedule === 'siang-malam');
  const weekendSingle = WEEKEND_ADDON.variants.find((variant) => variant.mealSchedule === 'siang');
  const weekendDual = WEEKEND_ADDON.variants.find((variant) => variant.mealSchedule === 'siang-malam');

  return (
    <section className="section" id="paket" aria-labelledby="pricing-heading">
      <div className="container">
        <div className="pricing-heading">
          <div>
            <p className="eyebrow">Paket Langganan</p>
            <h2 id="pricing-heading">Kenali paket yang <em>cocok untuk kamu</em></h2>
            <p>Paket langganan mulai dari Rp175.000.</p>
          </div>
          <span className="schedule-note">Paket utama · Senin–Jumat</span>
        </div>

        <div className="pricing-grid">
          {MAIN_CARDS.map((card, index) => <PackageCard key={card.id} card={card} index={index} />)}
        </div>

        <div className="trial-addon-grid">
          <article className="compact-package">
            <div>
              <p className="eyebrow">Trial · 3 Hari</p>
              <h3>Paket Magang</h3>
              <p>Pilihan trial 3 hari untuk kamu yang ingin mencoba.</p>
            </div>
            <div className="compact-prices">
              {trialLunch && <><span>Siang atau malam · {trialLunch.portions}x</span><strong>{formatPrice(trialLunch.price)}</strong></>}
              {trialDual && <><span>Siang dan malam · {trialDual.portions}x</span><strong>{formatPrice(trialDual.price)}</strong></>}
              <a className="btn btn-outline" href="#pesan">Daftar Sekarang</a>
            </div>
          </article>

          <article className="compact-package">
            <div>
              <p className="eyebrow">Add-on Weekend</p>
              <h3>Paket Mager</h3>
              <p>Rencana makan enak di akhir pekan, tanpa perlu keluar rumah.</p>
            </div>
            <div className="compact-prices">
              {weekendSingle && <><span>Siang atau malam · {weekendSingle.portions}x</span><strong>{formatPrice(weekendSingle.price)}</strong></>}
              {weekendDual && <><span>Siang dan malam · {weekendDual.portions}x</span><strong>{formatPrice(weekendDual.price)}</strong></>}
              <p>Sabtu &amp; Minggu</p>
            </div>
          </article>
        </div>
        <p className="addon-note">{WEEKEND_ADDON.note}</p>
      </div>
    </section>
  );
}
