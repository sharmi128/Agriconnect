/**
 * The marketplace's photographs: which local file stands for which listing, and
 * which one stands for which category.
 *
 * Every image here is a committed JPEG under `assets/images`, required at build
 * time rather than fetched at runtime. That matters for the marketplace: a
 * farmer opening a listing in a field with no signal gets the picture, not a
 * spinner that never resolves, and there is no URL that can rot.
 *
 * The registry is keyed rather than inlined so that a listing only ever names a
 * key. Adding a photograph means adding a key here and pointing a listing at it,
 * which keeps the mapping reviewable in one place instead of scattered across
 * the demo data.
 *
 * Two notes on the file names, so nobody goes hunting:
 *
 * - The vegetable seed photograph is `vegetable-seed.jpg`, singular. That is the
 *   name it was saved under, so that is the name it is required by here.
 * - Not every listing has a photograph of its own. Where it does not, the
 *   closest relevant one is used rather than leaving a gap, because a repeated
 *   photograph is a smaller problem than a listing with no picture at all.
 */
import type { MarketplaceCategory } from '@/models/marketplace';

const MARKETPLACE_IMAGE_FILES = {
  paddyField: require('@/assets/images/paddy-field.jpg'),
  paddySunlight: require('@/assets/images/paddy-sunlight.jpg'),
  farmerPaddyField: require('@/assets/images/farmer-paddy-field.jpg'),
  tractor: require('@/assets/images/tractor.jpg'),
  harvester: require('@/assets/images/harvester.jpg'),
  sprayer: require('@/assets/images/sprayer.jpg'),
  farmingTools: require('@/assets/images/farming-tools.jpg'),
  handTools: require('@/assets/images/hand-tools.jpg'),
  seeds: require('@/assets/images/seeds.jpg'),
  riceSeeds: require('@/assets/images/rice-seeds.jpg'),
  vegetableSeed: require('@/assets/images/vegetable-seed.jpg'),
  irrigationKit: require('@/assets/images/irrigation-kit.jpg'),
  fertilizer: require('@/assets/images/fertilizer.jpg'),
  organicCompost: require('@/assets/images/organic-compost.jpg'),
  bioFertilizer: require('@/assets/images/bio-fertilizer.jpg'),
} as const;

/** The photographs the marketplace can draw, one key per local file. */
export type MarketplaceImageKey = keyof typeof MARKETPLACE_IMAGE_FILES;

/** The raw source for one photograph, ready to hand to `expo-image`. */
export function marketplaceImageSource(key: MarketplaceImageKey): number {
  return MARKETPLACE_IMAGE_FILES[key];
}

/** The photograph behind one marketplace category. */
export const MARKETPLACE_CATEGORY_IMAGES: Record<MarketplaceCategory, MarketplaceImageKey> = {
  land: 'paddyField',
  machinery: 'tractor',
  tools: 'farmingTools',
  products: 'seeds',
  fertilizers: 'fertilizer',
};

export function categoryImageKey(category: MarketplaceCategory): MarketplaceImageKey {
  return MARKETPLACE_CATEGORY_IMAGES[category];
}

/**
 * Which photograph each demo listing is shown with.
 *
 * The land and machinery listings that share a category's photograph do so
 * because no separate picture exists for them: a cultivator and a rotavator are
 * both drawn by the tractor they are towed behind, and every plot is a field.
 */
const LISTING_IMAGES: Record<string, MarketplaceImageKey> = {
  'mkt-land-paddy-2-5': 'paddyField',
  'mkt-land-coconut-4': 'paddyField',
  'mkt-land-vegetables-1': 'paddyField',
  'mkt-land-millets-2': 'paddyField',

  'mkt-mach-tractor': 'tractor',
  'mkt-mach-combine': 'harvester',
  'mkt-mach-sprayer': 'sprayer',
  'mkt-mach-cultivator': 'tractor',
  'mkt-mach-rotavator': 'tractor',

  'mkt-tool-drip-kit': 'irrigationKit',
  'mkt-tool-sprayer-16': 'sprayer',
  'mkt-tool-sickle-set': 'handTools',
  'mkt-tool-paddy-weeder': 'farmingTools',

  'mkt-prod-paddy-seeds': 'riceSeeds',
  'mkt-prod-tomato-seeds': 'vegetableSeed',
  'mkt-prod-veg-kit': 'seeds',
  'mkt-prod-coconut-oil': 'seeds',

  'mkt-fert-npk': 'fertilizer',
  'mkt-fert-compost': 'organicCompost',
  'mkt-fert-urea': 'fertilizer',
  'mkt-fert-bio': 'bioFertilizer',
};

const FALLBACK_IMAGE: MarketplaceImageKey = 'seeds';

/**
 * The photograph for a listing id.
 *
 * An id that is not in the map is a listing that arrived from somewhere else —
 * a stale bookmark, a future API response — so it falls back rather than
 * rendering nothing.
 */
export function listingImageKey(listingId: string): MarketplaceImageKey {
  return LISTING_IMAGES[listingId] ?? FALLBACK_IMAGE;
}

/**
 * Reads a stored image key, for the image saved alongside a past order line.
 *
 * Orders are written once and read back for years, so the key is validated
 * against the registry rather than trusted: a key from a later version of the
 * app, or a hand-edited store, has to resolve to something drawable.
 */
export function parseMarketplaceImageKey(
  value: unknown,
  fallback: MarketplaceImageKey
): MarketplaceImageKey {
  return typeof value === 'string' && value in MARKETPLACE_IMAGE_FILES
    ? (value as MarketplaceImageKey)
    : fallback;
}
