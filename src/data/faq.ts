import type { FaqItem } from '@/types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-harga',
    question: 'Berapa harga paket MakanHati? Apakah sudah termasuk ongkir?',
    answer:
      'Paket langganan mingguan mulai dari Rp175.000, dengan pilihan bulanan hingga Rp1.280.000. Paket Magang/trial 3 hari mulai dari Rp110.000. Add-on akhir pekan mulai dari Rp80.000 sebagai tambahan paket utama. Harga paket sudah termasuk ongkir.',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'faq-area',
    question: 'Apakah MakanHati melayani pengiriman ke seluruh wilayah Jakarta?',
    answer:
      'Saat MakanHati hadir, pengiriman direncanakan mencakup area hingga 10 km dari dapur kami di Kuningan dan sekitarnya.',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'faq-jadwal',
    question: 'Bagaimana jadwal pengiriman makan siang dan malam di MakanHati?',
    answer:
      'Rencana jadwal pengiriman saat layanan hadir: makan siang pukul 11.00–12.00 dengan pesan konfirmasi pukul 09.00–09.30; makan malam pukul 18.00–19.00 dengan pesan konfirmasi pukul 15.00–15.30. Saat layanan berjalan, pastikan kamu merespons pesan sesuai jadwal agar makanan dapat diproses tepat waktu.',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'faq-weekend',
    question: 'Apakah MakanHati bisa dipesan untuk akhir pekan?',
    answer:
      'Bisa. Saat layanan hadir, paket akhir pekan dapat dipesan bersamaan dengan paket utama atau paling lambat Jumat pukul 18.00 sebelum akhir pekan.',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'faq-alergi',
    question: 'Bagaimana kalau kamu punya alergi makanan?',
    answer:
      'Sampaikan informasi alergi saat konfirmasi dengan tim kami, supaya kebutuhan kamu dapat kami perhatikan.',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'faq-kendala',
    question: 'Bagaimana jika makanan tidak sesuai atau pesanan terlambat?',
    answer:
      'Kamu bisa menghubungi kami melalui email info.makanhati@gmail.com atau Instagram @makanhati.catering. Kami akan membantu menindaklanjuti kendala kamu.',
    active: true,
    sortOrder: 6,
  },
];
