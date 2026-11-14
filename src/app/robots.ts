import type { MetadataRoute } from 'next';
import { APP_URL, INDEXABLE } from '@/lib/site-config.mjs';

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } };
  const baseUrl = APP_URL;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/kebijakan-privasi', '/syarat-layanan'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
