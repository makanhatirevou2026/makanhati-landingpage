import type { MetadataRoute } from 'next';
import { APP_URL, INDEXABLE } from '@/lib/site-config.mjs';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return [];
  const baseUrl = APP_URL;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
