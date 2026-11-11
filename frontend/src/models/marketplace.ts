/**
 * Marketplace model and demo data.
 *
 * The marketplace is deliberately two steps deep rather than one long list:
 * Marketplace home shows the five categories, and a category page shows only its
 * own listings. A farmer arrives with one question in mind — "is there land to
 * rent?", "who sells seed?" — and putting every product on one screen used to
 * bury it under tractors, plots and fertilizer bags at once. One screen now
 * answers one question.
 *
 * The five categories are typed separately and combined into one union, so a
 * card can show the facts that matter for the category it was handed: plot size
 * for land, machine type for machinery, pack size for anything sold in a bag or
 * a box. `ListingTone` is shared with the agri store, machinery and nearby land
 * models so every card in the app accents the same way.
 *
 * Prices are preformatted strings for two reasons: the currency symbol is not
 * reliably available as an Intl option on every Hermes build, and free-text
 * values like "₹1,800 / day" cannot be computed from a plain number.
 *
 * All of this is local demo data. There is no API call, and the shapes below
 * are what a listings endpoint is expected to return later.
 */

/** Accent used for the card image placeholder. Shared with the other models. */
export type ListingTone = 'green' | 'gold' | 'earth' | 'blue';

/** The five things a farmer comes to the marketplace to look at. */
export type MarketplaceCategory =
  | 'land'
  | 'machinery'
  | 'tools'
  | 'products'
  | 'fertilizers';

/** The filter every category starts on, meaning "do not narrow anything". */
export const ALL_FILTERS = 'All';

/**
 * One filter option, a plain word so the filter sheet can be built from the
 * category's own list without a second lookup table.
 */
export type MarketplaceFilter = string;

/** Everything a category page needs to draw itself. */
export type MarketplaceCategoryInfo = {
  key: MarketplaceCategory;
  /** The large agriculture icon on the Marketplace home card. */
  emoji: string;
  /** Page title on the category page, for example "Machinery". */
  title: string;
  /** One line under the title on the home card. */
  description: string;
  /** A second line of context under the title on the category page. */
  blurb: string;
  /**
   * The options in the filter sheet, without "All" — that one is added by the
   * sheet itself, because every category has it and none should have to say so.
   */
  filters: readonly MarketplaceFilter[];
  /** Copy for a search or filter that matches nothing. */
  emptyHint: string;
};

/**
 * The five categories, in the order the farmer sees them on Marketplace home.
 *
 * The order is the order a season runs in: find the land, get a machine on it,
 * buy the tools, sow the seed, feed the crop.
 */
export const MARKETPLACE_CATEGORIES: readonly MarketplaceCategoryInfo[] = [
  {
    key: 'land',
    emoji: '\u{1F3DE}\uFE0F',
    title: 'Land',
    description: 'Farm plots to rent or buy near you',
    blurb: 'Paddy fields, orchards and vegetable plots, with the owner\u2019s number.',
    filters: ['Rent', 'Buy'],
    emptyHint: 'Try another search, or switch between rent and buy.',
  },
  {
    key: 'machinery',
    emoji: '\u{1F69C}',
    title: 'Machinery',
    description: 'Rent or buy tractors, harvesters and sprayers',
    blurb: 'Tractors, harvesters, sprayers, cultivators and rotavators.',
    filters: ['Rent', 'Buy'],
    emptyHint: 'Try another search, or switch between rent and buy.',
  },
  {
    key: 'tools',
    emoji: '\u{1F6E0}\uFE0F',
    title: 'Farming Tools',
    description: 'Hand tools, irrigation gear and sprayers',
    blurb: 'Irrigation kits, sprayers, sickles and weeders, ready to collect.',
    filters: ['Irrigation', 'Spraying', 'Harvesting', 'Weeding'],
    emptyHint: 'Try another search, or pick a different kind of tool.',
  },
  {
    key: 'products',
    emoji: '\u{1F331}',
    title: 'Seeds & Products',
    description: 'Seeds, crop products and farm supplies',
    blurb: 'Paddy and vegetable seed, seed kits and cold-pressed produce.',
    filters: ['Paddy seed', 'Vegetable seed', 'Seed kit', 'Crop product'],
    emptyHint: 'Try another search, or pick a different kind of product.',
  },
  {
    key: 'fertilizers',
    emoji: '\u{1F9EA}',
    title: 'Fertilizers',
    description: 'Compost, manure and nutrient mixes',
    blurb: 'Vermicompost, urea, NPK mixes and bio-fertilizer cultures.',
    filters: ['Compost', 'Nutrient mix', 'Bio-fertilizer'],
    emptyHint: 'Try another search, or pick a different kind of fertilizer.',
  },
];

/** The five category keys, handy when only the key matters. */
export const MARKETPLACE_CATEGORY_KEYS: readonly MarketplaceCategory[] =
  MARKETPLACE_CATEGORIES.map((category) => category.key);

/** The category entry for one key, so no screen indexes into the array itself. */
export function marketplaceCategory(
  category: MarketplaceCategory
): MarketplaceCategoryInfo {
  const info = MARKETPLACE_CATEGORIES.find((entry) => entry.key === category);

  if (!info) {
    throw new Error(`No marketplace category for key: ${category}`);
  }

  return info;
}

/**
 * Narrows whatever a route parameter carries down to a real category key, so a
 * stale bookmark or a mistyped URL shows an empty state rather than crashing.
 */
export function parseMarketplaceCategory(
  value: string | undefined
): MarketplaceCategory | null {
  return MARKETPLACE_CATEGORIES.some((entry) => entry.key === value)
    ? (value as MarketplaceCategory)
    : null;
}

/** Fields every listing carries, whatever its category. */
type BaseListing = {
  id: string;
  /** Emoji shown in place of a photo until real images are available. */
  emoji: string;
  title: string;
  location: string;
  /** Price text, already formatted for display. */
  price: string;
  /** Owner, shop or seller who posted the listing. */
  postedBy: string;
  /**
   * Display phone number. Every one of them is a made-up `+91 90000 000NN` line,
   * so nothing in the app can ring a real person's phone while the marketplace
   * is still demo data.
   */
  phone: string;
  /** One short line, for the card. */
  note: string;
  /** A couple of sentences, for the product details page. */
  description: string;
  tone: ListingTone;
};

/** 🏞️ A plot offered for rent or for sale. */
export type MarketplaceLandListing = BaseListing & {
  category: 'land';
  offer: 'Rent' | 'Buy';
  /** Plot size, for example "2.5 acres". */
  area: string;
  /** What the plot is good for, for example "Paddy". */
  bestFor: string;
};

/** 🚜 A machine offered for rent or for sale. */
export type MarketplaceMachineryListing = BaseListing & {
  category: 'machinery';
  offer: 'Rent' | 'Buy';
  /** What sort of machine it is, for example "Tractor". */
  machineType: string;
  /** When the machine is free, in words a farmer can plan around. */
  availability: string;
};

/** 🛠️ Equipment the farmer buys outright rather than rents. */
export type MarketplaceToolListing = BaseListing & {
  category: 'tools';
  /** What the tool is for, for example "Irrigation". */
  toolType: string;
  /** Pack size or coverage, for example "Covers 1 acre". */
  packSize: string;
  /** Short tag such as "In stock" or "15% off". */
  tag: string;
};

/** 🌱 Seeds and crop products, such as a variety pack or a spray. */
export type MarketplaceProductListing = BaseListing & {
  category: 'products';
  /** What the seed or product is, for example "Paddy seed". */
  productType: string;
  /** Pack size, for example "25 kg bag". */
  packSize: string;
  /** Short tag such as "In stock" or "New". */
  tag: string;
};

/** 🧪 Compost, organic manure and nutrient mixes. */
export type MarketplaceFertilizerListing = BaseListing & {
  category: 'fertilizers';
  /** Organic, compost, bio-fertilizer or nutrient mix. */
  fertilizerType: string;
  packSize: string;
  /** Short tag such as "In stock" or "Subsidy eligible". */
  tag: string;
};

export type MarketplaceListing =
  | MarketplaceLandListing
  | MarketplaceMachineryListing
  | MarketplaceToolListing
  | MarketplaceProductListing
  | MarketplaceFertilizerListing;

export const DEMO_MARKETPLACE_LISTINGS: readonly MarketplaceListing[] = [
  // ── 🏞️ Land ──────────────────────────────────────────────────────────────
  {
    id: 'mkt-land-paddy-2-5',
    category: 'land',
    emoji: '\u{1F33E}',
    title: '2.5 Acre Paddy Land',
    location: 'Thovalai',
    price: '₹15,000 / month',
    postedBy: 'S. Murugan',
    phone: '+91 90000 00003',
    offer: 'Rent',
    area: '2.5 acres',
    bestFor: 'Paddy',
    note: 'Flat plot with road access and canal water on three sides.',
    description:
      'A level two-and-a-half acre plot a short way off the Thovalai road, with the canal running along three sides so there is no pumping cost. The soil is the clay loam paddy grows best in, and the plot has been fallow one season so it is ready to plough straight away.',
    tone: 'green',
  },
  {
    id: 'mkt-land-coconut-4',
    category: 'land',
    emoji: '\u{1F965}',
    title: '4 Acre Coconut Orchard',
    location: 'Nagercoil',
    price: '₹8,50,000',
    postedBy: 'R. Devi',
    phone: '+91 90000 00004',
    offer: 'Buy',
    area: '4 acres',
    bestFor: 'Coconut',
    note: '400 palms, six years old and already bearing well.',
    description:
      'A four-acre orchard of 400 coconut palms planted six years ago and already in steady bearing, which is early for this soil. There is a thatched shed and a hand pump on the plot, and the buyer takes over the existing arrangement with the neighbouring farm for the harvest.',
    tone: 'earth',
  },
  {
    id: 'mkt-land-vegetables-1',
    category: 'land',
    emoji: '\u{1F96C}',
    title: '1 Acre Vegetable Plot',
    location: 'Marthapuram',
    price: '₹9,000 / month',
    postedBy: 'A. Selvam',
    phone: '+91 90000 00005',
    offer: 'Rent',
    area: '1 acre',
    bestFor: 'Vegetables',
    note: 'Irrigation available, fenced and close to the main road.',
    description:
      'One fenced acre of vegetable ground with a borewell that held all of last season, so leafy greens and gourds can be grown through the dry months. It sits within a hundred metres of the main road, which matters when every harvest has to be carted out before noon.',
    tone: 'gold',
  },
  {
    id: 'mkt-land-millets-2',
    category: 'land',
    emoji: '\u{1F33E}',
    title: '2 Acre Millets Field',
    location: 'Agasteeswar',
    price: '₹3,60,000',
    postedBy: 'M. Arumugam',
    phone: '+91 90000 00006',
    offer: 'Buy',
    area: '2 acres',
    bestFor: 'Millets',
    note: 'Open field, sandy soil, suited to dryland crops.',
    description:
      'Two acres of open, level field with the red sandy soil that ragi, bajra and foxtail millet want. It is not irrigated, which is why it is priced for a dryland crop rather than paddy, and the previous owner kept it clean with a single annual ploughing.',
    tone: 'earth',
  },

  // ── 🚜 Machinery ─────────────────────────────────────────────────────────
  {
    id: 'mkt-mach-tractor',
    category: 'machinery',
    emoji: '\u{1F69C}',
    title: 'Tractor',
    location: 'Thovalai',
    price: '₹1,800 / day',
    postedBy: 'Kumar Equipment',
    phone: '+91 90000 00001',
    offer: 'Rent',
    machineType: 'Tractor',
    availability: 'Available this week',
    note: '45 HP Mahindra, 2019 model, trailer included.',
    description:
      'A 45 HP Mahindra in good working order, serviced every month and supplied with a matching trailer so a day’s ploughing or carting is one hire rather than two. The operator is available at an extra ₹400 if you would rather not drive it yourself.',
    tone: 'green',
  },
  {
    id: 'mkt-mach-combine',
    category: 'machinery',
    emoji: '\u{1F33E}',
    title: 'Combine Harvester',
    location: 'Nagercoil',
    price: '₹4,20,000',
    postedBy: 'Kumar Equipment',
    phone: '+91 90000 00001',
    offer: 'Buy',
    machineType: 'Combine Harvester',
    availability: 'Can inspect any day',
    note: 'Used three seasons, fully serviced before every harvest.',
    description:
      'A self-propelled combine that has worked three seasons and is fully serviced, with the cutter bar and belts replaced ahead of last harvest. It cut paddy and wheat without trouble and is kept under cover, so the buyer is not taking on any rust. Inspection any day, no obligation.',
    tone: 'earth',
  },
  {
    id: 'mkt-mach-sprayer',
    category: 'machinery',
    emoji: '\u{1F4A7}',
    title: 'Power Sprayer',
    location: 'Rajakkamangalam',
    price: '₹600 / day',
    postedBy: 'Farm Tools Hub',
    phone: '+91 90000 00007',
    offer: 'Rent',
    machineType: 'Power Sprayer',
    availability: 'Available on weekends',
    note: 'Petrol start, 16 litre tank, good working condition.',
    description:
      'A petrol-start power sprayer with a sixteen litre tank, light enough to carry between rows and strong enough to cover an acre in an afternoon. Hired by the day on weekends, when the shop is not renting it out for delivery runs.',
    tone: 'blue',
  },
  {
    id: 'mkt-mach-cultivator',
    category: 'machinery',
    emoji: '\u{1F6E1}\uFE0F',
    title: 'Cultivator',
    location: 'Marthapuram',
    price: '₹1,200 / day',
    postedBy: 'A. Selvam',
    phone: '+91 90000 00005',
    offer: 'Rent',
    machineType: 'Cultivator',
    availability: 'Free from 5 Oct',
    note: 'Nine tine cultivator, breaks clods after ploughing.',
    description:
      'A nine-tine cultivator that fits a 35 HP tractor, hired by the day once the ploughing is done. It breaks clods and firms the seedbed in one pass, which is the job that otherwise takes the longest after the first plough. Free to collect from 5 October onwards.',
    tone: 'gold',
  },
  {
    id: 'mkt-mach-rotavator',
    category: 'machinery',
    emoji: '\u{1F300}',
    title: 'Rotavator',
    location: 'Agasteeswar',
    price: '₹900 / day',
    postedBy: 'M. Arumugam',
    phone: '+91 90000 00006',
    offer: 'Rent',
    machineType: 'Rotavator',
    availability: 'Available this week',
    note: 'Seven feet, blades sharpened last season.',
    description:
      'A seven foot rotavator that turns the top nine inches of soil in a single pass, saving the fuel and time of ploughing, cross ploughing and harrowing in turn. The blades were sharpened at the end of last season and it bolts onto any standard three-point linkage.',
    tone: 'green',
  },

  // ── 🛠️ Farming Tools ────────────────────────────────────────────────────
  {
    id: 'mkt-tool-drip-kit',
    category: 'tools',
    emoji: '\u{1F6BF}',
    title: 'Drip Irrigation Kit',
    location: 'AgriConnect Store',
    price: '₹12,500',
    postedBy: 'AgriConnect Store',
    phone: '+91 90000 00001',
    toolType: 'Irrigation',
    packSize: 'Covers 1 acre',
    tag: '15% off',
    note: 'Filter and fittings included, lays out in an afternoon.',
    description:
      'A full drip kit for one acre: inline drippers on 30 metre rolls, a screen filter, a venturi and enough fittings to lay the whole thing out. Most farmers fit this themselves over an afternoon, and the store will talk you through the layout on the phone if you have not done it before.',
    tone: 'blue',
  },
  {
    id: 'mkt-tool-sprayer-16',
    category: 'tools',
    emoji: '\u{1F4A7}',
    title: 'Knapsack Sprayer 16 L',
    location: 'Farm Tools Hub',
    price: '₹2,100',
    postedBy: 'Farm Tools Hub',
    phone: '+91 90000 00007',
    toolType: 'Spraying',
    packSize: '16 litre tank',
    tag: 'In stock',
    note: 'Sturdy straps, comfortable for a long day in the field.',
    description:
      'A sixteen litre knapsack sprayer with wide padded straps, so a full tank sits on the shoulders rather than digging in. The brass spray lance gives a fine mist at one twist and a jet at the other, and the tank is translucent so you can see when it is empty.',
    tone: 'gold',
  },
  {
    id: 'mkt-tool-sickle-set',
    category: 'tools',
    emoji: '\u{1F5E1}\uFE0F',
    title: 'Sickle (Aruval) Set',
    location: 'Farm Tools Hub',
    price: '₹340',
    postedBy: 'Farm Tools Hub',
    phone: '+91 90000 00007',
    toolType: 'Harvesting',
    packSize: 'Set of 2',
    tag: 'In stock',
    note: 'Sharp carbon steel blades with wooden grips.',
    description:
      'Aruval sickles in the curved shape used for paddy, with carbon steel blades that hold an edge rather than needing a stone every morning. The wooden grips are the length most people in this district already have a hand on, so the set fits the existing harvesting tool.',
    tone: 'earth',
  },
  {
    id: 'mkt-tool-paddy-weeder',
    category: 'tools',
    emoji: '\u{1F33E}',
    title: 'Paddy Weeder',
    location: 'AgriConnect Store',
    price: '₹1,650',
    postedBy: 'AgriConnect Store',
    phone: '+91 90000 00001',
    toolType: 'Weeding',
    packSize: 'Single unit',
    tag: 'In stock',
    note: 'Star wheel type, saves the back in a flooded field.',
    description:
      'A star-wheel paddy weeder that takes out young weeds in a flooded field without the stooping and back strain of hand weeding. It is pushed rather than pulled, so a farmer working a full acre in a few hours finds the pace workable. Handle length suits a five-foot row spacing.',
    tone: 'green',
  },

  // ── 🌱 Seeds & Products ──────────────────────────────────────────────────
  {
    id: 'mkt-prod-paddy-seeds',
    category: 'products',
    emoji: '\u{1F33E}',
    title: 'Paddy Seeds ADT 36',
    location: 'AgriConnect Store',
    price: '₹1,850',
    postedBy: 'Sri Annapurna Seeds',
    phone: '+91 90000 00002',
    productType: 'Paddy seed',
    packSize: '25 kg bag',
    tag: 'In stock',
    note: 'High germination, treated seed, sow within the season.',
    description:
      'ADT 36 seed from this season\u2019s lot, treated and packed, with a germination figure of 92% on the label. It is the short duration variety most farmers around here are moving to, which means a lot can be turned round before the next season sets in. Sow within the season for the full yield.',
    tone: 'gold',
  },
  {
    id: 'mkt-prod-tomato-seeds',
    category: 'products',
    emoji: '\u{1F345}',
    title: 'Tomato Hybrid Seeds',
    location: 'Green Cart',
    price: '₹120',
    postedBy: 'Green Cart',
    phone: '+91 90000 00008',
    productType: 'Vegetable seed',
    packSize: '10 g packet',
    tag: 'In stock',
    note: 'Disease tolerant, good for this season.',
    description:
      'A hybrid tomato seed sold in ten gram packets, chosen for tolerance to the leaf blight that normally finishes a tomato crop here. It carries well in heat, so it suits the hotter months when a fixed variety usually drops its fruit.',
    tone: 'green',
  },
  {
    id: 'mkt-prod-veg-kit',
    category: 'products',
    emoji: '\u{1F96C}',
    title: 'Vegetable Seed Kit',
    location: 'Green Cart',
    price: '₹260',
    postedBy: 'Green Cart',
    phone: '+91 90000 00008',
    productType: 'Seed kit',
    packSize: '12 packets',
    tag: 'New',
    note: 'Amaranth, brinjal, chilli and leafy greens.',
    description:
      'Twelve packets covering a household vegetable plot: amaranth and two leafy greens, brinjal, two chillies, ridge gourd, bitter gourd, okra, beans, tomato and a root crop. Useful for a mixed plot where something is ready every few weeks rather than all at once.',
    tone: 'blue',
  },
  {
    id: 'mkt-prod-coconut-oil',
    category: 'products',
    emoji: '\u{1F965}',
    title: 'Cold-Pressed Coconut Oil',
    location: 'Eco Manure Co-op',
    price: '₹480',
    postedBy: 'Eco Manure Co-op',
    phone: '+91 90000 00009',
    productType: 'Crop product',
    packSize: '1 litre jar',
    tag: 'In stock',
    note: 'Wood pressed, no additives, good for home use.',
    description:
      'Wood pressed coconut oil from the co-op\u2019s own copra, with nothing added to it. Sold in one litre glass jars so the oil is not sitting in plastic, and the co-op buys copra from the surrounding orchards at a fixed price each season.',
    tone: 'earth',
  },

  // ── 🧪 Fertilizers ───────────────────────────────────────────────────────
  {
    id: 'mkt-fert-npk',
    category: 'fertilizers',
    emoji: '\u{1F9EA}',
    title: 'NPK 19:19:19',
    location: 'AgriConnect Store',
    price: '₹1,340',
    postedBy: 'AgriConnect Store',
    phone: '+91 90000 00001',
    fertilizerType: 'Nutrient mix',
    packSize: '50 kg bag',
    tag: 'In stock',
    note: 'Bulk pack, free delivery over ₹2,000.',
    description:
      'A balanced 19:19:19 in fifty kilo bags, which is the mix most farmers use at transplanting. Keep it sealed and off the ground, because damp bagged fertilizer loses a good part of its nitrogen before it reaches the field. Free delivery on orders over ₹2,000.',
    tone: 'green',
  },
  {
    id: 'mkt-fert-compost',
    category: 'fertilizers',
    emoji: '\u{1F30D}',
    title: 'Vermicompost',
    location: 'Eco Manure Co-op',
    price: '₹180',
    postedBy: 'Eco Manure Co-op',
    phone: '+91 90000 00009',
    fertilizerType: 'Compost',
    packSize: '10 kg bag',
    tag: 'In stock',
    note: 'Ready to use, made on nearby farms.',
    description:
      'Vermicompost made from farm waste on the co-op\u2019s own site, ready to use with no further curing. It goes straight into the planting pit or mixes into the top layer, and it carries the soil life that urea and potash leave behind. Ten kilos covers a good part of an acre.',
    tone: 'earth',
  },
  {
    id: 'mkt-fert-urea',
    category: 'fertilizers',
    emoji: '\u{1F4A7}',
    title: 'Urea 46% Nitrogen',
    location: 'Kanyakumari Agro Mart',
    price: '₹560',
    postedBy: 'Kanyakumari Agro Mart',
    phone: '+91 90000 00010',
    fertilizerType: 'Nutrient mix',
    packSize: '50 kg bag',
    tag: 'Subsidy eligible',
    note: 'Keep dry and off the ground, away from children.',
    description:
      'Standard urea at 46% nitrogen, the top-dressing most plots here finish the season on. Store it sealed on a pallet and well away from any water source, and keep it out of reach of children. The shop handles the subsidy paperwork on collection.',
    tone: 'blue',
  },
  {
    id: 'mkt-fert-bio',
    category: 'fertilizers',
    emoji: '\u{1F33F}',
    title: 'Bio-Fertilizer Culture',
    location: 'AgriConnect Store',
    price: '₹95',
    postedBy: 'AgriConnect Store',
    phone: '+91 90000 00001',
    fertilizerType: 'Bio-fertilizer',
    packSize: '1 kg packet',
    tag: 'Organic',
    note: 'Mixes with seed or compost, no waiting period.',
    description:
      'A culture of nitrogen fixing and phosphate solubilising bacteria, mixed with compost or coated onto seed before sowing. It is a supplement rather than a replacement for what the crop actually needs, but on a plot that has been under urea for years it is the cheapest way to start building the soil back up.',
    tone: 'gold',
  },
];

/** Listings for one category, in demo order. */
export function listingsForCategory(
  listings: readonly MarketplaceListing[],
  category: MarketplaceCategory
): MarketplaceListing[] {
  return listings.filter((listing) => listing.category === category);
}

/** How many listings a category holds, shown on the home card. */
export function categoryCount(
  listings: readonly MarketplaceListing[],
  category: MarketplaceCategory
): number {
  return listings.reduce(
    (total, listing) => (listing.category === category ? total + 1 : total),
    0
  );
}

/** One listing by its id, for the product details page. */
export function listingById(
  listings: readonly MarketplaceListing[],
  id: string
): MarketplaceListing | undefined {
  return listings.find((listing) => listing.id === id);
}

/**
 * The word a listing is filed under on its category's filter sheet: the offer
 * for land and machinery, and the kind of thing it is for everything sold.
 *
 * Filtering compares this against the chosen filter, so the demo data and the
 * filter list in `MARKETPLACE_CATEGORIES` can never disagree about which words
 * exist.
 */
export function listingFilterValue(listing: MarketplaceListing): string {
  if (listing.category === 'land' || listing.category === 'machinery') {
    return listing.offer;
  }

  if (listing.category === 'tools') {
    return listing.toolType;
  }

  if (listing.category === 'products') {
    return listing.productType;
  }

  return listing.fertilizerType;
}

/** Narrows a category's listings down to the chosen filter, or to all of them. */
export function filterMarketplaceListings(
  listings: readonly MarketplaceListing[],
  filter: MarketplaceFilter
): MarketplaceListing[] {
  if (filter === ALL_FILTERS) {
    return [...listings];
  }

  return listings.filter((listing) => listingFilterValue(listing) === filter);
}

/**
 * The label that sits in the corner of a card: Rent or Buy for the one-off
 * deals, and the stock tag for everything a farmer would pick up in a shop.
 */
export function listingBadge(listing: MarketplaceListing): string {
  if (listing.category === 'land' || listing.category === 'machinery') {
    return listing.offer;
  }

  return listing.tag;
}

/** What the offer chip says, or null when the category has no rent or buy. */
export function listingOffer(listing: MarketplaceListing): string | null {
  if (listing.category === 'land' || listing.category === 'machinery') {
    return listing.offer;
  }

  return null;
}

/**
 * The two facts worth comparing in this category, in the order a farmer reads
 * them: what it is, and what condition or size it comes in.
 */
export function listingFacts(
  listing: MarketplaceListing
): { label: string; value: string }[] {
  if (listing.category === 'land') {
    return [
      { label: 'Area', value: listing.area },
      { label: 'Good for', value: listing.bestFor },
    ];
  }

  if (listing.category === 'machinery') {
    return [
      { label: 'Machine', value: listing.machineType },
      { label: 'When free', value: listing.availability },
    ];
  }

  if (listing.category === 'tools') {
    return [
      { label: 'Type', value: listing.toolType },
      { label: 'Pack', value: listing.packSize },
    ];
  }

  if (listing.category === 'products') {
    return [
      { label: 'Type', value: listing.productType },
      { label: 'Pack', value: listing.packSize },
    ];
  }

  return [
    { label: 'Type', value: listing.fertilizerType },
    { label: 'Pack', value: listing.packSize },
  ];
}

/** Every row shown in the details table, in the order they are read. */
export function listingDetailRows(
  listing: MarketplaceListing
): { label: string; value: string }[] {
  return [
    { label: 'Location', value: listing.location },
    { label: 'Seller', value: listing.postedBy },
    { label: 'Phone', value: listing.phone },
    ...listingFacts(listing),
  ];
}

/**
 * The words a farmer could type for a listing, whichever category it belongs to,
 * so a search for "paddy" finds both the plot and the seed.
 */
function searchableText(listing: MarketplaceListing): string {
  const common = [
    listing.title,
    listing.location,
    listing.postedBy,
    listing.note,
    listing.price,
    listingFilterValue(listing),
  ];

  if (listing.category === 'land') {
    return [...common, listing.area, listing.bestFor].join(' ');
  }

  if (listing.category === 'machinery') {
    return [...common, listing.machineType, listing.availability].join(' ');
  }

  if (listing.category === 'tools') {
    return [...common, listing.toolType, listing.packSize, listing.tag].join(' ');
  }

  if (listing.category === 'products') {
    return [...common, listing.productType, listing.packSize, listing.tag].join(' ');
  }

  return [
    ...common,
    listing.fertilizerType,
    listing.packSize,
    listing.tag,
  ].join(' ');
}

/**
 * Listings matching the query, checked across the title, place, seller and the
 * facts specific to the category. A blank query returns everything, so the
 * screen just shows what is there.
 */
export function searchMarketplaceListings(
  listings: readonly MarketplaceListing[],
  query: string
): MarketplaceListing[] {
  const needle = query.trim().toLowerCase();

  if (needle === '') {
    return [...listings];
  }

  return listings.filter((listing) =>
    searchableText(listing).toLowerCase().includes(needle)
  );
}

/** "1 listing" or "5 listings", so every count in the app reads the same way. */
export function listingCountLabel(count: number): string {
  return count === 1 ? '1 listing' : `${count} listings`;
}
