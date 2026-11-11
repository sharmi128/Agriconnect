/**
 * Buyers directory model.
 *
 * The Buyer Connection screen is a journey that starts from the farmer's own
 * harvest: what is ready, what it is worth, who will take it. This model backs
 * the opposite question, which is "who is buying, and what do they want".
 *
 * The buyers themselves are not repeated here. `models/buyer-connection.ts` already
 * holds the demo list, with each buyer's 📍 location, 📦 required quantity, 💰 rate
 * and 📞 number on their offers, and the two screens are far more useful reading
 * the same buyers than each keeping a private copy that could drift apart. This
 * file adds only what a directory needs and a sale flow does not: 🔎 free-text
 * search, a 🌱 crop filter, and a demand summary that adds the offers together.
 *
 * Like everything else in the app this is local demo data. There is no API call,
 * and these helpers are the shape a buyers endpoint would be expected to return.
 */

import {
  DEMO_BUYERS,
  buyersWithinDistance,
  offerFor,
  sortByDistance,
  type Buyer,
  type BuyerOffer,
  type DistanceFilter,
  type HarvestLot,
} from '@/models/buyer-connection';
import { DEMO_JOURNAL_CROPS, findCrop, type JournalCrop } from '@/models/crop-journal';

/**
 * The crop ids the farmer actually grows in the journal, in display order.
 *
 * Only these can ever be offered for, because an offer points at a journal crop
 * for its name, emoji and field. Reading them from the journal rather than from
 * the buyers means the 🌱 filter cannot offer a crop that has no entry to show.
 */
export const DEMO_BUYER_CROPS: readonly JournalCrop[] = DEMO_JOURNAL_CROPS;

/** 📦💰🌱 What the buyers in view want, added up per crop. */
export type CropDemand = {
  cropId: string;
  name: string;
  emoji: string;
  /** How many of the buyers in view want this crop. */
  buyerCount: number;
  /** 📦 How much they want between them. */
  wantedKg: number;
  /** 💰 The best rate on offer for it. */
  bestPricePerQuintal: number;
  /** Which buyer is paying that best rate. */
  bestBuyerName: string;
  /** 📍 How far that buyer is from the farm. */
  bestBuyerDistanceKm: number;
  /** What the farmer has ready, when they have a lot of this crop. */
  availableKg?: number;
  /** What the farmer is asking for it, in rupees per quintal. */
  expectedPricePerQuintal?: number;
};

/** One button in the 🌱 crop filter row. */
export type CropFilterOption = {
  /** `null` on the "All crops" button, which clears the crop filter. */
  cropId: string | null;
  label: string;
  emoji: string;
  /** How many buyers in the full list want this crop. */
  count: number;
};

/**
 * 🌱 The crop filter buttons: every crop first, then one per crop that a buyer
 * actually wants.
 *
 * The counts come from the whole buyer list rather than the filtered one, so the
 * buttons keep saying how much demand there is even while a search box is
 * narrowing the list underneath. Crops nobody wants are left out entirely, because
 * a button that can only ever show an empty list is worse than no button.
 */
export function cropFilterOptions(
  buyers: readonly Buyer[] = DEMO_BUYERS,
  crops: readonly JournalCrop[] = DEMO_BUYER_CROPS
): CropFilterOption[] {
  const options: CropFilterOption[] = [
    { cropId: null, label: 'All crops', emoji: '🌾', count: buyers.length },
  ];

  for (const crop of crops) {
    const count = buyers.filter((buyer) => Boolean(offerFor(buyer, crop.id))).length;

    if (count === 0) {
      continue;
    }

    options.push({ cropId: crop.id, label: crop.name, emoji: crop.emoji, count });
  }

  return options;
}

/**
 * 🔎 Whether a buyer matches what the farmer typed.
 *
 * A single `includes` over everything a farmer might reasonably type beats a
 * field-by-field match here: the list is five buyers, and the point of the box is
 * that "rice", "12 km" and "Kumar" all work without being taught the exact
 * wording. Crop names are searched too, because "paddy" is the word a farmer
 * actually has in mind when they want to know who is buying it.
 */
export function matchesBuyerQuery(
  buyer: Buyer,
  query: string,
  crops: readonly JournalCrop[] = DEMO_BUYER_CROPS
): boolean {
  const needle = query.trim().toLowerCase();

  if (needle === '') {
    return true;
  }

  const cropWords = buyer.offers
    .map((offer) => {
      const crop = findCrop(crops, offer.cropId);

      return `${crop?.name ?? ''} ${crop?.variety ?? ''}`;
    })
    .join(' ');

  return [
    buyer.name,
    buyer.kind,
    buyer.location,
    buyer.contactName,
    buyer.phone,
    buyer.pickup,
    buyer.payment,
    buyer.closesOn,
    cropWords,
  ]
    .join(' ')
    .toLowerCase()
    .includes(needle);
}

/**
 * 🌾 The buyer list the page shows: buyers wanting this crop, inside this area,
 * matching this search, nearest first.
 *
 * The three filters are applied in the order a farmer sets them, and each one
 * narrows the same list, so the count under the search box can never describe a
 * different set of buyers from the cards below it. Nearest stays last so the
 * result is ordered by pickup distance rather than by whatever order the search
 * happened to leave behind.
 */
export function filterBuyers(
  buyers: readonly Buyer[],
  options: {
    query: string;
    /** `null` shows buyers for every crop. */
    cropId: string | null;
    distance: DistanceFilter;
  },
  crops: readonly JournalCrop[] = DEMO_BUYER_CROPS
): Buyer[] {
  const { query, cropId, distance } = options;

  const byCrop = cropId
    ? buyers.filter((buyer) => Boolean(offerFor(buyer, cropId)))
    : [...buyers];

  const byArea = buyersWithinDistance(byCrop, distance);

  return sortByDistance(byArea.filter((buyer) => matchesBuyerQuery(buyer, query, crops)));
}

/**
 * 📦🌱💰 Adds the buyers in view together, one line per crop.
 *
 * The summary is worked out from whichever buyers are on screen, so it always
 * describes the same set the farmer is looking at. A crop nobody wants is left
 * out, and so is one the farmer has no lot for, because a row with no asking rate
 * beside the best rate would look like a disagreement that is not there.
 */
export function cropDemand(
  buyers: readonly Buyer[],
  lots: readonly HarvestLot[],
  crops: readonly JournalCrop[] = DEMO_BUYER_CROPS
): CropDemand[] {
  const demand: CropDemand[] = [];

  for (const crop of crops) {
    const wanted = buyers
      .map((buyer) => ({ buyer, offer: offerFor(buyer, crop.id) }))
      .filter((entry): entry is { buyer: Buyer; offer: BuyerOffer } => Boolean(entry.offer));

    if (wanted.length === 0) {
      continue;
    }

    // Every buyer in the list is offered the same crop, so one comparison decides
    // the best rate and the buyer paying it.
    let best = wanted[0];

    for (const entry of wanted) {
      if (entry.offer.pricePerQuintal > best.offer.pricePerQuintal) {
        best = entry;
      }
    }

    const lot = lots.find((entry) => entry.cropId === crop.id);

    demand.push({
      cropId: crop.id,
      name: crop.name,
      emoji: crop.emoji,
      buyerCount: wanted.length,
      wantedKg: wanted.reduce((total, entry) => total + entry.offer.neededKg, 0),
      bestPricePerQuintal: best.offer.pricePerQuintal,
      bestBuyerName: best.buyer.name,
      bestBuyerDistanceKm: best.buyer.distanceKm,
      availableKg: lot?.availableKg,
      expectedPricePerQuintal: lot?.expectedPricePerQuintal,
    });
  }

  return demand;
}

/**
 * 💰 The gap between the best rate on offer and the farmer's asking rate.
 *
 * A positive number means the buyer is paying more than the farmer wanted, which
 * is the row worth reading carefully. Returns `null` when the farmer has no lot
 * of that crop, because there is no asking rate to compare against.
 */
export function priceGap(demand: CropDemand): number | null {
  if (demand.expectedPricePerQuintal === undefined) {
    return null;
  }

  return demand.bestPricePerQuintal - demand.expectedPricePerQuintal;
}

/** 📦 Whether the buyers shown could take everything the farmer has ready. */
export function demandCoversHarvest(demand: CropDemand): boolean {
  if (demand.availableKg === undefined) {
    return false;
  }

  return demand.wantedKg >= demand.availableKg;
}

/**
 * The line under the search box, describing what is on screen.
 *
 * Every part of it is dropped when it is not filtering, so with nothing chosen the
 * line reads as a plain count rather than a sentence full of "all".
 */
export function describeBuyerResults(
  shown: number,
  total: number,
  options: {
    query: string;
    cropId: string | null;
    cropLabel: string | null;
    distanceLabel: string;
  }
): string {
  const parts: string[] = [];

  if (options.query.trim() !== '') {
    parts.push(`matching "${options.query.trim()}"`);
  }

  if (options.cropId !== null && options.cropLabel) {
    parts.push(`wanting ${options.cropLabel}`);
  }

  if (options.distanceLabel !== 'All areas') {
    parts.push(options.distanceLabel.toLowerCase());
  }

  const count = `${shown} of ${total} ${total === 1 ? 'buyer' : 'buyers'}`;

  return parts.length === 0 ? count : `${count} · ${parts.join(' · ')}`;
}
