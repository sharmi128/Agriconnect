/**
 * Buyer Connection model and demo data.
 *
 * The screen this backs joins the two sides of one deal: 🌾 the harvest the
 * farmer has ready to sell, and 🛒 the buyers looking for that produce. A buyer
 * quotes a price per quintal for a crop, the way traders actually quote, while
 * everything on the farmer's side is stored in kilograms, matching the crop
 * journal. Every total on the screen is worked out from these lists rather than
 * stored as its own field, so a figure can never disagree with the list under it.
 *
 * This is all local demo data. There is no API call, so the screen works with no
 * connection, and the shapes below are what the buyer and sale request endpoints
 * are expected to return later.
 */

import { parseDisplayDate } from '@/models/crop-journal';
import { formatToday } from '@/models/expenses';

/** One quintal is 100 kg, which is the unit buyers quote their prices in. */
export const KG_PER_QUINTAL = 100;

/** 🌾 One crop the farmer has ready to sell. */
export type HarvestLot = {
  id: string;
  /** The crop in the journal this lot came from, for example `crop-paddy`. */
  cropId: string;
  /** How much is ready to go, in kilograms. */
  availableKg: number;
  /** What the farmer is asking, in rupees per quintal. */
  expectedPricePerQuintal: number;
  /** Quality note, for example "Grade A, dried". */
  grade: string;
  /** How soon it can be lifted, for example "Ready now". */
  readyLabel: string;
  /** Anything else the buyer should know before quoting. */
  note?: string;
};

/** What one buyer will pay for one crop. */
export type BuyerOffer = {
  /** The crop in the journal the offer is for, for example `crop-paddy`. */
  cropId: string;
  /** What they pay, in rupees per quintal. */
  pricePerQuintal: number;
  /** How much they can take, in kilograms. */
  neededKg: number;
};

/** What kind of business the buyer is, which is what the card shows as a tag. */
export type BuyerKind = 'Trader' | 'Mill' | 'Wholesaler' | 'Exporter' | 'Local market';

/** 🛒 One buyer who wants the farmer's produce. */
export type Buyer = {
  id: string;
  /** Business name, for example "Anand Traders". */
  name: string;
  /** Avatar emoji, standing in for a logo until real images exist. */
  emoji: string;
  kind: BuyerKind;
  /** Town the buyer works out of, for example "Nagercoil". */
  location: string;
  /** Distance from the farm in kilometres, used by the location filter. */
  distanceKm: number;
  /** How the produce is collected, for example "Lifts from the field". */
  pickup: string;
  /** How the buyer pays, for example "Cash on delivery". */
  payment: string;
  /** Average rating out of 5, from farmers who have sold to them. */
  rating: number;
  /** True once AgriConnect has checked the buyer's papers. */
  verified: boolean;
  /** The person to speak to, for example "Anand Kumar". */
  contactName: string;
  /**
   * Demo phone number. Nothing is really dialled until the backend is
   * connected, so this is only ever shown as text for now.
   */
  phone: string;
  /** What the buyer is looking for: one entry per crop, and the rate for it. */
  offers: BuyerOffer[];
  /** When the rate lapses, for example "Closes 04 Oct". */
  closesOn: string;
};

/** Where a sale request has got to. */
export type SaleRequestStatus = 'Requested' | 'Accepted' | 'Completed' | 'Declined';

/** 📋 One sale or request, as it appears in the farmer's own list. */
export type SaleRequest = {
  id: string;
  buyerId: string;
  /**
   * Copied from the buyer rather than looked up, so a request still reads
   * correctly on its own once the list is returned by a backend.
   */
  buyerName: string;
  /** The crop in the journal the request is for. */
  cropId: string;
  quantityKg: number;
  /** The rate being discussed, in rupees per quintal. */
  pricePerQuintal: number;
  status: SaleRequestStatus;
  /** Display date, for example "27 Sep 2026". */
  requestedOn: string;
  note?: string;
};

/** How the farmer reached out. Nothing is really dialled in demo mode. */
export type ContactChannel = 'Call' | 'WhatsApp' | 'SMS';

/**
 * What the 📞 Contact Buyer sheet is open for: the buyer, the offer being
 * discussed, and the farmer's own lot for that crop when there is one.
 */
export type ContactTarget = {
  buyer: Buyer;
  offer: BuyerOffer;
  lot?: HarvestLot;
};

/** The areas the 📍 Buyer Location filter offers. `all` shows everyone. */
export type DistanceFilter = 'all' | '10' | '25' | '50';

export const DISTANCE_FILTERS: readonly {
  key: DistanceFilter;
  label: string;
  /** Furthest distance the filter keeps, in kilometres. */
  km: number;
}[] = [
  { key: 'all', label: 'All areas', km: Number.POSITIVE_INFINITY },
  { key: '10', label: 'Within 10 km', km: 10 },
  { key: '25', label: 'Within 25 km', km: 25 },
  { key: '50', label: 'Within 50 km', km: 50 },
];

/**
 * 🌾 The harvest the farmer has ready to sell.
 *
 * The crop ids point at `DEMO_JOURNAL_CROPS`, so the name, emoji and field on
 * each card come from the crop journal instead of being repeated here. Keeping
 * the two screens on the same crops is what stops them drifting apart.
 */
export const DEMO_HARVEST_LOTS: readonly HarvestLot[] = [
  {
    id: 'lot-paddy',
    cropId: 'crop-paddy',
    availableKg: 2200,
    expectedPricePerQuintal: 2400,
    grade: 'Grade A, dried',
    readyLabel: 'Ready now',
    note: 'Bags in the farm shed after the 20 Oct harvest.',
  },
  {
    id: 'lot-tomato',
    cropId: 'crop-tomato',
    availableKg: 480,
    expectedPricePerQuintal: 3200,
    grade: 'Grade A, first pick',
    readyLabel: 'Second pick in 6 days',
    note: 'Picked this morning, packed in crates and kept in the shade.',
  },
  {
    id: 'lot-maize',
    cropId: 'crop-maize',
    availableKg: 800,
    expectedPricePerQuintal: 1850,
    grade: 'Grade B, shelled',
    readyLabel: 'Ready now',
    note: 'Dried down to 14% moisture, so it can go straight to a mill.',
  },
];

/**
 * 🛒 The buyers looking for produce around the farm, nearest first.
 *
 * Distances and rates are made up but realistic for the area: a local market
 * pays the most for tomatoes because they sell them the same morning, while a
 * mill 12 km away pays a little less for paddy but can take it by the lorry
 * load. That is what makes the 💰 Expected Price comparison worth reading.
 */
export const DEMO_BUYERS: readonly Buyer[] = [
  {
    id: 'buyer-vegmart',
    name: 'Veg Mart',
    emoji: '🛒',
    kind: 'Local market',
    location: 'Agasteeswaram',
    distanceKm: 4,
    pickup: 'Collects every morning',
    payment: 'Cash on delivery',
    rating: 4.1,
    verified: false,
    contactName: 'Latha R',
    phone: '+91 90031 22456',
    offers: [
      { cropId: 'crop-tomato', pricePerQuintal: 3400, neededKg: 600 },
      { cropId: 'crop-paddy', pricePerQuintal: 2050, neededKg: 1000 },
    ],
    closesOn: 'Daily, closes 8 am',
  },
  {
    id: 'buyer-anand',
    name: 'Anand Traders',
    emoji: '🧑‍🌾',
    kind: 'Trader',
    location: 'Nagercoil',
    distanceKm: 12,
    pickup: 'Lifts from the field',
    payment: 'Cash on delivery',
    rating: 4.6,
    verified: true,
    contactName: 'Anand Kumar',
    phone: '+91 94420 11223',
    offers: [
      { cropId: 'crop-paddy', pricePerQuintal: 2150, neededKg: 5000 },
      { cropId: 'crop-tomato', pricePerQuintal: 3100, neededKg: 1200 },
    ],
    closesOn: 'Closes 04 Oct',
  },
  {
    id: 'buyer-rice-mill',
    name: 'Nagercoil Rice Mill',
    emoji: '🏭',
    kind: 'Mill',
    location: 'Nagercoil',
    distanceKm: 12,
    pickup: 'Mill lorry on request',
    payment: 'Bank transfer, 3 days',
    rating: 4.4,
    verified: true,
    contactName: 'Selvam P',
    phone: '+91 94435 70814',
    offers: [
      { cropId: 'crop-paddy', pricePerQuintal: 2280, neededKg: 8000 },
      { cropId: 'crop-maize', pricePerQuintal: 1790, neededKg: 3000 },
    ],
    closesOn: 'Closes 02 Oct',
  },
  {
    id: 'buyer-oil-mills',
    name: 'Thovalai Oil Mills',
    emoji: '🏭',
    kind: 'Mill',
    location: 'Thovalai',
    distanceKm: 18,
    pickup: 'Buyer arranges transport',
    payment: 'Half advance, rest on loading',
    rating: 4.3,
    verified: true,
    contactName: 'Ramya S',
    phone: '+91 96297 41180',
    offers: [
      { cropId: 'crop-maize', pricePerQuintal: 1820, neededKg: 2500 },
      { cropId: 'crop-paddy', pricePerQuintal: 2200, neededKg: 4000 },
    ],
    closesOn: 'Closes 06 Oct',
  },
  {
    id: 'buyer-coastal',
    name: 'Coastal Exports',
    emoji: '🚢',
    kind: 'Exporter',
    location: 'Kanyakumari',
    distanceKm: 26,
    pickup: 'Container pickup at the port',
    payment: 'Bank transfer on loading',
    rating: 4.7,
    verified: true,
    contactName: 'Iqbal S',
    phone: '+91 98430 55210',
    offers: [
      { cropId: 'crop-paddy', pricePerQuintal: 2350, neededKg: 10000 },
      { cropId: 'crop-tomato', pricePerQuintal: 3250, neededKg: 2000 },
    ],
    closesOn: 'Closes 08 Oct',
  },
];

/**
 * 📋 Sales already made, and requests still being discussed, newest first.
 *
 * One of each status is here on purpose, so the status labels on the cards can
 * be seen at a glance without having to change any data.
 */
export const DEMO_SALE_REQUESTS: readonly SaleRequest[] = [
  {
    id: 'sreq-tomato-vegmart',
    buyerId: 'buyer-vegmart',
    buyerName: 'Veg Mart',
    cropId: 'crop-tomato',
    quantityKg: 400,
    pricePerQuintal: 3350,
    status: 'Requested',
    requestedOn: '27 Sep 2026',
    note: 'Waiting for the buyer to confirm the morning rate.',
  },
  {
    id: 'sreq-paddy-rice-mill',
    buyerId: 'buyer-rice-mill',
    buyerName: 'Nagercoil Rice Mill',
    cropId: 'crop-paddy',
    quantityKg: 2500,
    pricePerQuintal: 2280,
    status: 'Accepted',
    requestedOn: '26 Sep 2026',
    note: 'Lorry lifts the bags from the farm shed on 02 Oct.',
  },
  {
    id: 'sreq-maize-anand',
    buyerId: 'buyer-anand',
    buyerName: 'Anand Traders',
    cropId: 'crop-maize',
    quantityKg: 1500,
    pricePerQuintal: 1850,
    status: 'Completed',
    requestedOn: '20 Sep 2026',
    note: 'Weighed at the yard and paid in full on delivery.',
  },
  {
    id: 'sreq-tomato-coastal',
    buyerId: 'buyer-coastal',
    buyerName: 'Coastal Exports',
    cropId: 'crop-tomato',
    quantityKg: 250,
    pricePerQuintal: 2900,
    status: 'Declined',
    requestedOn: '14 Sep 2026',
    note: 'Rate was below the market that day, so it was turned down.',
  },
];

/** Every status, in the order the count line and the badges list them. */
export const SALE_REQUEST_STATUS_ORDER: readonly SaleRequestStatus[] = [
  'Requested',
  'Accepted',
  'Completed',
  'Declined',
];

/** A buyer together with the offer they made for one crop. */
export type BuyerOfferMatch = {
  buyer: Buyer;
  offer: BuyerOffer;
};

/** One buyer's offer for one crop, or `undefined` when they do not buy it. */
export function offerFor(buyer: Buyer, cropId: string): BuyerOffer | undefined {
  return buyer.offers.find((offer) => offer.cropId === cropId);
}

/** Nearest buyer first, so the list starts with the easiest pickup. */
export function sortByDistance(buyers: readonly Buyer[]): Buyer[] {
  return [...buyers].sort((a, b) => a.distanceKm - b.distanceKm);
}

/** Everyone who wants one crop, nearest first. */
export function buyersForCrop(buyers: readonly Buyer[], cropId: string): Buyer[] {
  return sortByDistance(buyers.filter((buyer) => Boolean(offerFor(buyer, cropId))));
}

/** The distance a 📍 filter keeps. `all` keeps everybody. */
export function distanceInKm(filter: DistanceFilter): number {
  return (
    DISTANCE_FILTERS.find((option) => option.key === filter)?.km ?? Number.POSITIVE_INFINITY
  );
}

/** The wording of a 📍 filter, for the line under the chips. */
export function distanceFilterLabel(filter: DistanceFilter): string {
  return DISTANCE_FILTERS.find((option) => option.key === filter)?.label ?? 'All areas';
}

/** Keeps only the buyers inside the selected area, nearest first. */
export function buyersWithinDistance(
  buyers: readonly Buyer[],
  filter: DistanceFilter
): Buyer[] {
  const limit = distanceInKm(filter);

  return sortByDistance(buyers.filter((buyer) => buyer.distanceKm <= limit));
}

/**
 * The best rate offered for one crop, with the buyer offering it.
 *
 * Ties keep the buyer who appears first in the list, which is the nearest one,
 * so an equal rate never looks like an unexplained reorder.
 */
export function bestOfferFor(
  buyers: readonly Buyer[],
  cropId: string
): BuyerOfferMatch | undefined {
  let best: BuyerOfferMatch | undefined;

  for (const buyer of buyers) {
    const offer = offerFor(buyer, cropId);

    if (!offer) {
      continue;
    }

    if (!best || offer.pricePerQuintal > best.offer.pricePerQuintal) {
      best = { buyer, offer };
    }
  }

  return best;
}

/** 📦 How many buyers are looking for one crop. */
export function demandCount(buyers: readonly Buyer[], cropId: string): number {
  return buyers.filter((buyer) => Boolean(offerFor(buyer, cropId))).length;
}

/** 📦 What those buyers could take between them, in kilograms. */
export function totalDemandKg(buyers: readonly Buyer[], cropId: string): number {
  return Math.round(
    buyers.reduce((total, buyer) => total + (offerFor(buyer, cropId)?.neededKg ?? 0), 0)
  );
}

/** 💰 What the farmer expects for one lot, at the rate they are asking. */
export function expectedValue(lot: HarvestLot): number {
  return Math.round((lot.availableKg / KG_PER_QUINTAL) * lot.expectedPricePerQuintal);
}

/** 💰 What the whole lot list is worth at the asking rates. */
export function totalExpectedValue(lots: readonly HarvestLot[]): number {
  return lots.reduce((total, lot) => total + expectedValue(lot), 0);
}

/** ⚖️ Everything ready to sell, added up in kilograms. */
export function totalAvailableKg(lots: readonly HarvestLot[]): number {
  return Math.round(lots.reduce((total, lot) => total + lot.availableKg, 0));
}

/**
 * 💰 What the harvest would make if the best rate on the screen was taken.
 *
 * A lot nobody has bid on is counted at the asking rate rather than left out,
 * so the total never falls just because a crop is unusual.
 */
export function totalBestOfferValue(
  lots: readonly HarvestLot[],
  buyers: readonly Buyer[]
): number {
  return lots.reduce((total, lot) => {
    const best = bestOfferFor(buyers, lot.cropId);
    const rate = best?.offer.pricePerQuintal ?? lot.expectedPricePerQuintal;

    return total + Math.round((lot.availableKg / KG_PER_QUINTAL) * rate);
  }, 0);
}

/** 🔎 The gap between what a buyer pays and what the farmer asked, per quintal. */
export function priceGapPerQuintal(lot: HarvestLot, offer: BuyerOffer): number {
  return offer.pricePerQuintal - lot.expectedPricePerQuintal;
}

/** ⚖️ A weight in quintals, rounded to one decimal place for display. */
export function toQuintals(quantityKg: number): number {
  return Math.round((quantityKg / KG_PER_QUINTAL) * 10) / 10;
}

/** ⚖️ A weight written in quintals, for example "22 quintals" or "1 quintal". */
export function formatQuintals(quantityKg: number): string {
  const quintals = toQuintals(quantityKg);

  return `${quintals} ${quintals === 1 ? 'quintal' : 'quintals'}`;
}

/**
 * Picks the offer to talk about with a buyer.
 *
 * With a lot selected the offer for that crop is used, because that is the crop
 * the farmer is looking at. Otherwise the buyer's best-paying offer is used, so
 * tapping a buyer always opens a sheet with something to discuss. The farmer's
 * own lot for that crop comes along when there is one, so the sheet can say how
 * much of it the buyer could take.
 */
export function contactTargetFor(
  buyer: Buyer,
  cropId: string | null,
  lots: readonly HarvestLot[]
): ContactTarget | undefined {
  const preferred = cropId ? offerFor(buyer, cropId) : undefined;
  let best: BuyerOffer | undefined;

  for (const offer of buyer.offers) {
    if (!best || offer.pricePerQuintal > best.pricePerQuintal) {
      best = offer;
    }
  }

  const offer = preferred ?? best;

  if (!offer) {
    return undefined;
  }

  return {
    buyer,
    offer,
    lot: lots.find((lot) => lot.cropId === offer.cropId),
  };
}

/** 📦 How much of the lot a buyer would take: the smaller of the two figures. */
export function proposedQuantityKg(target: ContactTarget): number {
  const available = target.lot?.availableKg ?? target.offer.neededKg;

  return Math.round(Math.min(available, target.offer.neededKg));
}

/**
 * Builds the request that appears in 📋 My Sales / Buyer Requests.
 *
 * Nothing leaves the phone in demo mode, so the note records which button was
 * pressed. When the backend is connected this becomes the body of the POST, and
 * the status arrives from the server instead of starting at `Requested`.
 */
export function createSaleRequest(target: ContactTarget, channel: ContactChannel): SaleRequest {
  return {
    id: `sreq-${Date.now()}`,
    buyerId: target.buyer.id,
    buyerName: target.buyer.name,
    cropId: target.offer.cropId,
    quantityKg: proposedQuantityKg(target),
    pricePerQuintal: target.offer.pricePerQuintal,
    status: 'Requested',
    requestedOn: formatToday(),
    note: `${channel} request sent from the app. Waiting for the buyer to confirm.`,
  };
}

/** 📋 The newest request first, for the list at the bottom of the screen. */
export function requestsNewestFirst(requests: readonly SaleRequest[]): SaleRequest[] {
  return [...requests].sort((a, b) => compareDisplayDates(a.requestedOn, b.requestedOn));
}

/** 💰 What one request is worth, at the rate agreed for it. */
export function requestValue(request: SaleRequest): number {
  return Math.round((request.quantityKg / KG_PER_QUINTAL) * request.pricePerQuintal);
}

/** 📋 How many requests are in one state. */
export function countByStatus(
  requests: readonly SaleRequest[],
  status: SaleRequestStatus
): number {
  return requests.filter((request) => request.status === status).length;
}

/**
 * 📋 The states that actually appear, written as "2 accepted · 1 completed".
 *
 * States with nothing in them are left out rather than shown as a row of zeros,
 * so the line stays worth reading when there is only one request.
 */
export function describeRequestCounts(requests: readonly SaleRequest[]): string {
  const counted = SALE_REQUEST_STATUS_ORDER.map((status) => ({
    status,
    count: countByStatus(requests, status),
  }))
    .filter((entry) => entry.count > 0)
    .map((entry) => `${entry.count} ${entry.status.toLowerCase()}`);

  return counted.length === 0 ? 'Nothing yet' : counted.join(' · ');
}

/**
 * Newest first.
 *
 * When a date cannot be parsed the two entries keep their existing order, so one
 * bad date can never push a good request off the top of the list. Dates are
 * stored as text, so they are read back with the journal's `parseDisplayDate`
 * rather than `new Date(string)`, which is not reliable on every phone.
 */
function compareDisplayDates(a: string, b: string): number {
  const first = parseDisplayDate(a);
  const second = parseDisplayDate(b);

  if (!first || !second) {
    return 0;
  }

  return second.getTime() - first.getTime();
}
