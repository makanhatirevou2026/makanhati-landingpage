import './landing.css';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { SignupForm } from '@/components/sections/SignupForm';
import { Benefits } from '@/components/sections/Benefits';
import { MenuSection } from '@/components/sections/MenuSection';
import { Pricing } from '@/components/sections/Pricing';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FAQ } from '@/components/sections/FAQ';
import { Footer } from '@/components/sections/Footer';
import { MobileCTA } from '@/components/ui/MobileCTA';
import { FAQ_ITEMS } from '@/data/faq';

export default function HomePage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.filter((item) => item.active).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Langsung ke konten</a>
      <Header />
      <main id="main-content">
        <Hero />

        <section className="numbers-section" aria-label="MakanHati dalam angka">
          <div className="container">
            <dl className="numbers-strip">
              <div><dt>Pilihan menu setiap minggu</dt><dd>15</dd></div>
              <div><dt>Kategori rasa</dt><dd>3</dd></div>
              <div><dt>Langkah pemesanan</dt><dd>4</dd></div>
            </dl>
          </div>
        </section>

        <SignupForm />
        <Benefits />
        <MenuSection />
        <Pricing />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
      <MobileCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
