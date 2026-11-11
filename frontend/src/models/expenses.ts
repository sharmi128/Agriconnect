/**
 * Expense Tracker model, form rules and demo data.
 *
 * Unlike the marketplace, prices here are stored as numbers, not preformatted
 * strings. This screen has to add up a total, work out a monthly figure and each
 * category's share, which is not possible if the amount is already text.
 *
 * The shape below is what an expenses endpoint is expected to return, so the
 * demo list can be swapped for a real call without changing the screen. What the
 * farmer records today is written to AsyncStorage instead, by
 * `services/expense-storage.ts`, so the list is still there after a restart.
 *
 * Two helpers are shared with the rest of the app and must keep their names and
 * behaviour: `formatRupees` is used by the Buyer Connection and Harvest screens,
 * and `formatToday` by the crop journal and the buyer connection models.
 */

import { validateRequired, type FieldErrors } from '@/utils/validation';

export type ExpenseCategoryId =
  | 'seeds'
  | 'fertilizer'
  | 'machinery'
  | 'labour'
  | 'irrigation'
  | 'transport'
  | 'other';

export type ExpenseCategory = {
  id: ExpenseCategoryId;
  emoji: string;
  label: string;
};

export type Expense = {
  id: string;
  category: ExpenseCategoryId;
  /** What was bought or paid for, for example "NPK 50:50:50, 50kg". */
  title: string;
  /** Amount in rupees. Kept as a number so totals can be calculated. */
  amount: number;
  /** Display date, for example "24 Sep 2026". */
  date: string;
  note?: string;
};

/** One row of the summary, with the category's share of the total. */
export type CategoryTotal = {
  category: ExpenseCategory;
  total: number;
  /** Share of the overall total as a whole number, 0 to 100. */
  percent: number;
};

/** The seven expense categories, in the order they are shown. */
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  { id: 'seeds', emoji: '\u{1F331}', label: 'Seeds' },
  { id: 'fertilizer', emoji: '\u{1F9EA}', label: 'Fertilizer' },
  { id: 'machinery', emoji: '\u{1F69C}', label: 'Machinery' },
  { id: 'labour', emoji: '\u{1F477}', label: 'Labour' },
  { id: 'irrigation', emoji: '\u{1F4A7}', label: 'Irrigation' },
  { id: 'transport', emoji: '\u{1F69A}', label: 'Transport' },
  { id: 'other', emoji: '\u{1F9FE}', label: 'Other' },
];

/**
 * The same categories as dropdown options, so the add form can reuse the shared
 * `SelectField` without converting them on every render.
 */
export const EXPENSE_CATEGORY_OPTIONS = EXPENSE_CATEGORIES.map((category) => ({
  value: category.id,
  label: `${category.emoji}  ${category.label}`,
}));

/** Narrows form text down to a category the app knows how to total. */
export function isExpenseCategory(value: string): value is ExpenseCategoryId {
  return EXPENSE_CATEGORIES.some((category) => category.id === value);
}

/** Demo spending for one month, newest first. */
export const DEMO_EXPENSES: readonly Expense[] = [
  {
    id: 'exp-tomato-seeds',
    category: 'seeds',
    title: 'Tomato seeds, 100g',
    amount: 850,
    date: '24 Sep 2026',
    note: 'Bought from the Agri Store',
  },
  {
    id: 'exp-npk',
    category: 'fertilizer',
    title: 'NPK 50:50:50, 50kg',
    amount: 1340,
    date: '22 Sep 2026',
    note: 'Split across North and East Field',
  },
  {
    id: 'exp-sprayer',
    category: 'machinery',
    title: 'Power sprayer, 1 day',
    amount: 600,
    date: '21 Sep 2026',
  },
  {
    id: 'exp-lorry',
    category: 'transport',
    title: 'Lorry to market, 2 trips',
    amount: 1450,
    date: '20 Sep 2026',
    note: 'Moved the tomato harvest',
  },
  {
    id: 'exp-weeding',
    category: 'labour',
    title: 'Weeding crew, 4 workers',
    amount: 1100,
    date: '19 Sep 2026',
    note: 'One full day in the paddy field',
  },
  {
    id: 'exp-drip-parts',
    category: 'irrigation',
    title: 'Drip line repair parts',
    amount: 360,
    date: '18 Sep 2026',
  },
  {
    id: 'exp-paddy-seeds',
    category: 'seeds',
    title: 'Paddy seeds, 25kg',
    amount: 1850,
    date: '14 Sep 2026',
  },
  {
    id: 'exp-tractor',
    category: 'machinery',
    title: 'Tractor hire, half day',
    amount: 900,
    date: '11 Sep 2026',
  },
  {
    id: 'exp-coop-fee',
    category: 'other',
    title: 'Cooperative membership fee',
    amount: 500,
    date: '10 Sep 2026',
    note: 'Annual subscription',
  },
  {
    id: 'exp-urea',
    category: 'fertilizer',
    title: 'Urea 46% N, 45kg',
    amount: 780,
    date: '8 Sep 2026',
  },
  {
    id: 'exp-pond',
    category: 'labour',
    title: 'Pond desilting labour',
    amount: 1200,
    date: '5 Sep 2026',
  },
];

/** Looks up a category by id. Falls back to the first category. */
export function getCategory(id: ExpenseCategoryId): ExpenseCategory {
  return (
    EXPENSE_CATEGORIES.find((category) => category.id === id) ?? EXPENSE_CATEGORIES[0]
  );
}

/**
 * Adds up every expense.
 *
 * Rounded to a whole rupee, because a total like 8,980.5 would only add
 * confusion on a screen a farmer reads at a glance.
 */
export function totalExpenses(expenses: readonly Expense[]): number {
  return Math.round(
    expenses.reduce((runningTotal, expense) => runningTotal + expense.amount, 0)
  );
}

/**
 * Works out the total and share for each category.
 *
 * Every category is returned even when it has no expenses, so the summary does
 * not change shape as new entries are added. Categories with no spending get a
 * total of zero and no bar.
 *
 * Note that the rounded percentages can add up to 101 or 99 rather than exactly
 * 100. That is normal for rounded shares and is not worth complicating the code
 * to avoid.
 */
export function summarizeByCategory(expenses: readonly Expense[]): CategoryTotal[] {
  const total = totalExpenses(expenses);

  return EXPENSE_CATEGORIES.map((category) => {
    const categoryTotal = expenses
      .filter((expense) => expense.category === category.id)
      .reduce((runningTotal, expense) => runningTotal + expense.amount, 0);

    const percent = total > 0 ? Math.round((categoryTotal / total) * 100) : 0;

    return { category, total: Math.round(categoryTotal), percent };
  });
}

const LONG_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTHS = LONG_MONTHS.map((month) => month.slice(0, 3));

/** Today as "24 Sep 2026", matching the demo data style. */
export function formatToday(date: Date = new Date()): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Month abbreviations to their number, so a written date can be read back. */
const MONTH_INDEX: Record<string, number> = MONTHS.reduce<Record<string, number>>(
  (months, month, index) => {
    months[month] = index;
    return months;
  },
  {}
);

/**
 * Reads the "24 Sep 2026" dates the app stores back into a real date.
 *
 * Returns `null` for anything it cannot read, which is how a free-text date the
 * farmer typed by hand is kept out of the monthly total rather than being
 * guessed at. Month names are matched by the same `MONTHS` list `formatToday`
 * writes from, so a date written by this app always reads back.
 */
export function parseExpenseDate(value: string): Date | null {
  const match = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(value.trim());
  const month = match ? MONTH_INDEX[match[2]] : undefined;

  if (!match || month === undefined) {
    return null;
  }

  return new Date(Number(match[3]), month, Number(match[1]));
}

/**
 * The newest entries first.
 *
 * The demo list is already newest first, but a real API response and a farmer's
 * own typing are not guaranteed to be, so the order is applied here rather than
 * assumed. An entry whose date cannot be read goes to the end rather than
 * jumping to the top, because it is safer to show an old entry late than to bury
 * the rest of the list under one unknown date.
 */
export function sortExpensesByDate(expenses: readonly Expense[]): Expense[] {
  return [...expenses].sort((first, second) => {
    const firstDate = parseExpenseDate(first.date);
    const secondDate = parseExpenseDate(second.date);

    if (!firstDate && !secondDate) return 0;
    if (!firstDate) return 1;
    if (!secondDate) return -1;

    return secondDate.getTime() - firstDate.getTime();
  });
}

/** Adds up only the entries dated in the same month and year as `today`. */
export function monthTotalExpenses(
  expenses: readonly Expense[],
  today: Date = new Date()
): number {
  return totalExpenses(entriesInMonth(expenses, today));
}

/**
 * How many entries the monthly total was worked out from.
 *
 * Counted with the same rule as `monthTotalExpenses`, so the figure under the
 * month total always describes that total and not everything ever recorded.
 */
export function monthExpenseCount(
  expenses: readonly Expense[],
  today: Date = new Date()
): number {
  return entriesInMonth(expenses, today).length;
}

/** The entries dated in the same month and year as `today`. */
function entriesInMonth(expenses: readonly Expense[], today: Date): Expense[] {
  return expenses.filter((expense) => {
    const date = parseExpenseDate(expense.date);

    return (
      date !== null &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  });
}

/** The month and year as they are written on screen, for example "September 2026". */
export function formatMonthYear(date: Date = new Date()): string {
  return `${LONG_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * The most recent entries first.
 *
 * The demo list is already newest first, but a real API response is not
 * guaranteed to be, so the order is applied here rather than assumed.
 */
export function getRecentExpenses(
  expenses: readonly Expense[],
  limit = 5
): Expense[] {
  return [...expenses].slice(0, limit);
}

/** The values the Add Expense and Edit Expense forms collect. */
export type ExpenseFormValues = {
  /** One of `EXPENSE_CATEGORY_IDS`. */
  category: string;
  title: string;
  /** Rupees as typed, for example "850" or "1,340.50" without the symbol. */
  amount: string;
  /** Day month year, for example "24 Sep 2026". */
  date: string;
  note: string;
};

/**
 * The blank form Add Expense starts from.
 *
 * The date is left empty rather than filled with today, so the constant stays a
 * true blank and the Add Expense screen can decide for itself what today is on
 * the device.
 */
export const EMPTY_EXPENSE_FORM: ExpenseFormValues = {
  category: '',
  title: '',
  amount: '',
  date: '',
  note: '',
};

/** A rupee amount with up to two decimal places, for example "850" or "1340.5". */
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

/** A sanity ceiling, so a mistyped extra digit cannot be saved as a lakh crore. */
const MAX_AMOUNT = 10_000_000;

/**
 * Checks a typed rupee amount.
 *
 * Commas and the rupee symbol are stripped first, so a farmer who copies the
 * figure off a receipt can paste it in. Two decimal places is the limit, which is
 * all a rupee amount can usefully carry.
 */
export function validateExpenseAmount(value: string): string | undefined {
  const cleaned = value.replace(/[,₹\s]/g, '');

  if (cleaned.length === 0) {
    return 'Amount is required.';
  }

  if (!AMOUNT_PATTERN.test(cleaned)) {
    return 'Enter the amount in rupees using numbers only, for example 850 or 850.50.';
  }

  if (Number(cleaned) <= 0) {
    return 'Amount must be greater than 0.';
  }

  if (Number(cleaned) > MAX_AMOUNT) {
    return 'That amount looks too large. Check the figure and try again.';
  }

  return undefined;
}

/** Checks a typed expense date in the "24 Sep 2026" style the app writes. */
export function validateExpenseDate(value: string): string | undefined {
  const requiredError = validateRequired(value, 'Date');
  if (requiredError) return requiredError;

  if (!parseExpenseDate(value)) {
    return 'Enter the date as day month year, for example 24 Sep 2026.';
  }

  return undefined;
}

/** Runs every expense rule and returns only the fields that failed. */
export function validateExpenseForm(
  values: ExpenseFormValues
): FieldErrors<ExpenseFormValues> {
  const errors: FieldErrors<ExpenseFormValues> = {};

  if (!isExpenseCategory(values.category)) {
    errors.category = 'Choose a category.';
  }

  const titleError = validateRequired(values.title, 'What was bought');
  if (titleError) errors.title = titleError;

  const amountError = validateExpenseAmount(values.amount);
  if (amountError) errors.amount = amountError;

  const dateError = validateExpenseDate(values.date);
  if (dateError) errors.date = dateError;

  return errors;
}

/**
 * Turns validated form values into an expense ready to be listed.
 *
 * The id combines the time so two expenses added in the same second still get
 * separate keys, and the note is dropped entirely when it is blank rather than
 * stored as an empty string.
 */
export function buildExpense(values: ExpenseFormValues): Expense {
  const title = values.title.trim();
  const note = values.note.trim();
  const cleanedAmount = values.amount.replace(/[,₹\s]/g, '');

  return {
    id: `exp-${Date.now()}`,
    category: isExpenseCategory(values.category) ? values.category : 'other',
    title,
    amount: Math.round(Number(cleanedAmount) * 100) / 100,
    date: values.date.trim(),
    ...(note ? { note } : {}),
  };
}

/**
 * Fills the form from a saved expense, so Edit Expense starts from what is there
 * rather than blanks. An expense with no note leaves the field empty, which the
 * form reads as "optional, leave blank".
 */
export function formFromExpense(expense: Expense): ExpenseFormValues {
  return {
    category: expense.category,
    title: expense.title,
    amount: String(expense.amount),
    date: expense.date,
    note: expense.note ?? '',
  };
}

/**
 * Applies validated form values to an expense, keeping its id.
 *
 * Keeping the id matters: the list, the totals and the crop journal all key off
 * it, so a new id would make a saved edit look like a second expense.
 */
export function applyExpenseValues(expense: Expense, values: ExpenseFormValues): Expense {
  return { ...buildExpense(values), id: expense.id };
}

/**
 * Builds an expense straight from loose values.
 *
 * Kept for callers that already have a category, a title and an amount and just
 * need today's date filled in. The full form path is `buildExpense`, which takes
 * a date the farmer chose.
 */
export function createExpense(
  category: ExpenseCategoryId,
  title: string,
  amount: number,
  note?: string
): Expense {
  const trimmedNote = note?.trim();

  return {
    id: `exp-${Date.now()}`,
    category,
    title: title.trim(),
    amount,
    date: formatToday(),
    ...(trimmedNote ? { note: trimmedNote } : {}),
  };
}

/**
 * Formats rupees the way they are written in India.
 *
 * The last three digits are grouped together and the rest in pairs, so 8980
 * becomes "₹8,980" and 123456 becomes "₹1,23,456". The grouping is done by hand
 * rather than with `toLocaleString`, because locale data is not guaranteed on
 * every device, and the same reasoning is used for dates in the dashboard.
 */
export function formatRupees(amount: number): string {
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const digits = Math.abs(rounded).toString();

  if (digits.length <= 3) {
    return `${isNegative ? '-' : ''}₹${digits}`;
  }

  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const groups: string[] = [];

  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }

  if (rest.length > 0) {
    groups.unshift(rest);
  }

  return `${isNegative ? '-' : ''}₹${groups.join(',')},${lastThree}`;
}
