/**
 * Machinery Marketplace model and demo data.
 *
 * Lists the farm machinery available for rent or sale, closest to the farmer's
 * farm. Each listing carries what a farmer checks before calling an owner: the
 * machine type, where it is and how far, the offer and price, when it is free,
 * and the owner's phone number.
 *
 * All of this is local demo data. There is no API call, and the shapes below are
 * what a listings endpoint is expected to return later. The phone numbers are
 * demo values too, written in the same format the rest of the app uses.
 */

import type { ListingTone } from '@/models/marketplace';

/** Whether a machine is offered for rent or for sale. */
export type MachineOffer = 'Rent' | 'Buy';

/** Selectable filter. `all` shows every offer at once. */
export type MachineFilter = MachineOffer | 'all';

/** One piece of farm machinery listed as available. */
export type MachineListing = {
  id: string;
  /** Emoji shown in place of a photo until real images are available. */
  emoji: string;
  title: string;
  /** What sort of machine it is, for example "Tractor". */
  machineType: string;
  location: string;
  /** Straight-line distance from the farm, in kilometres. */
  distanceKm: number;
  offer: MachineOffer;
  /** Price text, already formatted for display. */
  price: string;
  /** When the machine is free, in words a farmer can plan around. */
  availability: string;
  /** The person or shop a farmer should call. */
  owner: string;
  /** Display phone number, for example "+91 98470 11230". */
  phone: string;
  /** One useful line about the machine itself. */
  note: string;
  /** Accent used for the card placeholder, the same tones the marketplace uses. */
  tone: ListingTone;
};

/** Filter buttons: every offer, or just rent, or just buying. */
export const MACHINE_FILTERS: readonly {
  key: MachineFilter;
  label: string;
  emoji: string;
}[] = [
  { key: 'all', label: 'All', emoji: '\u{1F69C}' },
  { key: 'Rent', label: 'Rent', emoji: '\u{1F511}' },
  { key: 'Buy', label: 'Buy', emoji: '\u{1F3F7}\uFE0F' },
];

/**
 * 🚜 The machinery near this farm.
 *
 * The first three line up with the machinery in the marketplace so the two
 * screens tell the same story, and the rest fill out the rent / buy mix.
 */
export const DEMO_MACHINE_LISTINGS: readonly MachineListing[] = [
  {
    id: 'mach-tractor-575',
    emoji: '\u{1F69C}',
    title: 'Mahindra 575 Tractor',
    machineType: 'Tractor',
    location: 'Thovalai',
    distanceKm: 3,
    offer: 'Rent',
    price: '\u20B91,800 / day',
    availability: 'Available this week',
    owner: 'Kumar Equipment',
    phone: '+91 98470 11230',
    note: '45 HP, 2019 model, trailer included.',
    tone: 'green',
  },
  {
    id: 'mach-transplanter-6',
    emoji: '\u{1F331}',
    title: 'Paddy Transplanter',
    machineType: 'Transplanter',
    location: 'Kanyakumari',
    distanceKm: 2.5,
    offer: 'Rent',
    price: '\u20B92,400 / day',
    availability: 'Free from 5 Oct',
    owner: 'S. Murugan',
    phone: '+91 98470 55231',
    note: 'Works 0.5 acre in a morning, operator available.',
    tone: 'blue',
  },
  {
    id: 'mach-sprayer-16',
    emoji: '\u{1F4A6}',
    title: 'Power Sprayer 16L',
    machineType: 'Power Sprayer',
    location: 'Agasteeswar',
    distanceKm: 5,
    offer: 'Rent',
    price: '\u20B9600 / day',
    availability: 'Available on weekends',
    owner: 'Farm Tools Hub',
    phone: '+91 89990 74055',
    note: 'Petrol start, good working condition.',
    tone: 'gold',
  },
  {
    id: 'mach-cultivator-7',
    emoji: '\u{1F332}',
    title: '7 Tine Cultivator',
    machineType: 'Cultivator',
    location: 'Nagercoil',
    distanceKm: 4,
    offer: 'Buy',
    price: '\u20B928,000',
    availability: 'Can inspect any day',
    owner: 'R. Devi',
    phone: '+91 98650 11432',
    note: 'Sturdy tines, used one season, sharp.',
    tone: 'earth',
  },
  {
    id: 'mach-pump-5hp',
    emoji: '\u{1F4A7}',
    title: '5 HP Water Pump',
    machineType: 'Water Pump',
    location: 'Marthapuram',
    distanceKm: 6,
    offer: 'Buy',
    price: '\u20B915,500',
    availability: 'Available from 12 Oct',
    owner: 'K. Lakshmi',
    phone: '+91 75982 33019',
    note: 'Diesel start, pulls from a 20 m well.',
    tone: 'blue',
  },
  {
    id: 'mach-combine',
    emoji: '\u{2699}\uFE0F',
    title: 'Combine Harvester',
    machineType: 'Combine Harvester',
    location: 'Rajakkamangalam',
    distanceKm: 8,
    offer: 'Buy',
    price: '\u20B94,20,000',
    availability: 'Free from next week',
    owner: 'Kumar Equipment',
    phone: '+91 98470 11230',
    note: 'Used three seasons, fully serviced.',
    tone: 'earth',
  },
];

/** Listings for one offer. `all` returns everything in demo order. */
export function filterMachineListings(
  listings: readonly MachineListing[],
  filter: MachineFilter
): MachineListing[] {
  return filter === 'all'
    ? [...listings]
    : listings.filter((listing) => listing.offer === filter);
}

/**
 * Searches by machine type, title, place, owner and note, so a farmer can type
 * "tractor", a place, or an owner's name.
 *
 * A blank query returns the full list, so the screen just shows what is there.
 */
export function searchMachineListings(
  listings: readonly MachineListing[],
  query: string
): MachineListing[] {
  const needle = query.trim().toLowerCase();

  if (needle === '') {
    return [...listings];
  }

  return listings.filter((listing) =>
    [
      listing.machineType,
      listing.title,
      listing.location,
      listing.owner,
      listing.note,
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  );
}

/** 📍 How far the machine is, in words a farmer can judge against their own travel. */
export function machineDistanceLabel(distanceKm: number): string {
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