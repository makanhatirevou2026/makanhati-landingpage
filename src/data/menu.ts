import type { MenuCategory, MenuItem } from '@/types';

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'gurih', name: 'Gurih', slug: 'gurih', emoji: '🍗', active: true, sortOrder: 1 },
  { id: 'pedas', name: 'Pedas', slug: 'pedas', emoji: '🌶️', active: true, sortOrder: 2 },
  { id: 'creamy', name: 'Creamy', slug: 'creamy', emoji: '🥛', active: true, sortOrder: 3 },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    "id": "senin-pedas",
    "day": "Senin",
    "name": "Ayam Sambal Bawang",
    "description": "Nasi putih dengan ayam sambal bawang, buncis, wortel, dan taburan bawang goreng.",
    "categoryIds": [
      "pedas"
    ],
    "image": "/assets/menu/senin-pedas.webp",
    "imageAlt": "Ayam Sambal Bawang: Nasi putih, ayam potong, sambal bawang, buncis, wortel, bawang goreng.",
    "active": true
  },
  {
    "id": "senin-gurih",
    "day": "Senin",
    "name": "Ayam Teriyaki",
    "description": "Nasi putih dengan ayam teriyaki, bawang bombay, wortel, buncis, dan taburan wijen.",
    "categoryIds": [
      "gurih"
    ],
    "image": "/assets/menu/senin-gurih.webp",
    "imageAlt": "Ayam Teriyaki: Nasi putih, ayam teriyaki, bawang bombay, wortel, buncis, wijen.",
    "active": true
  },
  {
    "id": "senin-creamy",
    "day": "Senin",
    "name": "Creamy Garlic Chicken",
    "description": "Nasi putih dengan ayam saus creamy garlic, brokoli, wortel, dan parsley.",
    "categoryIds": [
      "creamy"
    ],
    "image": "/assets/menu/senin-creamy.webp",
    "imageAlt": "Creamy Garlic Chicken: Nasi putih, ayam potong, saus creamy garlic, brokoli, wortel, parsley.",
    "active": true
  },
  {
    "id": "selasa-pedas",
    "day": "Selasa",
    "name": "Spaghetti Aglio Olio Chicken",
    "description": "Spaghetti dengan ayam, bawang putih, cabai, parsley, dan brokoli.",
    "categoryIds": [
      "pedas"
    ],
    "image": "/assets/menu/selasa-pedas.webp",
    "imageAlt": "Spaghetti Aglio Olio Chicken: Spaghetti, ayam potong, bawang putih, cabai, parsley, brokoli.",
    "active": true
  },
  {
    "id": "selasa-gurih",
    "day": "Selasa",
    "name": "Chicken Bolognese",
    "description": "Spaghetti dengan ayam cincang, saus tomat, bawang bombay, bawang putih, dan parsley.",
    "categoryIds": [
      "gurih"
    ],
    "image": "/assets/menu/selasa-gurih.webp",
    "imageAlt": "Chicken Bolognese: Spaghetti, ayam cincang, saus tomat, bawang bombay, bawang putih, parsley.",
    "active": true
  },
  {
    "id": "selasa-creamy",
    "day": "Selasa",
    "name": "Chicken Carbonara",
    "description": "Spaghetti dengan ayam, saus carbonara creamy, keju, lada hitam, dan parsley.",
    "categoryIds": [
      "creamy"
    ],
    "image": "/assets/menu/selasa-creamy.webp",
    "imageAlt": "Chicken Carbonara: Spaghetti, ayam potong, saus carbonara creamy, keju, lada hitam, parsley.",
    "active": true
  },
  {
    "id": "rabu-pedas",
    "day": "Rabu",
    "name": "Ikan Dabu-Dabu",
    "description": "Nasi putih dengan fillet ikan, sambal dabu-dabu dari tomat, cabai rawit, bawang merah, dan jeruk nipis, serta buncis dan wortel.",
    "categoryIds": [
      "pedas"
    ],
    "image": "/assets/menu/rabu-pedas.webp",
    "imageAlt": "Ikan Dabu-Dabu: Nasi putih, fillet ikan panggang/goreng, sambal dabu-dabu (tomat, cabai rawit, bawang merah, jeruk nipis), buncis, wortel.",
    "active": true
  },
  {
    "id": "rabu-gurih",
    "day": "Rabu",
    "name": "Ikan Asam Manis",
    "description": "Nasi putih dengan fillet ikan goreng, saus asam manis, paprika, dan bawang bombay.",
    "categoryIds": [
      "gurih"
    ],
    "image": "/assets/menu/rabu-gurih.webp",
    "imageAlt": "Ikan Asam Manis: Nasi putih, fillet ikan goreng, saus asam manis, paprika, bawang bombay.",
    "active": true
  },
  {
    "id": "rabu-creamy",
    "day": "Rabu",
    "name": "Creamy Lemon Fish",
    "description": "Nasi putih dengan fillet ikan, saus creamy lemon, brokoli, wortel, dan parsley.",
    "categoryIds": [
      "creamy"
    ],
    "image": "/assets/menu/rabu-creamy.webp",
    "imageAlt": "Creamy Lemon Fish: Nasi putih, fillet ikan, saus creamy lemon, brokoli, wortel, parsley.",
    "active": true
  },
  {
    "id": "kamis-pedas",
    "day": "Kamis",
    "name": "Beef Cabe Ijo",
    "description": "Nasi putih dengan beef slice, cabai hijau, cabai rawit hijau, bawang merah, bawang putih, bawang bombay, dan buncis.",
    "categoryIds": [
      "pedas"
    ],
    "image": "/assets/menu/kamis-pedas.webp",
    "imageAlt": "Beef Cabe Ijo: Nasi putih, beef slice 70–80 g, cabai hijau, cabai rawit hijau, bawang merah, bawang putih, bawang bombay, buncis.",
    "active": true
  },
  {
    "id": "kamis-gurih",
    "day": "Kamis",
    "name": "Beef Yakiniku",
    "description": "Nasi putih dengan beef slice, saus yakiniku, bawang bombay, wijen, dan sayur pelengkap.",
    "categoryIds": [
      "gurih"
    ],
    "image": "/assets/menu/kamis-gurih.webp",
    "imageAlt": "Beef Yakiniku: Nasi putih, beef slice 70–80 g, saus yakiniku, bawang bombay, wijen, sayur pelengkap.",
    "active": true
  },
  {
    "id": "kamis-creamy",
    "day": "Kamis",
    "name": "Creamy Mushroom Beef",
    "description": "Nasi putih dengan beef slice, saus creamy mushroom, jamur, lada hitam, dan buncis.",
    "categoryIds": [
      "creamy"
    ],
    "image": "/assets/menu/kamis-creamy.webp",
    "imageAlt": "Creamy Mushroom Beef: Nasi putih, beef slice 70–80 g, saus creamy mushroom, jamur, lada hitam, buncis.",
    "active": true
  },
  {
    "id": "jumat-pedas",
    "day": "Jumat",
    "name": "Mie Chili Oil Chicken",
    "description": "Mie telur dengan ayam, chili oil, sawi hijau, daun bawang, dan bawang goreng.",
    "categoryIds": [
      "pedas"
    ],
    "image": "/assets/menu/jumat-pedas.webp",
    "imageAlt": "Mie Chili Oil Chicken: Mie telur, ayam potong, chili oil, sawi hijau, daun bawang, bawang goreng.",
    "active": true
  },
  {
    "id": "jumat-gurih",
    "day": "Jumat",
    "name": "Mie Kecap Ayam",
    "description": "Mie telur dengan ayam kecap, sawi hijau, bawang putih, dan daun bawang.",
    "categoryIds": [
      "gurih"
    ],
    "image": "/assets/menu/jumat-gurih.webp",
    "imageAlt": "Mie Kecap Ayam: Mie telur, ayam kecap, sawi hijau, bawang putih, daun bawang.",
    "active": true
  },
  {
    "id": "jumat-creamy",
    "day": "Jumat",
    "name": "Mie Creamy Chicken Mushroom",
    "description": "Mie telur dengan ayam, saus creamy, jamur, sawi hijau, dan lada hitam.",
    "categoryIds": [
      "creamy"
    ],
    "image": "/assets/menu/jumat-creamy.webp",
    "imageAlt": "Mie Creamy Chicken Mushroom: Mie telur, ayam potong, saus creamy, jamur, sawi hijau, lada hitam.",
    "active": true
  },
] as MenuItem[];

export const MENU_DISCLAIMER =
  'Foto adalah ilustrasi menu yang dibuat dengan AI berdasarkan bahan setiap hidangan. Menu dapat berubah mengikuti ketersediaan bahan dan perencanaan dapur.';
