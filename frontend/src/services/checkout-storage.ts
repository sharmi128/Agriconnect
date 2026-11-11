/**
 * Remembers the farmer's saved delivery address and the demo orders they placed.
 *
 * This is the frontend-only stand-in for a real address book and an order
 * history. The Spring Boot backend is not touched: the record lives in
 * AsyncStorage on the device, which is enough for the delivery form to come back
 * filled in and for a placed order to still be there after a restart.
 *
 * The address and the orders are stored together under one key. They are two
 * faces of the same checkout — where things go, and what was sent there — and
 * one key means a write cannot leave the two disagreeing, the same reason the
 * wishlist and the cart share a record.
 *
 * Nothing payment-related is written here, and nothing is asked for: this flow
 * takes no card, no UPI id and no bank detail, so there is nothing to keep.
 *
 * Reading is deliberately forgiving, in the same way `marketplace-storage.ts` is.
 * A missing, empty or corrupt value falls back to nothing saved, and each order
 * is checked field by field, so a record written by an older build of the app
 * still opens instead of being thrown away.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  EMPTY_DELIVERY_ADDRESS,
  normaliseDeliveryAddress,
  normalisePlacedOrder,
  type DeliveryAddress,
  type PlacedOrder,
} from '@/models/marketplace-delivery';

/** Namespaced so it cannot clash with any other key the app adds later. */
const STORAGE_KEY = '@agriconnect/checkout';

/** How many placed orders are kept. Older ones drop off the end. */
export const MAX_SAVED_ORDERS = 20;

/** What the checkout remembers between launches. */
export type SavedCheckoutState = {
  /** The address the farmer last saved, or an empty one. */
  address: DeliveryAddress;
  /** Placed orders, newest first. */
  orders: PlacedOrder[];
};

/** A first run: no address saved and nothing ordered. */
export function emptyCheckoutState(): SavedCheckoutState {
  return { address: { ...EMPTY_DELIVERY_ADDRESS }, orders: [] };
}

/** Reads a stored blob into usable state, dropping anything malformed. */
export function normaliseCheckoutState(value: unknown): SavedCheckoutState {
  if (typeof value !== 'object' || value === null) {
    return emptyCheckoutState();
  }

  const stored = value as Record<string, unknown>;

  const orders = Array.isArray(stored.orders)
    ? stored.orders
        .map(normalisePlacedOrder)
        .filter((order): order is PlacedOrder => order !== null)
        .slice(0, MAX_SAVED_ORDERS)
    : [];

  return {
    address: normaliseDeliveryAddress(stored.address),
    orders,
  };
}

/**
 * Reads the saved address and the placed demo orders.
 *
 * Never throws: an unreadable store is reported as a first run, so the delivery
 * page still opens. A stored empty address is respected rather than replaced,
 * because a farmer who cleared the form should not find it refilled.
 */
export async function loadSavedCheckoutState(): Promise<SavedCheckoutState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return emptyCheckoutState();
    }

    return normaliseCheckoutState(JSON.parse(raw));
  } catch {
    return emptyCheckoutState();
  }
}

/** Saves the address and the placed orders. */
export async function saveSavedCheckoutState(state: SavedCheckoutState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A full or unavailable store must not lose the farmer's place: the
    // in-memory context already has the change for this session, and the app
    // simply asks them to enter it again the next time checkout is opened.
  }
}

/**
 * Clears the saved address and the placed orders.
 *
 * Used by the sign-out flow, so the next farmer to pick the phone up does not
 * inherit the previous one's address or receipts.
 */
export async function clearSavedCheckoutState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do: the in-memory state is reset by the caller either way.
  }
}
