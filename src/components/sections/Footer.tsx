
import Image from 'next/image';
import Link from 'next/link';

const SOCIAL_LINKS = [
  {
    name: '@makanhati.catering',
    label: 'Instagram MakanHati',
    href: 'https://www.instagram.com/makanhati.catering',
    icon: 'instagram',
  },
  {
    name: 'MakanHati',
    label: 'Facebook MakanHati',
    href: 'https://web.facebook.com/profile.php?id=61596128536440&rdid=vqlYlXfd0ND9UICH&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1MmbrL84dQ%2F%3F_rdc%3D1%26_rdr#',
    icon: 'facebook',
  },
  {
    name: 'MakanHati',
    label: 'LinkedIn MakanHati',
    href: 'https://www.linkedin.com/company/makanhati-catering/',
    icon: 'linkedin',
  },
];

function SocialIcon({ type }: { type: string }) {
  const commonProps = {
    className: 'social-icon',
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    focusable: false as const,
  };

  switch (type) {
    case 'instagram':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </svg>
      );

    case 'facebook':
      return (
        <svg {...commonProps}>
          <path d="M14 21v-8h3l.5-4H14V7c0-1.1.3-2 2-2h2V1.4A25 25 0 0 0 15.1 1C12.2 1 10 2.8 10 6.3V9H7v4h3v8" />
        </svg>
      );

    case 'linkedin':
      return (
        <svg {...commonProps}>
          <rect x="2.5" y="2.5" width="19" height="19" rx="2" />
          <path d="M7 10v7M7 7h.01M11 17v-7M11 13a3 3 0 0 1 6 0v4" />
        </svg>
      );

    default:
      return null;
  }
}

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Footer MakanHati">
      <div className="container">
        <div className="footer-bar">
          <Link
            href="/"
            className="footer-brand"
            aria-label="MakanHati — halaman utama"
          >
            <Image
              src="/assets/brand/makanhati-logo.webp"
              width={76}
              height={68}
              alt="MakanHati"
            />
          </Link>

          <nav className="social-links" aria-label="Media sosial MakanHati">
            {SOCIAL_LINKS.map(({ name, label, href, icon }) => (
              <a
                key={label}
                className="social-link"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <SocialIcon type={icon} />
                <span>{name}</span>
              </a>
            ))}
          </nav>

          <p className="footer-copyright">
            © {new Date().getFullYear()} MakanHati
          </p>
        </div>

        <div className="footer-meta">
          <div>
            <a href="mailto:info.makanhati@gmail.com">
              info.makanhati@gmail.com
            </a>
            <span className="footer-separator" aria-hidden="true">·</span>
            <span>Kuningan, Jakarta Selatan</span>
          </div>

          <div className="footer-legal">
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <Link href="/syarat-layanan">Syarat Layanan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
