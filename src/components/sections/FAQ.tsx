'use client';

import { FAQ_ITEMS } from '@/data/faq';
import { trackFaqExpand } from '@/lib/analytics';

export function FAQ() {
  const activeItems = FAQ_ITEMS.filter((item) => item.active).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="section" id="faq" aria-labelledby="faq-heading">
      <div className="container faq-layout">
        <div className="faq-intro">
          <p className="eyebrow">FAQ MakanHati</p>
          <h2 id="faq-heading">FAQ <em>MakanHati</em></h2>
          <span className="faq-doodle" aria-hidden="true">
            <svg viewBox="0 0 150 135" fill="none"><path d="M75 121C42 98 9 73 12 43 15 12 51 5 75 31c24-26 60-19 63 12 3 30-30 55-63 78Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" /><path d="M49 49c-8 1-13 7-13 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
            <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3"><path d="M25 2c0 16-7 23-23 23 16 0 23 7 23 23 0-16 7-23 23-23C32 25 25 18 25 2Z" /></svg>
          </span>
          <p className="faq-contact">
            Hubungi kami melalui <a href="mailto:info.makanhati@gmail.com">email</a> atau{' '}
            <a href="https://www.instagram.com/makanhati.catering/" target="_blank" rel="noopener noreferrer">Instagram</a>.
          </p>
        </div>

        <div className="faq-list">
          {activeItems.map((item) => (
            <details key={item.id} onToggle={(event) => {
              if (event.currentTarget.open) trackFaqExpand(item.id);
            }}>
              <summary>{item.question}</summary>
              <div className="faq-answer">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
