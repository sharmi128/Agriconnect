/**
 * Remembers the farmer's expenses between app launches.
 *
 * This is the frontend-only stand-in for a real expenses record. The Spring Boot
 * backend is not touched: the entries live in AsyncStorage on the device, which is
 * enough for spending recorded today to still be in the list tomorrow.
 *
 * The whole list is stored under one key rather than a key per entry, because
 * the summary at the top of the screen needs every entry to add up a total, and
 * one key means a delete cannot leave a total that disagrees with the list.
 *
 * Reading is deliberately forgiving, in the same way `onboarding-storage.ts` is.
 * A missing, empty or corrupt value falls back to the demo expenses, and each
 * entry is checked one field at a time, so a record written by an older build of
 * the app still loads instead of being thrown away.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEMO_EXPENSES,
  formatToday,
  isExpenseCategory,
  type Expense,
} from '@/models/expenses';

/** Namespaced so it cannot clash with any other key the app adds later. */
const STORAGE_KEY = '@agriconnect/expenses';

/**
 * Copies a stored value into an expense, or returns `null` if it cannot be one.
 *
 * A record without an id, without a title or with a category the app does not
 * know is dropped, because there is no way to total it and no way for the farmer
 * to tell which entry it was. The amount has to be a real positive number, and
 * the date falls back to today when it is missing, so an old record still lands
 * in the current month rather than being excluded from every total.
 */
function normaliseExpense(value: unknown): Expense | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const stored = value as Record<string, unknown>;

  if (typeof stored.id !== 'string' || stored.id.length === 0) {
    return null;
  }

  if (typeof stored.title !== 'string' || stored.title.trim().length === 0) {
    return null;
  }

  if (typeof stored.category !== 'string' || !isExpenseCategory(stored.category)) {
    return null;
  }

  if (typeof stored.amount !== 'number' || !Number.isFinite(stored.amount) || stored.amount <= 0) {
    return null;
  }

  const date =
    typeof stored.date === 'string' && stored.date.trim().length > 0
      ? stored.date.trim()
      : formatToday();

  const note = typeof stored.note === 'string' && stored.note.trim().length > 0 ? stored.note : null;

  return {
    id: stored.id,
    category: stored.category,
    title: stored.title.trim(),
    amount: stored.amount,
    date,
    ...(note ? { note } : {}),
  };
}

/**
 * Reads the saved expenses.
 *
 * Never throws: an unreadable store is reported as a fresh install showing the
 * demo entries, so the screen still opens. A stored empty list is respected
 * rather than replaced with the demo data, because a farmer who has cleared
 * their expenses should not have the demo ones come back.
 */
export async function loadExpenses(): Promise<Expense[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [...DEMO_EXPENSES];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [...DEMO_EXPENSES];
    }

    return parsed
      .map(normaliseExpense)
      .filter((expense): expense is Expense => expense !== null);
  } catch {
    return [...DEMO_EXPENSES];
  }
}

/** Saves the expense list. */
export async function saveExpenses(expenses: readonly Expense[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // A full or unavailable store must not lose the farmer's place: the
    // in-memory context already has the entry for this session, and the app
    // simply asks them to record it again the next time it is opened.
  }
}

/**
 * Clears the saved expenses, so the next start shows the demo entries again.
 *
 * Used by the sign-out flow, so the next farmer to pick the phone up does not
 * inherit the previous one's spending.
 */
export async function clearExpenses(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do: the in-memory state is reset by the caller either way.
  }
}
