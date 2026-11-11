/**
 * Nearby Land model and demo data.
 *
 * Lists the farmland available to rent or buy, closest to the farmer's farm.
 * Every listing carries what a farmer actually checks before calling an owner:
 * where the plot is and how far, its size, the offer and price, the crop it is
 * good for, and the owner's phone number.
 *
 * All of this is local demo data. There is no API call, and the shapes below are
 * what a listings endpoint is expected to return later. The phone numbers are
 * demo values too, written in the same format the rest of the app uses.
 */

import type { ListingTone } from '@/models/marketplace';

/** Whether a plot is offered for rent or for sale. */
export type LandOffer = 'Rent' | 'Buy';

/** Selectable filter. `all` shows every offer at once. */
export type LandFilter = LandOffer | 'all';

/** One piece of farmland listed as available. */
export type LandListing = {
  id: string;
  /** Emoji shown in place of a photo until real images are available. */
  emoji: string;
  title: string;
  location: string;
  /** Straight-line distance from the farm, in kilometres. */
  distanceKm: number;
  /** Size in acres, for example "2.5". */
  areaAcres: string;
  offer: LandOffer;
  /** Price text, already formatted for display. */
  price: string;
  /** The crop this plot suits, for example "Paddy". */
  suitableCrop: string;
  /** How the plot is watered, which decides what can grow on it. */
  irrigation: string;
  /** The person a farmer should call. */
  owner: string;
  /** Display phone number, for example "+91 98470 55231". */
  phone: string;
  /** One useful line about the plot itself. */
  note: string;
  /** Accent used for the card placeholder, the same tones the marketplace uses. */
  tone: ListingTone;
};

/** Filter buttons: every offer, or just rent, or just buying. */
export const LAND_FILTERS: readonly {
  key: LandFilter;
  label: string;
  emoji: string;
}[] = [
  { key: 'all', label: 'All', emoji: '\u{1F3DE}' },
  { key: 'Rent', label: 'Rent', emoji: '\u{1F511}' },
  { key: 'Buy', label: 'Buy', emoji: '\u{1F3F7}\uFE0F' },
];

/**
 * 🏞️ The plots near this farm.
 *
 * Locations and crops line up with the marketplace and the farming guide, so
 * the same vocabulary one screen uses is the vocabulary this one does.
 */
export const DEMO_LAND_LISTINGS: readonly LandListing[] = [
  {
    id: 'land-paddy-0-8',
    emoji: '\u{1F33E}',
    title: '0.8 Acre Paddy Plot',
    location: 'Kanyakumari',
    distanceKm: 2.5,
    areaAcres: '0.8',
    offer: 'Rent',
    price: '\u20B912,000 / month',
    suitableCrop: 'Paddy',
    irrigation: 'Canal water available',
    owner: 'S. Murugan',
    phone: '+91 98470 55231',
    note: 'Flat and low-lying, easy to keep flooded for paddy.',
    tone: 'green',
  },
  {
    id: 'land-vegetables-1-2',
    emoji: '\u{1F33D}',
    title: '1.2 Acre Vegetable Plot',
    location: 'Nagercoil',
    distanceKm: 4,
    areaAcres: '1.2',
    offer: 'Rent',
    price: '\u20B98,000 / month',
    suitableCrop: 'Vegetables',
    irrigation: 'Well with drip lines laid',
    owner: 'A. Selvam',
    phone: '+91 94431 20876',
    note: 'Fenced, with a small store shed by the road.',
    tone: 'gold',
  },
  {
    id: 'land-millets-2',
    emoji: '\u{1F33E}',
    title: '2 Acre Millets Field',
    location: 'Agasteeswar',
    distanceKm: 5,
    areaAcres: '2',
    offer: 'Buy',
    price: '\u20B93,60,000',
    suitableCrop: 'Millets',
    irrigation: 'Rain-fed',
    owner: 'M. Arumugam',
    phone: '+91 89990 74055',
    note: 'Open field, good for dryland crops.',
    tone: 'earth',
  },
  {
    id: 'land-coconut-3',
    emoji: '\u{1F965}',
    title: '3 Acre Coconut Orchard',
    location: 'Thovalai',
    distanceKm: 6,
    areaAcres: '3',
    offer: 'Buy',
    price: '\u20B97,20,000',
    suitableCrop: 'Coconut',
    irrigation: 'Well on site',
    owner: 'R. Devi',
    phone: '+91 98650 11432',
    note: '350 palms, about five years old and bearing well.',
    tone: 'earth',
  },
  {
    id: 'land-banana-0-5',
    emoji: '\u{1F34C}',
    title: '0.5 Acre Banana Plot',
    location: 'Marthapuram',
    distanceKm: 8,
    areaAcres: '0.5',
    offer: 'Rent',
    price: '\u20B96,500 / month',
    suitableCrop: 'Banana',
    irrigation: 'Pond nearby',
    owner: 'K. Lakshmi',
    phone: '+91 75982 33019',
    note: 'Tissue-culture suckers already planted last season.',
    tone: 'green',
  },
  {
    id: 'land-groundnut-1-5',
    emoji: '\u{1F95C}',
    title: '1.5 Acre Groundnut Plot',
    location: 'Rajakkamangalam',
    distanceKm: 10,
    areaAcres: '1.5',
    offer: 'Buy',
    price: '\u20B94,00,000',
    suitableCrop: 'Groundnut',
    irrigation: 'Shared borewell',
    owner: 'P. Kannan',
    phone: '+91 98433 61107',
    note: 'Sandy soil that warms up fast in the sun.',
    tone: 'gold',
  },
];

/** Listings for one offer. `all` returns everything in demo order. */
export function filterLandListings(
  listings: readonly LandListing[],
  filter: LandFilter
): LandListing[] {
  return filter === 'all'
    ? [...listings]
    : listings.filter((listing) => listing.offer === filter);
}

/**
 * Searches by plot title, place, suitable crop, owner and note, so a farmer can
 * type a crop like "paddy", an area, or an owner's name.
 *
 * A blank query returns the full list, so the screen just shows what is there.
 */
export function searchLandListings(
  listings: readonly LandListing[],
  query: string
): LandListing[] {
  const needle = query.trim().toLowerCase();

  if (needle === '') {
    return [...listings];
  }

  return listings.filter((listing) =>
    [listing.title, listing.location, listing.suitableCrop, listing.owner, listing.note]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  );
}

/** 📍 How far a plot is, in words a farmer can judge against their own travel. */
export function distanceLabel(distanceKm: number): string {
  if (distanceKm < 1) {
    return 'Less than 1 km away';
  }

  const rounded = Math.round(distanceKm * 10) / 10;
  return rounded === Math.floor(rounded)
    ? `${rounded} km away`
    : `${rounded.toFixed(1)} km away`;
}

/** 📞 The URL the contact row opens, with only the digits a dialler accepts. */
export function ownerPhoneUrl(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}