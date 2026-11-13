'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Kenapa MakanHati?', href: '#keunggulan' },
  { label: 'Paket', href: '#paket' },
  { label: 'FAQ', href: '#faq' },
];

function RegistrationLink({ onClick }: { onClick?: () => void }) {
  return (
    <a className="btn btn-primary" href="#pesan" onClick={onClick}>
      Daftar Sekarang
      <svg className="cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
    </a>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="MakanHati — halaman utama">
          <Image src="/assets/brand/makanhati-logo.webp" width={65} height={58} alt="" priority />
          <span>Makan<span className="brand-accent">Hati</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <RegistrationLink />
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          Menu <span aria-hidden="true">{isMenuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      <nav id="mobile-nav" className="container mobile-nav" aria-label="Navigasi mobile" hidden={!isMenuOpen}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>{link.label}</a>
        ))}
        <RegistrationLink onClick={() => setIsMenuOpen(false)} />
      </nav>
    </header>
  );
}
