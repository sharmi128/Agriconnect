/**
 * Remembers whether the farmer has finished the first-run setup.
 *
 * This is the frontend-only stand-in for a real account. The Spring Boot backend
 * is not touched: the flag and the profile the farmer typed are written to
 * AsyncStorage on the device, which is enough for the app to behave correctly
 * across restarts during testing.
 *
 * Two things are stored under one key:
 *
 *   - `profileCompleted` — the flag the Welcome screen and the route guards read.
 *     A farmer who has finished setup opens the app straight onto Home, and a
 *     farmer who has not is kept inside the setup flow.
 *   - `profile` — the answers themselves, so the Profile tab shows what the
 *     farmer typed instead of the demo placeholder values.
 *
 * Reading is deliberately forgiving. A missing, empty, corrupt or
 * half-written value is treated as "not completed yet" and simply sends the
 * farmer back to the Welcome screen, because a bad read should never leave the
 * app stuck on a blank screen.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_FARMER_PROFILE,
  type FarmerProfile,
} from '@/models/farmer-profile';

/** Namespaced so it cannot clash with any other key the app adds later. */
const STORAGE_KEY = '@agriconnect/onboarding';

export type StoredOnboarding = {
  profileCompleted: boolean;
  profile: FarmerProfile;
  /** ISO timestamp, useful for debugging and for a future "setup completed on". */
  completedAt: string | null;
};

/** What a device that has never finished setup looks like. */
const FRESH_INSTALL: StoredOnboarding = {
  profileCompleted: false,
  profile: DEFAULT_FARMER_PROFILE,
  completedAt: null,
};

/**
 * Copies the stored value into a full profile.
 *
 * Each field is checked one at a time so a record written by an older build of
 * the app, which had no `income` or `loanStatus`, still loads instead of being
 * thrown away. Anything missing or of the wrong type falls back to the demo
 * default, which is exactly what a fresh install would have shown.
 */
function normaliseProfile(value: unknown): FarmerProfile {
  if (typeof value !== 'object' || value === null) {
    return { ...DEFAULT_FARMER_PROFILE };
  }

  const stored = value as Record<string, unknown>;
  const read = (key: keyof FarmerProfile): string =>
    typeof stored[key] === 'string' ? (stored[key] as string) : DEFAULT_FARMER_PROFILE[key];

  return {
    name: read('name'),
    location: read('location'),
    landArea: read('landArea'),
    fieldCount: read('fieldCount'),
    mainCrop: read('mainCrop'),
    irrigationType: read('irrigationType'),
    income: read('income'),
    loanStatus: read('loanStatus'),
  };
}

/**
 * Reads the saved onboarding state.
 *
 * Never throws: an unreadable store is reported as a fresh install so the farmer
 * sees the Welcome screen and can set their profile up again.
 */
export async function loadOnboarding(): Promise<StoredOnboarding> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { ...FRESH_INSTALL };
    }

    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== 'object' || parsed === null) {
      return { ...FRESH_INSTALL };
    }

    const stored = parsed as Record<string, unknown>;

    return {
      profileCompleted: stored.profileCompleted === true,
      profile: normaliseProfile(stored.profile),
      completedAt: typeof stored.completedAt === 'string' ? stored.completedAt : null,
    };
  } catch {
    return { ...FRESH_INSTALL };
  }
}

/** Saves the flag and the profile once the farmer finishes setup. */
export async function saveOnboarding(profile: FarmerProfile): Promise<StoredOnboarding> {
  const next: StoredOnboarding = {
    profileCompleted: true,
    profile,
    completedAt: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A full or unavailable store must not trap the farmer on the setup screen:
    // the in-memory context still marks setup as done for this session, and the
    // app simply asks again the next time it is opened.
  }

  return next;
}

/**
 * Clears the flag so the Welcome screen shows again.
 *
 * Used by the Logout row, because logging out of the app on a device that only
 * has a local profile should behave like a first launch for the next farmer who
 * picks the phone up.
 */
export async function clearOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do: the in-memory state is reset by the caller either way.
  }
}
