/**
 * Wishlist and cart state for the marketplace, and the small amount of maths
 * needed to show a total.
 *
 * Both are stored as listing ids rather than whole listings. The listings
 * themselves are demo data that lives in `marketplace.ts`, and an id keeps the
 * saved state small and lets a stale id simply resolve to nothing if a listing
 * is renamed or removed, instead of carrying a frozen copy of a price that has
 * since changed.
 *
 * The cart is one line per listing, with a quantity, so the same tractor can be
 * added twice without appearing as two separate entries. Quantities are capped
 * at `MAX_CART_QUANTITY`, because this is a shortlist of things a farmer is
 * planning to enquire about rather than a bulk order form.
 *
 * Prices arrive as display strings from the listings model, so the totals here
 * have to read the number back out of them. Indian grouping is written by hand
 * rather than through `Intl`, for the same reason the listings model avoids it:
 * `toLocaleString` with an `en-IN` locale is not reliably available on every
 * Hermes build.
 */

import type { MarketplaceListing } from '@/models/marketplace';

/** One cart entry: how many of a listing, and which one. */
export type CartLine = {
  listingId: string;
  quantity: number;
};

/** Everything the farmer has saved: what they liked, and what they plan to ask about. */
export type MarketplaceSavedState = {
  /** Listing ids, most recently saved first. */
  wishlist: string[];
  /** One line per listing, in the order it was first added. */
  cart: CartLine[];
};

/**
 * Upper bound on a single line. Ten is far more tractor-days than anyone books
 * in one go, and it stops a repeated tap turning a cart into a runaway number.
 */
export const MAX_CART_QUANTITY = 10;

/** A fresh install: nothing saved yet. */
export function emptySavedState(): MarketplaceSavedState {
  return { wishlist: [], cart: [] };
}

/** Turns a stored line into a usable one, or `null` if it cannot be one. */
function normaliseCartLine(value: unknown): CartLine | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const stored = value as Record<string, unknown>;

  if (typeof stored.listingId !== 'string' || stored.listingId.trim().length === 0) {
    return null;
  }

  if (typeof stored.quantity !== 'number' || !Number.isFinite(stored.quantity)) {
    return null;
  }

  // A quantity below one is a line that should have been removed, and a
  // fraction is a half-tractor, so both fall back to one rather than being kept.
  const quantity = Math.min(MAX_CART_QUANTITY, Math.max(1, Math.round(stored.quantity)));

  return { listingId: stored.listingId.trim(), quantity };
}

/**
 * Reads a stored blob into usable state, dropping anything malformed.
 *
 * Used by the storage service, so an entry written by an older build of the app
 * — or one that was half-written when the app closed — cannot stop the
 * marketplace from opening.
 */
export function normaliseSavedState(value: unknown): MarketplaceSavedState {
  if (typeof value !== 'object' || value === null) {
    return emptySavedState();
  }

  const stored = value as Record<string, unknown>;

  const wishlist = Array.isArray(stored.wishlist)
    ? Array.from(
        new Set(
          stored.wishlist.filter(
            (id): id is string => typeof id === 'string' && id.trim().length > 0
          )
        )
      )
    : [];

  // The same listing saved twice collapses to its first line, so a duplicated
  // key cannot add up twice in the total.
  const seen = new Set<string>();
  const cart = Array.isArray(stored.cart)
    ? stored.cart.map(normaliseCartLine).filter((line): line is CartLine => line !== null)
    : [];

  return {
    wishlist,
    cart: cart.filter((line) => {
      if (seen.has(line.listingId)) return false;
      seen.add(line.listingId);
      return true;
    }),
  };
}

/**
 * The number a listing's price string is worth, for totalling.
 *
 * Only digits and grouping commas are read, so "₹1,800 / day" becomes 1800 and
 * "₹8,50,000" becomes 850000. A price with no digits in it totals as zero
 * rather than as `NaN`, which would blank out the whole cart total.
 */
export function listingPriceAmount(listing: MarketplaceListing): number {
  const digits = listing.price.replace(/[^\d,]/g, '').replace(/,/g, '');

  if (digits.length === 0) {
    return 0;
  }

  const amount = Number.parseInt(digits, 10);

  return Number.isFinite(amount) ? amount : 0;
}

/**
 * The per-unit part of a price, so a cart line can repeat "/ day" or
 * "/ month" beside its total. Anything bought outright has no period.
 */
export function listingPricePeriod(listing: MarketplaceListing): string {
  return pricePeriod(listing.price);
}

/**
 * The same period read straight off a price string.
 *
 * A placed order keeps a copy of the price rather than a reference back to the
 * listing, so it needs the period from the string it stored.
 */
export function pricePeriod(price: string): string {
  const lower = price.toLowerCase();

  if (lower.includes('month')) return '/ month';
  if (lower.includes('day')) return '/ day';
  if (lower.includes('hour')) return '/ hour';

  return '';
}

/**
 * Groups a number the way it is written in India — the last three digits, then
 * pairs — so a total reads "₹8,50,000" rather than "₹850,000".
 */
function groupIndianDigits(value: string): string {
  if (value.length <= 3) {
    return value;
  }

  const lastThree = value.slice(-3);
  const rest = value.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${rest},${lastThree}`;
}

/** A rupee amount, grouped, for a subtotal or a line total. */
export function formatMarketplaceAmount(amount: number): string {
  const safe = Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0;

  return `₹${groupIndianDigits(String(safe))}`;
}

/** What one line of the cart costs: the unit price times how many. */
export function cartLineTotal(listing: MarketplaceListing, quantity: number): number {
  return listingPriceAmount(listing) * Math.max(0, quantity);
}

/** The cart total across every line whose listing is still known. */
export function cartSubtotal(
  cart: readonly CartLine[],
  listings: readonly MarketplaceListing[]
): number {
  return cart.reduce((total, line) => {
    const listing = listings.find((entry) => entry.id === line.listingId);

    return listing ? total + cartLineTotal(listing, line.quantity) : total;
  }, 0);
}

/**
 * The number on the cart badge: how many things are in the cart, not how many
 * lines. Two of the same seed packet reads as 2, because that is what the farmer
 * asked for.
 */
export function cartItemCount(cart: readonly CartLine[]): number {
  return cart.reduce((total, line) => total + line.quantity, 0);
}

/** How many of one listing are in the cart. Zero when it is not there. */
export function cartQuantity(cart: readonly CartLine[], listingId: string): number {
  return cart.find((line) => line.listingId === listingId)?.quantity ?? 0;
}

/**
 * Adds one of a listing, capping at `MAX_CART_QUANTITY`. Adding something
 * already in the cart raises its quantity rather than creating a second line,
 * which is what the duplicate-prevention rule in the cart screen is built on.
 */
export function addCartLine(
  cart: readonly CartLine[],
  listingId: string
): CartLine[] {
  const existing = cart.find((line) => line.listingId === listingId);

  if (!existing) {
    return [...cart, { listingId, quantity: 1 }];
  }

  return changeCartQuantity(cart, listingId, existing.quantity + 1);
}

/**
 * Sets a line to an exact quantity. Zero removes the line, and anything past
 * the cap is trimmed back to it.
 */
export function changeCartQuantity(
  cart: readonly CartLine[],
  listingId: string,
  quantity: number
): CartLine[] {
  const safe = Math.min(MAX_CART_QUANTITY, Math.max(0, Math.round(quantity)));

  if (safe === 0) {
    return removeCartLine(cart, listingId);
  }

  return cart.map((line) =>
    line.listingId === listingId ? { ...line, quantity: safe } : line
  );
}

/** Takes a listing out of the cart entirely. */
export function removeCartLine(
  cart: readonly CartLine[],
  listingId: string
): CartLine[] {
  return cart.filter((line) => line.listingId !== listingId);
}

/** Whether a listing is saved on the wishlist. */
export function isWishlisted(wishlist: readonly string[], listingId: string): boolean {
  return wishlist.includes(listingId);
}

/**
 * Adds a listing to the wishlist, or takes it off if it is already there.
 * Saving puts it at the front, so the thing a farmer just marked is the first
 * row on the wishlist screen.
 */
export function toggleWishlisted(
  wishlist: readonly string[],
  listingId: string
): string[] {
  return isWishlisted(wishlist, listingId)
    ? wishlist.filter((id) => id !== listingId)
    : [listingId, ...wishlist];
}

/** A cart line joined to the listing it refers to, for the cart screen. */
export type ResolvedCartLine = {
  listing: MarketplaceListing;
  line: CartLine;
};

/**
 * Joins cart lines to their listings, dropping any line whose listing is no
 * longer in the data. The cart is not rewritten here, so the stale line returns
 * if that listing ever does — but it is never shown or totalled while missing.
 */
export function resolveCartLines(
  cart: readonly CartLine[],
  listings: readonly MarketplaceListing[]
): ResolvedCartLine[] {
  return cart.flatMap((line) => {
    const listing = listings.find((entry) => entry.id === line.listingId);

    return listing ? [{ listing, line }] : [];
  });
}

/** Joins wishlist ids to their listings, dropping any that are no longer known. */
export function resolveWishlist(
  wishlist: readonly string[],
  listings: readonly MarketplaceListing[]
): MarketplaceListing[] {
  return wishlist.flatMap((id) => {
    const listing = listings.find((entry) => entry.id === id);

    return listing ? [listing] : [];
  });
}
