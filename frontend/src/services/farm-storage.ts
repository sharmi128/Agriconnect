/**
 * Remembers the farmer's fields between app launches.
 *
 * This is the frontend-only stand-in for a real farm record. The Spring Boot
 * backend is not touched: the fields live in AsyncStorage on the device, which is
 * enough for a field or a crop added today to still be there tomorrow.
 *
 * The whole list is stored under one key rather than a key per field. A farmer
 * has a handful of plots, the list always has to be read in full, and one key
 * means a delete cannot leave an orphan record behind.
 *
 * Reading is deliberately forgiving, in the same way `onboarding-storage.ts` is.
 * A missing, empty or corrupt value falls back to the demo farm, and each field
 * is checked one field at a time, so a record written by an older build of the
 * app still loads instead of being thrown away. Anything missing or of the wrong
 * type is dropped or replaced with a safe default, because a bad read should
 * never leave the farmer staring at a blank screen.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { isCropStage } from '@/models/crop-journal';
import { isCropHealth } from '@/models/crop-form';
import { DEMO_FARM, type FarmField, type FieldCrop } from '@/models/farm';

/** Namespaced so it cannot clash with any other key the app adds later. */
const STORAGE_KEY = '@agriconnect/farm';

/** Reads an optional string, treating blank text the same as a missing value. */
function readOptionalString(stored: Record<string, unknown>, key: string): string | undefined {
  const value = stored[key];

  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

/**
 * Copies a stored crop into a full record.
 *
 * The name is the only required fact, because it is the one thing a crop cannot
 * be shown without. Stage and health are narrowed back to the values the app
 * understands, so a hand-edited or half-written record cannot put a colour badge
 * or a progress bar into an impossible state. Returns `null` for a record with no
 * name, which reads as fallow.
 */
function normaliseCrop(value: unknown): FieldCrop | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const stored = value as Record<string, unknown>;

  if (typeof stored.name !== 'string' || stored.name.trim().length === 0) {
    return null;
  }

  const stage = readOptionalString(stored, 'stage');
  const health = readOptionalString(stored, 'health');

  return {
    name: stored.name.trim(),
    variety: readOptionalString(stored, 'variety'),
    stage: stage && isCropStage(stage) ? stage : undefined,
    sownOn: readOptionalString(stored, 'sownOn'),
    expectedHarvest: readOptionalString(stored, 'expectedHarvest'),
    health: health && isCropHealth(health) ? health : undefined,
  };
}

/**
 * Copies a stored value into a field, or returns `null` if it cannot be a field.
 *
 * A record without an id or a name is dropped rather than shown, because there is
 * no way to open its details page and no way for the farmer to tell which plot it
 * was. A missing size falls back to "0", which the overview card adds up as no
 * land at all instead of crashing the total.
 */
function normaliseField(value: unknown): FarmField | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const stored = value as Record<string, unknown>;

  if (typeof stored.id !== 'string' || stored.id.length === 0) {
    return null;
  }

  const name = typeof stored.name === 'string' ? stored.name.trim() : '';

  if (name.length === 0) {
    return null;
  }

  return {
    id: stored.id,
    name,
    areaAcres: readOptionalString(stored, 'areaAcres') ?? '0',
    crop: normaliseCrop(stored.crop),
    note: readOptionalString(stored, 'note'),
    location: readOptionalString(stored, 'location'),
    irrigation: readOptionalString(stored, 'irrigation'),
    soil: readOptionalString(stored, 'soil'),
  };
}

/**
 * Reads the saved fields.
 *
 * Never throws: an unreadable store is reported as a fresh install showing the
 * demo farm, so the app still opens. A stored empty list is respected rather than
 * replaced with the demo farm, because a farmer who has deleted every field
 * should not have three of them come back.
 */
export async function loadFarmFields(): Promise<FarmField[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEMO_FARM.fields;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return DEMO_FARM.fields;
    }

    return parsed
      .map(normaliseField)
      .filter((field): field is FarmField => field !== null);
  } catch {
    return DEMO_FARM.fields;
  }
}

/** Saves the field list. */
export async function saveFarmFields(fields: FarmField[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
  } catch {
    // A full or unavailable store must not lose the farmer's place: the
    // in-memory context already has the change for this session, and the app
    // simply asks them to record it again the next time it is opened.
  }
}

/**
 * Clears the saved fields, so the next start shows the demo farm again.
 *
 * Used by the sign-out flow, so the next farmer to pick the phone up does not
 * inherit the previous one's plots.
 */
export async function clearFarmFields(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do: the in-memory state is reset by the caller either way.
  }
}
