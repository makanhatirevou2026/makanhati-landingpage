'use client';

import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/utils';
import { trackWhatsappClick } from '@/lib/analytics';

interface WhatsAppButtonProps {
  section?: string;
  className?: string;
}

export function WhatsAppFloatingButton({ section = 'floating', className }: WhatsAppButtonProps) {
  const href = buildWhatsAppUrl();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsappClick(section)}
      aria-label="Hubungi MakanHati via WhatsApp"
      className={`
        hidden md:flex
        fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full
        bg-[#25D366] text-white
        items-center justify-center
        shadow-lg hover:shadow-xl hover:scale-110
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2
        ${className ?? ''}
      `}
    >
      <MessageCircle className="w-7 h-7" aria-hidden="true" />
    </a>
  );
}
