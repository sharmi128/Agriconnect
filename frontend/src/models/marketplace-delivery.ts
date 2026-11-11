/**
 * Delivery details, delivery options and the demo order record for checkout.
 *
 * This is the step between the cart and a placed order: where the things are
 * going, how fast they should get there, and what that comes to. The cart model
 * holds listing ids, because a shortlist should follow a price change. An order
 * does the opposite — once a farmer has placed an order, the name, the quantity
 * and the price they agreed to must not move when the demo data is edited, so
 * `PlacedOrder` takes a snapshot of each line rather than a reference back to
 * the listing.
 *
 * The delivery options and their charges are demo figures. There is no courier,
 * no distance calculation and no payment step: the charge is a flat number per
 * option, stated on the option itself, so a farmer can see exactly what fast
 * delivery costs before choosing it.
 *
 * The date arithmetic is written by hand rather than through `Intl`, for the
 * same reason the marketplace model avoids it: `toLocaleDateString` is not
 * reliably available on every Hermes build.
 */

import type { CartLine } from '@/models/marketplace-cart';
import {
  cartLineTotal,
  cartSubtotal,
  formatMarketplaceAmount,
  resolveCartLines,
} from '@/models/marketplace-cart';
import type { ListingTone, MarketplaceListing } from '@/models/marketplace';
import {
  listingImageKey,
  parseMarketplaceImageKey,
  type MarketplaceImageKey,
} from '@/models/marketplace-images';
import { validateFullName, validatePhone, type FieldErrors } from '@/utils/validation';

/** The two speeds an order can be sent at. */
export type DeliveryOptionId = 'standard' | 'fast';

/**
 * One delivery speed: what it is called, how long it takes, and what the demo
 * charge is. The charge is a flat amount per order, not per item, because a
 * courier charges for the trip rather than for the parcel count.
 */
export type DeliveryOption = {
  id: DeliveryOptionId;
  /** The truck or the bolt, drawn on the option row. */
  emoji: string;
  title: string;
  /** One line under the title, so the choice is not made on the days alone. */
  blurb: string;
  /** Soonest the parcel arrives, in days from today. */
  minDays: number;
  /** Latest the parcel arrives, in days from today. */
  maxDays: number;
  /** Demo delivery charge in rupees, charged once per order. */
  charge: number;
};

/**
 * The delivery options, slowest first.
 *
 * Standard is the default because a seed packet or a hand tool arriving in three
 * to five days costs the farmer nothing extra, and most of what the marketplace
 * sells is not urgent. Fast exists for the case where it is: an item that has
 * to be in the field this week.
 */
export const DELIVERY_OPTIONS: readonly DeliveryOption[] = [
  {
    id: 'standard',
    emoji: '\u{1F69A}',
    title: 'Standard Delivery',
    blurb: 'Sent with the next village van',
    minDays: 3,
    maxDays: 5,
    charge: 40,
  },
  {
    id: 'fast',
    emoji: '\u26A1',
    title: 'Fast Delivery',
    blurb: 'Prioritised, and moved first off the van',
    minDays: 1,
    maxDays: 2,
    charge: 90,
  },
];

/** The option a farmer gets when they have not chosen one. */
export const DEFAULT_DELIVERY_OPTION: DeliveryOptionId = 'standard';

/**
 * Where an order is going.
 *
 * Kept as the eight fields a farmer is actually asked for, rather than one
 * free-text line: a delivery agent reads the door number, the street and the PIN
 * code off different parts of a label, and a village name is often enough on its
 * own for the agent but not for a sorting machine.
 */
export type DeliveryAddress = {
  fullName: string;
  phone: string;
  /** House or door number. */
  houseNumber: string;
  /** Street, or the village name when there is no street. */
  street: string;
  city: string;
  district: string;
  state: string;
  /** Indian PIN code: exactly six digits. */
  pinCode: string;
};

/** A fresh delivery form: nothing typed, nothing saved. */
export const EMPTY_DELIVERY_ADDRESS: DeliveryAddress = {
  fullName: '',
  phone: '',
  houseNumber: '',
  street: '',
  city: '',
  district: '',
  state: '',
  pinCode: '',
};

/** How many digits a PIN code is. */
export const PIN_CODE_LENGTH = 6;

/** A stored order line: what was ordered, and what it came to at the time. */
export type OrderLine = {
  listingId: string;
  /** Snapshot of the listing title, so the order never renames itself. */
  name: string;
  /** Which local photograph the line is drawn with, snapshotted the same way. */
  image: MarketplaceImageKey;
  emoji: string;
  tone: ListingTone;
  /** Snapshot of the listing's price string, for example "₹1,800 / day". */
  unitPrice: string;
  quantity: number;
  lineTotal: number;
};

/** One placed order, as the confirmation and View Order screens read it. */
export type PlacedOrder = {
  id: string;
  /** ISO timestamp of when the farmer pressed Place Order. */
  placedAt: string;
  lines: OrderLine[];
  address: DeliveryAddress;
  deliveryOptionId: DeliveryOptionId;
  itemsTotal: number;
  deliveryCharge: number;
  grandTotal: number;
  /** ISO date the parcel is expected by, worked out from the chosen option. */
  estimatedDeliveryDate: string;
};

/** Everything the checkout screens need to know before the order exists. */
export type OrderDraft = {
  lines: OrderLine[];
  address: DeliveryAddress;
  deliveryOptionId: DeliveryOptionId;
  itemsTotal: number;
  deliveryCharge: number;
  grandTotal: number;
  /** ISO date the parcel is expected by, worked out from the chosen option. */
  estimatedDeliveryDate: string;
};

/** The one line of numbers between the cart and the grand total. */
export type OrderTotals = {
  itemsTotal: number;
  deliveryCharge: number;
  grandTotal: number;
};

/** Looks up one option by id, always returning something drawable. */
export function deliveryOptionById(id: DeliveryOptionId): DeliveryOption {
  return (
    DELIVERY_OPTIONS.find((option) => option.id === id) ??
    (DELIVERY_OPTIONS[0] as DeliveryOption)
  );
}

/**
 * Reads a stored or URL-supplied id back into a real option id.
 *
 * A deep link could name anything, so an unknown value falls back to standard
 * rather than leaving the checkout with a charge it cannot quote.
 */
export function toDeliveryOptionId(value: unknown): DeliveryOptionId {
  return DELIVERY_OPTIONS.some((option) => option.id === value)
    ? (value as DeliveryOptionId)
    : DEFAULT_DELIVERY_OPTION;
}

/** "3–5 days", the estimate shown on the option and on the confirmation. */
export function deliveryEstimateLabel(option: DeliveryOption): string {
  return option.minDays === option.maxDays
    ? `${option.maxDays} day`
    : `${option.minDays}–${option.maxDays} days`;
}

/** The demo charge as a rupee amount, or "Free" when the option costs nothing. */
export function deliveryChargeLabel(charge: number): string {
  return charge > 0 ? formatMarketplaceAmount(charge) : 'Free';
}

/** The latest day the parcel can arrive, as a date. */
export function estimatedDeliveryDate(option: DeliveryOption, from: Date = new Date()): Date {
  return new Date(from.getTime() + option.maxDays * 24 * 60 * 60 * 1000);
}

/** "Fri, 12 Sep", spelled out rather than passed through the locale. */
export function formatDeliveryDate(value: Date): string {
  return `${SHORT_DAYS[value.getDay()]}, ${value.getDate()} ${SHORT_MONTHS[value.getMonth()]}`;
}

/** The delivery date of a placed order, read back from its stored ISO string. */
export function placedOrderDeliveryLabel(order: PlacedOrder): string {
  const date = new Date(order.estimatedDeliveryDate);

  return Number.isNaN(date.getTime()) ? 'To be confirmed' : formatDeliveryDate(date);
}

/** "Placed today at 4:35 pm", for the View Order screen. */
export function placedOrderPlacedLabel(order: PlacedOrder): string {
  const date = new Date(order.placedAt);

  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = date.getHours() < 12 ? 'am' : 'pm';

  return `Placed today at ${hours}:${minutes} ${meridiem}`;
}

/** The option's charge added to the items, and nothing else. */
export function orderTotals(itemsTotal: number, deliveryOptionId: DeliveryOptionId): OrderTotals {
  const deliveryCharge = deliveryOptionById(deliveryOptionId).charge;
  const safeItems = Number.isFinite(itemsTotal) && itemsTotal > 0 ? itemsTotal : 0;

  return {
    itemsTotal: safeItems,
    deliveryCharge,
    grandTotal: safeItems + deliveryCharge,
  };
}

/**
 * Turns the cart into the lines an order will remember.
 *
 * The quantity and the line total are read from the cart and the live listing,
 * so a line can never be placed at a price the farmer was not shown. Lines whose
 * listing has gone missing are dropped, exactly as they are on the cart screen.
 */
export function orderLinesFrom(
  cart: readonly CartLine[],
  listings: readonly MarketplaceListing[]
): OrderLine[] {
  return resolveCartLines(cart, listings).map(({ listing, line }) => ({
    listingId: listing.id,
    name: listing.title,
    image: listingImageKey(listing.id),
    emoji: listing.emoji,
    tone: listing.tone,
    unitPrice: listing.price,
    quantity: line.quantity,
    lineTotal: cartLineTotal(listing, line.quantity),
  }));
}

/**
 * Builds the whole draft the delivery screen previews and the order records.
 *
 * The items total comes from the cart model rather than from summing the lines,
 * so the two can never disagree on screen: the same function that draws the
 * cart total is the one that decides what is charged.
 */
export function buildOrderDraft(
  cart: readonly CartLine[],
  listings: readonly MarketplaceListing[],
  address: DeliveryAddress,
  deliveryOptionId: DeliveryOptionId
): OrderDraft {
  const option = deliveryOptionById(deliveryOptionId);
  const totals = orderTotals(cartSubtotal(cart, listings), deliveryOptionId);

  return {
    lines: orderLinesFrom(cart, listings),
    address,
    deliveryOptionId: option.id,
    itemsTotal: totals.itemsTotal,
    deliveryCharge: totals.deliveryCharge,
    grandTotal: totals.grandTotal,
    estimatedDeliveryDate: estimatedDeliveryDate(option).toISOString(),
  };
}

/** Turns a draft into a placed order, stamped with a demo id and a time. */
export function buildPlacedOrder(
  draft: OrderDraft,
  now: Date = new Date(),
  orderId: string = buildDemoOrderId()
): PlacedOrder {
  return { ...draft, id: orderId, placedAt: now.toISOString() };
}

/**
 * The characters an order id is drawn from.
 *
 * I, O, 0 and 1 are left out, because a farmer reading an id back over the phone
 * should not have to guess whether it is a letter or a digit.
 */
const ORDER_ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** How many characters after the prefix. */
const ORDER_ID_LENGTH = 6;

/** A demo order id such as `AGRI-K7M2QP`. Not a real order number. */
export function buildDemoOrderId(random: () => number = Math.random): string {
  let id = '';

  for (let index = 0; index < ORDER_ID_LENGTH; index += 1) {
    id += ORDER_ID_ALPHABET.charAt(Math.floor(random() * ORDER_ID_ALPHABET.length));
  }

  return `AGRI-${id}`;
}

/** Strips a stored address down to its eight trimmed strings. */
export function normaliseDeliveryAddress(value: unknown): DeliveryAddress {
  if (typeof value !== 'object' || value === null) {
    return { ...EMPTY_DELIVERY_ADDRESS };
  }

  const stored = value as Record<string, unknown>;

  return {
    fullName: readString(stored.fullName),
    phone: readString(stored.phone),
    houseNumber: readString(stored.houseNumber),
    street: readString(stored.street),
    city: readString(stored.city),
    district: readString(stored.district),
    state: readString(stored.state),
    pinCode: readString(stored.pinCode),
  };
}

/**
 * Reads a stored order back, dropping anything malformed.
 *
 * An order with no lines or no id is not worth keeping, so a half-written record
 * from an app that closed mid-save is skipped rather than shown as a blank
 * receipt. Everything else falls back field by field, so an order written by an
 * older build still opens.
 */
export function normalisePlacedOrder(value: unknown): PlacedOrder | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const stored = value as Record<string, unknown>;
  const id = readString(stored.id);
  const lines = Array.isArray(stored.lines)
    ? stored.lines.map(normaliseOrderLine).filter((line): line is OrderLine => line !== null)
    : [];

  if (id.length === 0 || lines.length === 0) {
    return null;
  }

  return {
    id,
    placedAt: readString(stored.placedAt),
    lines,
    address: normaliseDeliveryAddress(stored.address),
    deliveryOptionId: toDeliveryOptionId(stored.deliveryOptionId),
    itemsTotal: readAmount(stored.itemsTotal),
    deliveryCharge: readAmount(stored.deliveryCharge),
    grandTotal: readAmount(stored.grandTotal),
    estimatedDeliveryDate: readString(stored.estimatedDeliveryDate),
  };
}

/** Reads a stored line, or `null` when it has no name or no quantity. */
function normaliseOrderLine(value: unknown): OrderLine | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const stored = value as Record<string, unknown>;
  const name = readString(stored.name);
  const quantity = Math.round(readAmount(stored.quantity));

  if (name.length === 0 || quantity < 1) {
    return null;
  }

  const listingId = readString(stored.listingId);

  return {
    listingId,
    name,
    image: parseMarketplaceImageKey(stored.image, listingImageKey(listingId)),
    emoji: readString(stored.emoji),
    tone: readTone(stored.tone),
    unitPrice: readString(stored.unitPrice),
    quantity,
    lineTotal: readAmount(stored.lineTotal),
  };
}

/** Only the four tones the listing image knows how to accent. */
function readTone(value: unknown): ListingTone {
  return value === 'gold' || value === 'earth' || value === 'blue' ? value : 'green';
}

/** A stored string field, trimmed. Anything that is not a string becomes empty. */
function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** A stored number, with anything unusable falling back to zero. */
function readAmount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Checks the delivery form.
 *
 * The name and the phone go through the same rules the signup form uses, so a
 * number that would be rejected there is rejected here too. The PIN code is
 * six digits and nothing else, because that is the one field a sorting machine
 * reads and a wrong digit sends the parcel to another district.
 *
 * Only the fields the farmer has to get right are required; nothing is checked
 * that a delivery agent could work out from the rest of the address.
 */
export function validateDeliveryAddress(
  values: DeliveryAddress
): FieldErrors<DeliveryAddress> {
  const errors: FieldErrors<DeliveryAddress> = {};

  const fullNameError = validateFullName(values.fullName);
  if (fullNameError) errors.fullName = fullNameError;

  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;

  const houseNumberError = validateRequiredText(values.houseNumber, 'House / door number');
  if (houseNumberError) errors.houseNumber = houseNumberError;

  const streetError = validateRequiredText(values.street, 'Street / village');
  if (streetError) errors.street = streetError;

  const cityError = validateRequiredText(values.city, 'City / town');
  if (cityError) errors.city = cityError;

  const districtError = validateRequiredText(values.district, 'District');
  if (districtError) errors.district = districtError;

  const stateError = validateRequiredText(values.state, 'State');
  if (stateError) errors.state = stateError;

  const pinError = validatePinCode(values.pinCode);
  if (pinError) errors.pinCode = pinError;

  return errors;
}

/** Required, and nothing but whitespace. */
function validateRequiredText(value: string, fieldLabel: string): string | undefined {
  return value.trim().length > 0 ? undefined : `${fieldLabel} is required.`;
}

/** Exactly six digits, and no letters. */
function validatePinCode(pinCode: string): string | undefined {
  const trimmed = pinCode.trim();

  if (trimmed.length === 0) {
    return 'PIN code is required.';
  }

  return /^\d+$/.test(trimmed) && trimmed.length === PIN_CODE_LENGTH
    ? undefined
    : `Enter the ${PIN_CODE_LENGTH}-digit PIN code.`;
}

/** How many items an order covers, for the confirmation's one-line summary. */
export function orderItemCount(order: PlacedOrder): number {
  return order.lines.reduce((total, line) => total + line.quantity, 0);
}

/** "3 items" or "1 item", so the confirmation never says "1 items". */
export function orderItemCountLabel(order: PlacedOrder): string {
  const count = orderItemCount(order);

  return count === 1 ? '1 item' : `${count} items`;
}

/**
 * "1 item · Paddy Land" — the short line a farmer reads first, which names the
 * things rather than the count alone.
 */
export function orderHeadline(order: PlacedOrder): string {
  const first = order.lines[0];

  if (!first) {
    return 'No items';
  }

  const rest = order.lines.length - 1;
  const others = rest > 0 ? ` and ${rest} more` : '';

  return `${orderItemCountLabel(order)} · ${first.name}${others}`;
}

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;
