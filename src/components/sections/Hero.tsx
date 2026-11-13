'use client';

import { trackHeroCtaClick } from '@/lib/analytics';

export function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">MakanHati · Catering Harian</p>
          <h1 id="hero-heading">
            Your Food,
            <span className="hero-chosen">Chosen by <em>Mood</em></span>
          </h1>
          <p className="hero-description">
            Menu rumahan yang berganti setiap hari, dengan rasa <strong>gurih</strong>, <strong>pedas</strong>, atau <strong>creamy</strong> sesuai mood kamu.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#pesan" onClick={trackHeroCtaClick}>
              Daftar Sekarang
              <svg className="cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>

        <div
          className="hero-visual"
          role="img"
          aria-label="Ilustrasi showcase menu Ayam Teriyaki, Ayam Sambal Bawang, dan Creamy Garlic Chicken"
        >
          <div className="hero-food-frame" />
          <span className="hero-burst" aria-hidden="true">
            <svg viewBox="0 0 100 100" fill="currentColor"><path d="m50 0 9 29 25-17-14 28 30 10-30 9 14 29-25-18-9 30-9-30-26 18 15-29L0 50l30-10-15-28 26 17Z" /></svg>
          </span>
          <span className="hero-heart" aria-hidden="true">
            <svg viewBox="0 0 150 135" fill="none">
              <path d="M75 121C42 98 9 73 12 43 15 12 51 5 75 31c24-26 60-19 63 12 3 30-30 55-63 78Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
              <path d="M49 49c-8 1-13 7-13 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
          <div className="hero-flavors" aria-hidden="true">
            <span>Gurih</span><span>Pedas</span><span>Creamy</span>
          </div>
          <span className="hero-scribble" aria-hidden="true">
            <svg viewBox="0 0 180 90" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M4 62c36-58 73 5 49 13-22 8-26-24-4-39 34-24 61 29 120-17M143 12l28 5-8 27" />
            </svg>
          </span>
        </div>
      </div>

      <div className="launch-strip">
        <span className="launch-spark" aria-hidden="true"><svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3"><path d="M25 2c0 16-7 23-23 23 16 0 23 7 23 23 0-16 7-23 23-23C32 25 25 18 25 2Z" /></svg></span>
        <span>Segera Hadir di</span>
        <span className="launch-location">
          <svg className="location-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" />
          </svg>
          Kuningan
        </span>
        <span className="launch-spark" aria-hidden="true"><svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3"><path d="M25 2c0 16-7 23-23 23 16 0 23 7 23 23 0-16 7-23 23-23C32 25 25 18 25 2Z" /></svg></span>
      </div>
    </section>
  );
}
