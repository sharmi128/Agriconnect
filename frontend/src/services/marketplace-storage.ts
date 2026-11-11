/**
 * Remembers the farmer's wishlist and cart between app launches.
 *
 * This is the frontend-only stand-in for a real saved-items record. The Spring
 * Boot backend is not touched: the saved ids live in AsyncStorage on the device,
 * which is enough for a shortlist built up today to still be there tomorrow.
 *
 * Both are stored together under one key. They are two views of the same
 * decision — a listing a farmer marked, and a listing they meant to ask about —
 * and one key means a write cannot leave the two disagreeing, the same reason
 * the expenses list is kept as a single record.
 *
 * Reading is deliberately forgiving, in the same way `expense-storage.ts` is. A
 * missing, empty or corrupt value falls back to nothing saved, and each entry is
 * checked field by field, so state written by an older build of the app still
 * loads instead of being thrown away.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  emptySavedState,
  normaliseSavedState,
  type MarketplaceSavedState,
} from '@/models/marketplace-cart';

/** Namespaced so it cannot clash with any other key the app adds later. */
const STORAGE_KEY = '@agriconnect/marketplace-saved';

/**
 * Reads the saved wishlist and cart.
 *
 * Never throws: an unreadable store is reported as a fresh install, so the
 * marketplace still opens. A stored empty state is respected rather than
 * replaced, because a farmer who has cleared their cart should not find the
 * old items waiting on them.
 */
export async function loadSavedMarketplaceState(): Promise<MarketplaceSavedState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return emptySavedState();
    }

    return normaliseSavedState(JSON.parse(raw));
  } catch {
    return emptySavedState();
  }
}

/** Saves the wishlist and the cart. */
export async function saveSavedMarketplaceState(
  state: MarketplaceSavedState
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A full or unavailable store must not lose the farmer's place: the
    // in-memory context already has the change for this session, and the app
    // simply asks them to mark it again the next time it is opened.
  }
}

/**
 * Clears the saved wishlist and cart, so the next start shows nothing saved.
 *
 * Used by the sign-out flow, so the next farmer to pick the phone up does not
 * inherit the previous one's shortlist.
 */
export async function clearSavedMarketplaceState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do: the in-memory state is reset by the caller either way.
  }
}
