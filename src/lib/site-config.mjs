const configuredUrl = new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://makanhati.my.id');
if (configuredUrl.protocol !== 'https:' || configuredUrl.username || configuredUrl.password ||
    configuredUrl.pathname !== '/' || configuredUrl.search || configuredUrl.hash) {
  throw Error('NEXT_PUBLIC_APP_URL harus berupa origin HTTPS domain utama.');
}
export const APP_URL = configuredUrl.origin;
export const INDEXABLE = process.env.NODE_ENV === 'production' &&
  process.env.VERCEL_ENV !== 'preview' && process.env.SEO_INDEXING_ENABLED === 'true';
