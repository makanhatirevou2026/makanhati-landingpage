'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { MENU_ITEMS } from '@/data/menu';
import { trackMenuDaySelected } from '@/lib/analytics';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
const CATEGORIES = [
  { id: 'gurih', label: 'Si Paling Gurih' },
  { id: 'pedas', label: 'Si Paling Pedas' },
  { id: 'creamy', label: 'Si Paling Creamy' },
] as const;

export function MenuSection() {
  const [dayIndex, setDayIndex] = useState(0);
  const currentDay = DAYS[dayIndex];

  const entries = useMemo(
    () => CATEGORIES.map((category) => ({
      ...category,
      item: MENU_ITEMS.find((menu) => menu.day === currentDay && menu.categoryIds.includes(category.id as 'gurih' | 'pedas' | 'creamy')),
    })),
    [currentDay],
  );

  const changeDay = (direction: -1 | 1) => {
    const nextIndex = (dayIndex + direction + DAYS.length) % DAYS.length;
    setDayIndex(nextIndex);
    trackMenuDaySelected(DAYS[nextIndex]);
  };

  return (
    <section className="section menu-section" id="menu" aria-labelledby="menu-heading">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Pilihan Menu</p>
          <h2 id="menu-heading">Lagi pengen rasa <em>yang mana?</em></h2>
          <p>Tiga pilihan rasa untuk mood kamu. Kenali contoh menu harian kami.</p>
        </div>

        <div className="day-control" aria-label="Navigasi menu harian">
          <button type="button" aria-controls="menu-cards" aria-label="Hari sebelumnya" onClick={() => changeDay(-1)}>←</button>
          <div className="day-label">
            <p>Contoh Menu Harian</p>
            <h3 id="menu-day" aria-live="polite" aria-atomic="true">{currentDay}</h3>
          </div>
          <button type="button" aria-controls="menu-cards" aria-label="Hari berikutnya" onClick={() => changeDay(1)}>→</button>
        </div>

        <div className="menu-grid" id="menu-cards" aria-label={`Menu ${currentDay}`} aria-live="polite">
          {entries.map(({ id, label, item }) => (
            <div className="menu-column" data-category={id} key={`${currentDay}-${id}`}>
              <h3 className="menu-category">{label}</h3>
              {item ? (
                <article className="menu-card">
                  <Image
                    className="menu-photo"
                    src={item.image}
                    alt={item.imageAlt}
                    width={1122}
                    height={1402}
                    sizes="(max-width: 760px) 100vw, (max-width: 1100px) 31vw, 390px"
                  />
                  <div className="menu-body">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                </article>
              ) : (
                <p className="menu-body">Menu untuk hari ini akan segera diperbarui.</p>
              )}
            </div>
          ))}
        </div>
        <p className="menu-photo-note">Foto adalah ilustrasi menu yang dibuat dengan AI berdasarkan bahan setiap hidangan.</p>
        <div className="menu-bottom-line" aria-hidden="true" />
      </div>
    </section>
  );
}
