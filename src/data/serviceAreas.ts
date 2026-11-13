import type { ServiceArea } from '@/types';

// NOTE: These areas are indicative only.
// All service eligibility must be confirmed by the MakanHati admin team
// before an order is accepted. Never auto-confirm fulfillment.

export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'karet-kuningan',
    name: 'Karet Kuningan',
    coverageTier: 'primary',
    eligible: true,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
  {
    id: 'kuningan',
    name: 'Kuningan',
    coverageTier: 'primary',
    eligible: true,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
  {
    id: 'setiabudi',
    name: 'Setiabudi',
    coverageTier: 'primary',
    eligible: true,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
  {
    id: 'gatot-subroto',
    name: 'Gatot Subroto',
    coverageTier: 'primary',
    eligible: true,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
  {
    id: 'kebayoran-baru',
    name: 'Kebayoran Baru',
    coverageTier: 'secondary',
    eligible: true,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
  {
    id: 'senopati',
    name: 'Senopati',
    coverageTier: 'secondary',
    eligible: true,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
  {
    id: 'kemang',
    name: 'Kemang',
    coverageTier: 'secondary',
    eligible: true,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
  {
    id: 'mampang',
    name: 'Mampang',
    coverageTier: 'secondary',
    eligible: true,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
  {
    id: 'area-lain',
    name: 'Area lain (konfirmasi dulu)',
    coverageTier: 'secondary',
    eligible: false,
    deliveryFeePolicy: 'akan dikonfirmasi',
  },
];

export function getAreaById(id: string): ServiceArea | undefined {
  return SERVICE_AREAS.find((a) => a.id === id);
}
