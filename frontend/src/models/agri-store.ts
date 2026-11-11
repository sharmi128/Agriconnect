/**
 * Agri Store product model and demo data.
 *
 * Products are grouped into three families the farmer already knows from the
 * marketplace: 🌱 seeds, 🧪 fertilizers and 🛠️ tools. Everything here is local
 * demo stock — there is no pricing engine, inventory, or checkout. When the
 * Spring Boot backend is ready, each field becomes a database column and the
 * shapes can stay the same so the screen does not have to change.
 *
 * Prices are preformatted strings for the same two reasons as the marketplace:
 * the currency symbol is not reliably available as an Intl option on every
 * Hermes build, and lines like "₹1,850 / 25 kg" cannot be computed from a
 * plain number.
 */

import type { ListingTone } from '@/models/marketplace';

export type ProductCategory = 'seeds' | 'fertilizers' | 'tools';

/** Selectable filter. `all` shows every category at once. */
export type ProductFilter = ProductCategory | 'all';

export type AgriProduct = {
  id: string;
  category: ProductCategory;
  /** Emoji shown in place of a photo until real images are available. */
  emoji: string;
  name: string;
  /** Pack size, for example "25 kg bag". */
  packSize: string;
  /** Price text, already formatted for display. */
  price: string;
  /** Short tag such as "In stock" or "15% off". */
  tag: string;
  /** One supporting line about the product. */
  detail: string;
  /** Shop or local dealer selling the product. */
  seller: string;
  /** Shop phone number, shown on the 📞 Seller Contact row. */
  phone: string;
  tone: ListingTone;
};

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  seeds: 'Seeds',
  fertilizers: 'Fertilizers',
  tools: 'Tools',
};

export const PRODUCT_FILTERS: readonly {
  key: ProductFilter;
  label: string;
  emoji: string;
}[] = [
  { key: 'all', label: 'All', emoji: '\u{1F6D2}' },
  { key: 'seeds', label: 'Seeds', emoji: '\u{1F331}' },
  { key: 'fertilizers', label: 'Fertilizers', emoji: '\u{1F9EA}' },
  { key: 'tools', label: 'Tools', emoji: '\u{1F6E0}\uFE0F' },
];

export const DEMO_AGRI_PRODUCTS: readonly AgriProduct[] = [
  // ── 🌱 Seeds ────────────────────────────────────────────────────────────
  {
    id: 'store-paddy-seeds',
    category: 'seeds',
    emoji: '\u{1F331}',
    name: 'Paddy Seeds ADT 36',
    packSize: '25 kg bag',
    price: '\u{20B9}1,850',
    tag: 'In stock',
    detail: 'High germination, treated seed',
    seller: 'Sri Annapurna Seeds',
    phone: '+91 98470 22334',
    tone: 'gold',
  },
  {
    id: 'store-tomato-seeds',
    category: 'seeds',
    emoji: '\u{1F345}',
    name: 'Tomato Hybrid Seeds',
    packSize: '10 g packet',
    price: '\u{20B9}120',
    tag: 'In stock',
    detail: 'Good for this season, disease tolerant',
    seller: 'Green Cart',
    phone: '+91 94440 55667',
    tone: 'green',
  },
  {
    id: 'store-veg-kit',
    category: 'seeds',
    emoji: '\u{1F966}',
    name: 'Vegetable Seed Kit',
    packSize: '12 packets',
    price: '\u{20B9}260',
    tag: 'New',
    detail: 'Amaranth, brinjal, chilli and greens',
    seller: 'Green Cart',
    phone: '+91 94440 55667',
    tone: 'blue',
  },

  // ── 🧪 Fertilizers ──────────────────────────────────────────────────────
  {
    id: 'store-npk',
    category: 'fertilizers',
    emoji: '\u{2697}\uFE0F',
    name: 'NPK 19:19:19',
    packSize: '50 kg bag',
    price: '\u{20B9}1,340',
    tag: 'In stock',
    detail: 'Bulk pack, free delivery over \u{20B9}2,000',
    seller: 'AgriConnect Store',
    phone: '+91 98470 11230',
    tone: 'green',
  },
  {
    id: 'store-urea',
    category: 'fertilizers',
    emoji: '\u{1F4A7}',
    name: 'Urea 46% Nitrogen',
    packSize: '50 kg bag',
    price: '\u{20B9}560',
    tag: 'Subsidy eligible',
    detail: 'Keep dry and off the ground',
    seller: 'Kanyakumari Agro Mart',
    phone: '+91 94870 77889',
    tone: 'blue',
  },
  {
    id: 'store-compost',
    category: 'fertilizers',
    emoji: '\u{1F30D}',
    name: 'Vermicompost',
    packSize: '10 kg bag',
    price: '\u{20B9}180',
    tag: 'In stock',
    detail: 'Ready to use, from local farms',
    seller: 'Eco Manure Co-op',
    phone: '+91 97510 33445',
    tone: 'earth',
  },

  // ── 🛠️ Tools ────────────────────────────────────────────────────────────
  {
    id: 'store-drip-kit',
    category: 'tools',
    emoji: '\u{1F6BF}',
    name: 'Drip Irrigation Kit',
    packSize: 'Covers 1 acre',
    price: '\u{20B9}12,500',
    tag: '15% off',
    detail: 'Filter and fittings included, easy layout',
    seller: 'AgriConnect Store',
    phone: '+91 98470 11230',
    tone: 'blue',
  },
  {
    id: 'store-sprayer',
    category: 'tools',
    emoji: '\u{1F4A6}',
    name: 'Knapsack Sprayer 16 L',
    packSize: '16 litre tank',
    price: '\u{20B9}2,100',
    tag: 'In stock',
    detail: 'Sturdy straps, comfortable for long plots',
    seller: 'Farm Tools Hub',
    phone: '+91 94860 44556',
    tone: 'gold',
  },
  {
    id: 'store-sickle-set',
    category: 'tools',
    emoji: '\u{1F5E1}\uFE0F',
    name: 'Sickle (Aruval) Set',
    packSize: 'Set of 2',
    price: '\u{20B9}340',
    tag: 'In stock',
    detail: 'Sharp carbon steel, wooden grips',
    seller: 'Farm Tools Hub',
    phone: '+91 94860 44556',
    tone: 'earth',
  },
];

/** Products for one filter value. `all` returns everything in demo order. */
export function filterProducts(
  products: readonly AgriProduct[],
  filter: ProductFilter
): AgriProduct[] {
  return filter === 'all'
    ? [...products]
    : products.filter((product) => product.category === filter);
}

/**
 * Products matching the query, checked across the name, category, pack size,
 * detail and seller. A bare space never matches anything.
 */
export function searchProducts(
  products: readonly AgriProduct[],
  query: string
): AgriProduct[] {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return [...products];
  }

  return products.filter((product) =>
    [
      product.name,
      PRODUCT_CATEGORY_LABELS[product.category],
      product.packSize,
      product.detail,
      product.seller,
    ].some((field) => field.toLowerCase().includes(needle))
  );
}

/** Turns a shop phone number into a `tel:` link with the digits only. */
export function sellerPhoneUrl(phone: string): string {
  return `tel:${phone.replace(/\D/g, '')}`;
}