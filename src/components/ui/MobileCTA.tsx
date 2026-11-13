'use client';

import { useCallback, useEffect, useState } from 'react';
import { trackHeroCtaClick } from '@/lib/analytics';

export function MobileCTA() {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      const hero = document.getElementById('hero');
      const form = document.getElementById('pesan');
      const footer = document.querySelector('.site-footer');
      if (!hero || !form || !footer || !window.matchMedia('(max-width: 760px)').matches) {
        setIsHidden(true);
        return;
      }

      const heroBox = hero.getBoundingClientRect();
      const formBox = form.getBoundingClientRect();
      const footerBox = footer.getBoundingClientRect();
      const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
      const heroVisible = heroBox.top < window.innerHeight && heroBox.bottom > headerBottom;
      const formVisible = formBox.top < window.innerHeight && formBox.bottom > 0;
      const footerVisible = footerBox.top < window.innerHeight && footerBox.bottom > 0;
      const formFocused = form.contains(document.activeElement);

      setIsHidden(heroVisible || formVisible || footerVisible || formFocused);
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });
    document.addEventListener('focusin', updateVisibility);
    document.addEventListener('focusout', updateVisibility);
    updateVisibility();

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      document.removeEventListener('focusin', updateVisibility);
      document.removeEventListener('focusout', updateVisibility);
    };
  }, []);

  const handleClick = useCallback(() => {
    trackHeroCtaClick();
    document.getElementById('pesan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className={`mobile-sticky${isHidden ? ' is-hidden' : ''}`} id="mobile-sticky">
      <a className="btn btn-primary" href="#pesan" onClick={handleClick}>
        Daftar Sekarang
        <svg className="cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
      </a>
    </div>
  );
}
