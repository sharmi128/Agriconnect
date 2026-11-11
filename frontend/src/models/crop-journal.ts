/**
 * Crop Growth Journal and Harvest model and demo data.
 *
 * This is the model behind the Crop Journal screen: the crops being tracked, the
 * growth updates logged against them, the photos attached to those updates, and
 * the harvests recorded through the season.
 *
 * Everything here is local demo data. There is no API call, and the shapes below
 * are what a journal endpoint is expected to return later, so the screen can be
 * pointed at the Spring Boot backend without being rewritten.
 *
 * Two decisions are worth knowing about:
 *
 * - Quantities are stored in kilograms even though a farmer can record them in
 *   quintals, because a total across mixed units cannot be added up.
 * - Dates come from the shared `formatToday` helper in `models/expenses.ts`, so a
 *   new journal entry is stamped the same way as a new expense. The harvest
 *   components render money with the same `formatRupees` helper for the same
 *   reason.
 */

import { formatToday } from '@/models/expenses';
import type { CropHealth, CropStage } from '@/models/farm';
import type { SelectOption } from '@/models/farmer-profile';

/**
 * The growth stages in order, from sowing to harvest.
 *
 * The order matters: it is what the progress bar on each crop card is measured
 * against, and it is the order the stage dropdown offers.
 */
export const CROP_STAGE_ORDER: readonly CropStage[] = [
  'Sowing',
  'Germination',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Maturity',
  'Harvested',
];

/** The stages as dropdown options, so the shared SelectField can use them. */
export const CROP_STAGE_OPTIONS: SelectOption[] = CROP_STAGE_ORDER.map((stage) => ({
  value: stage,
  label: stage,
}));

/** Units a farmer can record a harvest in. Everything is converted to kilograms. */
export type HarvestUnit = 'kg' | 'quintal';

export const HARVEST_UNIT_OPTIONS: SelectOption[] = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'quintal', label: 'Quintals (1 quintal = 100 kg)' },
];

/** How many kilograms one unit holds. */
const KG_PER_UNIT: Record<HarvestUnit, number> = {
  kg: 1,
  quintal: 100,
};

/** Narrows text that came out of a form to a unit we accept. */
export function isHarvestUnit(value: string): value is HarvestUnit {
  return value === 'kg' || value === 'quintal';
}

/**
 * Narrows text that came out of a form to a stage we accept.
 *
 * The stage dropdown only offers real stages, but the value arrives as a plain
 * string, so this keeps the cast out of the form itself.
 */
export function isCropStage(value: string): value is CropStage {
  return CROP_STAGE_ORDER.some((stage) => stage === value);
}

/** Converts a quantity the farmer typed into kilograms, so totals stay correct. */
export function toKilograms(quantity: number, unit: HarvestUnit): number {
  return Math.round(quantity * KG_PER_UNIT[unit]);
}

/** Accent colour for a photo tile. Mirrors the tones used by the marketplace. */
export type JournalPhotoTone = 'green' | 'gold' | 'earth' | 'blue';

/**
 * One photo attached to a growth update.
 *
 * There is no real image here on purpose: a tile is a themed colour with the
 * photo emoji on it, the same approach the marketplace listing card takes. That
 * keeps the screen working offline, needs no image hosting, and means the photo
 * picker can be swapped for the device camera roll later without changing how a
 * photo is displayed.
 */
export type JournalPhoto = {
  id: string;
  emoji: string;
  /** What the photo shows, for example "Water level in the field". */
  caption: string;
  tone: JournalPhotoTone;
};

/** A crop being tracked in the journal. */
export type JournalCrop = {
  id: string;
  emoji: string;
  name: string;
  /** Seed variety, for example "IR-64". */
  variety?: string;
  /** The field it is growing in, matching the My Farm screen. */
  fieldName: string;
  areaAcres: string;
  stage: CropStage;
  health: CropHealth;
  /** Date the crop was sown, for example "12 Jun 2026". */
  sownOn: string;
  /** 🌾 Expected harvest date, for example "20 Oct 2026". */
  expectedHarvest: string;
};

/** 📝 One entry in a crop's growth timeline. */
export type GrowthUpdate = {
  id: string;
  cropId: string;
  /** Display date, for example "24 Sep 2026". */
  date: string;
  /** The stage the crop had reached when this update was written. */
  stage: CropStage;
  note: string;
  /** Photos attached to this update, from `DEMO_JOURNAL_PHOTOS`. */
  photoIds: string[];
};

/** ⚖️💰 One recorded harvest. */
export type HarvestRecord = {
  id: string;
  cropId: string;
  date: string;
  /** Quantity in kilograms, so records in different units can be added up. */
  quantityKg: number;
  /** 💰 Value of the harvest in rupees. */
  value: number;
};

/**
 * The photos a farmer can attach to an update.
 *
 * This list stands in for the device camera roll until a real picker is added.
 * It is deliberately a fixed set rather than a network call, so the screen still
 * works with no connection.
 */
export const DEMO_JOURNAL_PHOTOS: readonly JournalPhoto[] = [
  {
    id: 'photo-seedbed',
    emoji: '🌱',
    caption: 'Seedbed after sowing',
    tone: 'green',
  },
  {
    id: 'photo-first-leaves',
    emoji: '🍃',
    caption: 'First true leaves',
    tone: 'green',
  },
  {
    id: 'photo-water-level',
    emoji: '💧',
    caption: 'Water level in the field',
    tone: 'blue',
  },
  {
    id: 'photo-yellow-leaf',
    emoji: '🍂',
    caption: 'Yellowing lower leaves',
    tone: 'gold',
  },
  {
    id: 'photo-flowering',
    emoji: '🌼',
    caption: 'Flowering started',
    tone: 'gold',
  },
  {
    id: 'photo-fruit-set',
    emoji: '🍅',
    caption: 'Fruit set on the vines',
    tone: 'earth',
  },
  {
    id: 'photo-weeding',
    emoji: '🧑‍🌾',
    caption: 'Weeding the rows',
    tone: 'earth',
  },
  {
    id: 'photo-tractor',
    emoji: '🚜',
    caption: 'Tractor working the plot',
    tone: 'blue',
  },
  {
    id: 'photo-harvest-bags',
    emoji: '🛍️',
    caption: 'Bags ready at the field',
    tone: 'green',
  },
];

/**
 * 🌱 The crops in the journal.
 *
 * These line up with the fields on the My Farm screen: South Field is fallow
 * there because its maize was harvested, which is why Maize shows as Harvested
 * here. Keeping the two screens on the same crops is what stops them drifting
 * apart.
 */
export const DEMO_JOURNAL_CROPS: readonly JournalCrop[] = [
  {
    id: 'crop-paddy',
    emoji: '🌾',
    name: 'Paddy',
    variety: 'IR-64',
    fieldName: 'North Field',
    areaAcres: '0.8',
    stage: 'Maturity',
    health: 'Good',
    sownOn: '12 Jun 2026',
    expectedHarvest: '20 Oct 2026',
  },
  {
    id: 'crop-tomato',
    emoji: '🍅',
    name: 'Tomato',
    variety: 'Roma',
    fieldName: 'East Field',
    areaAcres: '0.7',
    stage: 'Fruiting',
    health: 'Watch',
    sownOn: '02 Aug 2026',
    expectedHarvest: '05 Oct 2026',
  },
  {
    id: 'crop-maize',
    emoji: '🌽',
    name: 'Maize',
    variety: 'Hybrid 512',
    fieldName: 'South Field',
    areaAcres: '0.5',
    stage: 'Harvested',
    health: 'Good',
    sownOn: '05 Apr 2026',
    expectedHarvest: '18 Aug 2026',
  },
];

/** 📅 The growth updates, grouped by crop and written newest first. */
export const DEMO_GROWTH_UPDATES: readonly GrowthUpdate[] = [
  // ── 🌾 Paddy in North Field ─────────────────────────────────────────────
  {
    id: 'upd-paddy-maturity',
    cropId: 'crop-paddy',
    date: '22 Sep 2026',
    stage: 'Maturity',
    note: 'Grains firm and turning golden. Drained the field for the last time.',
    photoIds: ['photo-water-level'],
  },
  {
    id: 'upd-paddy-flowering',
    cropId: 'crop-paddy',
    date: '20 Aug 2026',
    stage: 'Flowering',
    note: 'Panicles out and flowering evenly across the plot.',
    photoIds: ['photo-flowering'],
  },
  {
    id: 'upd-paddy-vegetative',
    cropId: 'crop-paddy',
    date: '15 Jul 2026',
    stage: 'Vegetative',
    note: 'Tillering well after the second top dressing of urea.',
    photoIds: [],
  },
  {
    id: 'upd-paddy-germination',
    cropId: 'crop-paddy',
    date: '22 Jun 2026',
    stage: 'Germination',
    note: 'Seedlings up and standing in water, very even across the field.',
    photoIds: ['photo-seedbed', 'photo-first-leaves'],
  },
  {
    id: 'upd-paddy-sowing',
    cropId: 'crop-paddy',
    date: '12 Jun 2026',
    stage: 'Sowing',
    note: 'IR-64 sown in the puddled field, 25kg of seed.',
    photoIds: ['photo-seedbed'],
  },

  // ── 🍅 Tomato in East Field ─────────────────────────────────────────────
  {
    id: 'upd-tomato-fruiting-2',
    cropId: 'crop-tomato',
    date: '24 Sep 2026',
    stage: 'Fruiting',
    note: 'Second picking done. A few leaves with spots on the east side.',
    photoIds: ['photo-fruit-set'],
  },
  {
    id: 'upd-tomato-fruiting-1',
    cropId: 'crop-tomato',
    date: '18 Sep 2026',
    stage: 'Fruiting',
    note: 'Fruit set on most vines. First picking planned for tomorrow.',
    photoIds: [],
  },
  {
    id: 'upd-tomato-vegetative',
    cropId: 'crop-tomato',
    date: '05 Sep 2026',
    stage: 'Vegetative',
    note: 'Staked the vines and cleared the weeds between the rows.',
    photoIds: ['photo-weeding'],
  },
  {
    id: 'upd-tomato-germination',
    cropId: 'crop-tomato',
    date: '10 Aug 2026',
    stage: 'Germination',
    note: 'Transplant settled well, with a little yellowing on the lower leaves.',
    photoIds: ['photo-yellow-leaf'],
  },
  {
    id: 'upd-tomato-sowing',
    cropId: 'crop-tomato',
    date: '02 Aug 2026',
    stage: 'Sowing',
    note: 'Roma seedlings transplanted out of the nursery bed.',
    photoIds: ['photo-seedbed'],
  },

  // ── 🌽 Maize in South Field, now harvested ─────────────────────────────
  {
    id: 'upd-maize-harvested',
    cropId: 'crop-maize',
    date: '22 Aug 2026',
    stage: 'Harvested',
    note: 'Cobs picked and dried. The field is left fallow for the season.',
    photoIds: ['photo-harvest-bags'],
  },
  {
    id: 'upd-maize-maturity',
    cropId: 'crop-maize',
    date: '12 Aug 2026',
    stage: 'Maturity',
    note: 'Husks dry and the cobs filled out well.',
    photoIds: [],
  },
  {
    id: 'upd-maize-flowering',
    cropId: 'crop-maize',
    date: '20 Jun 2026',
    stage: 'Flowering',
    note: 'Tassels out, and the rain came at the right time.',
    photoIds: [],
  },
  {
    id: 'upd-maize-vegetative',
    cropId: 'crop-maize',
    date: '10 May 2026',
    stage: 'Vegetative',
    note: 'Knee high and even. Weeded the rows once.',
    photoIds: ['photo-tractor'],
  },
  {
    id: 'upd-maize-sowing',
    cropId: 'crop-maize',
    date: '05 Apr 2026',
    stage: 'Sowing',
    note: 'Hybrid 512 sown in rows on the South Field.',
    photoIds: ['photo-seedbed'],
  },
];

/** 📋 Harvests already recorded, newest first. */
export const DEMO_HARVEST_RECORDS: readonly HarvestRecord[] = [
  {
    id: 'harv-tomato-2',
    cropId: 'crop-tomato',
    date: '24 Sep 2026',
    quantityKg: 60,
    value: 1800,
  },
  {
    id: 'harv-tomato-1',
    cropId: 'crop-tomato',
    date: '20 Sep 2026',
    quantityKg: 45,
    value: 1350,
  },
  {
    id: 'harv-maize-1',
    cropId: 'crop-maize',
    date: '22 Aug 2026',
    quantityKg: 800,
    value: 18400,
  },
];

/** The crops as dropdown options, for the two forms on the journal screen. */
export function cropOptionsFor(crops: readonly JournalCrop[]): SelectOption[] {
  return crops.map((crop) => ({
    value: crop.id,
    label: `${crop.emoji}  ${crop.name} – ${crop.fieldName}`,
  }));
}

/** Looks up one crop, or `undefined` when the id is unknown. */
export function findCrop(
  crops: readonly JournalCrop[],
  cropId: string
): JournalCrop | undefined {
  return crops.find((crop) => crop.id === cropId);
}

/** The photos behind a list of photo ids, in the order they were attached. */
export function photosForIds(photoIds: readonly string[]): JournalPhoto[] {
  return photoIds
    .map((photoId) => DEMO_JOURNAL_PHOTOS.find((photo) => photo.id === photoId))
    .filter((photo): photo is JournalPhoto => Boolean(photo));
}

/**
 * One crop's updates, newest first.
 *
 * The demo list is already in that order, but a backend is not guaranteed to
 * return updates that way, so the order is applied here rather than assumed.
 */
export function updatesForCrop(
  updates: readonly GrowthUpdate[],
  cropId: string
): GrowthUpdate[] {
  return updates
    .filter((update) => update.cropId === cropId)
    .sort((a, b) => compareDisplayDates(a.date, b.date));
}

/** Every recorded harvest, newest first, for the history list. */
export function harvestsNewestFirst(records: readonly HarvestRecord[]): HarvestRecord[] {
  return [...records].sort((a, b) => compareDisplayDates(a.date, b.date));
}

/** Harvest records for one crop. */
export function harvestsForCrop(
  records: readonly HarvestRecord[],
  cropId: string
): HarvestRecord[] {
  return records.filter((record) => record.cropId === cropId);
}

/** ⚖️ Everything harvested, added up in kilograms. */
export function totalHarvestQuantityKg(records: readonly HarvestRecord[]): number {
  return Math.round(records.reduce((total, record) => total + record.quantityKg, 0));
}

/** 💰 What those harvests were worth, added up in rupees. */
export function totalHarvestValue(records: readonly HarvestRecord[]): number {
  return Math.round(records.reduce((total, record) => total + record.value, 0));
}

/** How many different crops have been harvested. */
export function harvestedCropCount(records: readonly HarvestRecord[]): number {
  return new Set(records.map((record) => record.cropId)).size;
}

/** How far through its stages a crop is, as a whole number from 0 to 100. */
export function stageProgress(stage: CropStage): number {
  const index = CROP_STAGE_ORDER.indexOf(stage);

  if (index < 0) {
    return 0;
  }

  return Math.round((index / (CROP_STAGE_ORDER.length - 1)) * 100);
}

/**
 * Moves one crop to a new stage.
 *
 * The journal is the record of what actually happened in the field, so once an
 * update is logged the crop follows the stage of that update instead of keeping
 * the stage it started with.
 */
export function withCropStage(
  crops: readonly JournalCrop[],
  cropId: string,
  stage: CropStage
): JournalCrop[] {
  return crops.map((crop) => (crop.id === cropId ? { ...crop, stage } : crop));
}

/**
 * Builds a growth update from the form.
 *
 * The id combines the time so two updates added in the same second still get
 * separate keys, and the date is the current day in the same "24 Sep 2026" style
 * the rest of the app uses.
 */
export function createGrowthUpdate(
  cropId: string,
  stage: CropStage,
  note: string,
  photoIds: readonly string[]
): GrowthUpdate {
  return {
    id: `upd-${Date.now()}`,
    cropId,
    date: formatToday(),
    stage,
    note: note.trim(),
    photoIds: [...photoIds],
  };
}

/** Builds a harvest record from the form, with the quantity already in kilograms. */
export function createHarvestRecord(
  cropId: string,
  quantityKg: number,
  value: number
): HarvestRecord {
  return {
    id: `harv-${Date.now()}`,
    cropId,
    date: formatToday(),
    quantityKg: Math.round(quantityKg),
    value: Math.round(value),
  };
}

const MONTHS = [
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
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Reads a display date such as "20 Oct 2026" back into a Date.
 *
 * Dates are kept as text so they read the way they were written, which means
 * they are parsed here by hand instead of with `new Date(string)`. That form is
 * not reliably supported across JavaScript engines. Returns `null` when the text
 * is not a date we recognise, so a bad value can never crash a screen.
 */
export function parseDisplayDate(label: string): Date | null {
  const parts = label.trim().split(' ');

  if (parts.length !== 3) {
    return null;
  }

  const day = Number(parts[0]);
  const monthIndex = MONTHS.indexOf(parts[1]);
  const year = Number(parts[2]);

  if (!Number.isInteger(day) || !Number.isInteger(year) || monthIndex < 0) {
    return null;
  }

  return new Date(year, monthIndex, day);
}

/** 🌾 Whole days from today until the expected harvest date. Negative when late. */
export function daysUntilHarvest(
  expectedHarvest: string,
  today: Date = new Date()
): number | null {
  const target = parseDisplayDate(expectedHarvest);

  if (!target) {
    return null;
  }

  // Both dates are compared from midnight, so a partial day never rounds oddly.
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return Math.round((target.getTime() - startOfToday.getTime()) / MS_PER_DAY);
}

/** Turns a day count into the short phrase shown next to the harvest date. */
export function describeDaysToHarvest(days: number | null): string {
  if (days === null) {
    return 'Date not set';
  }
  if (days === 0) {
    return 'Due today';
  }
  if (days === 1) {
    return 'In 1 day';
  }
  if (days > 1) {
    return `In ${days} days`;
  }

  const overdue = Math.abs(days);
  return overdue === 1 ? '1 day overdue' : `${overdue} days overdue`;
}

/**
 * Groups digits the Indian way, so 1250 is "1,250" and 123456 is "1,23,456".
 *
 * Done by hand for the same reason `formatRupees` does it: locale data is not
 * guaranteed on every device, so `toLocaleString` could give a different answer
 * on a different phone.
 */
function groupDigits(value: number): string {
  const digits = Math.abs(Math.round(value)).toString();

  if (digits.length <= 3) {
    return digits;
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

  return `${groups.join(',')},${lastThree}`;
}

/** ⚖️ A quantity ready for display, for example "800 kg" or "1,250 kg". */
export function formatHarvestQuantity(quantityKg: number): string {
  return `${groupDigits(quantityKg)} kg`;
}

/**
 * Newest first.
 *
 * When a date cannot be parsed the two entries keep their existing order, so one
 * bad record can never push a good one off the top of the list.
 */
function compareDisplayDates(a: string, b: string): number {
  const first = parseDisplayDate(a);
  const second = parseDisplayDate(b);

  if (!first || !second) {
    return 0;
  }

  return second.getTime() - first.getTime();
}
