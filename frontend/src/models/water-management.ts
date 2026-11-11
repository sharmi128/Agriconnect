/**
 * Water Management model and demo data.
 *
 * This is the data behind the Water Management screen: how much water each field
 * is holding, how thirsty the crops in them are, how the farm is watered, when
 * each field is next due, what the rain has been doing, and what can be done to
 * use less of it.
 *
 * ── What this file deliberately does not contain ────────────────────────────
 *
 * There are no pump sizes, no litres per acre and no tank volumes. Watering
 * amounts depend on the soil, the field size, the pump and the crop, so they
 * belong to the farmer's local agricultural officer rather than to an app. What
 * is here is the part an app can be honest about: whether a field needs water,
 * what to aim for in plain words, and when to come back and look again.
 *
 * The numbers that do appear are the same ones the rest of the app already uses.
 * The 5 cm of standing water on the paddy comes from the irrigation reminder in
 * `models/notifications.ts`, and the 60 mm of rain on Wednesday comes from the
 * weather alert in `models/weather.ts`, so a farmer reading both screens is
 * reading one story rather than two.
 *
 * All content is local demo data. There is no API call, and the shapes below are
 * what an irrigation endpoint is expected to return later.
 */

import type { LandAreaUnit } from '@/models/app-settings';
import { formatAcres } from '@/models/farm';

/** How much water a field is holding right now. */
export type WaterLevel = 'adequate' | 'low' | 'due' | 'not-needed';

/** The short word shown on a status badge, one per level. */
export const WATER_LEVEL_LABELS: Record<WaterLevel, string> = {
  adequate: 'Adequate',
  low: 'Low',
  due: 'Water today',
  'not-needed': 'Not needed',
};

/** How urgent a 📅 watering reminder is. */
export type ReminderPriority = 'today' | 'soon' | 'later';

/** 💧 What one field is holding, and what to do about it. */
export type FieldWaterStatus = {
  /** Matches the `id` of the field in `models/farm.ts`. */
  fieldId: string;
  level: WaterLevel;
  /** The reading in plain words, for example "Standing water at 5 cm". */
  reading: string;
  /** What the farmer should do today, or why nothing is needed. */
  action: string;
  /** Days since this field was last watered. `null` when it never has been. */
  daysSinceIrrigation: number | null;
};

/** 🌱 How much water one crop generally wants. */
export type CropWaterNeed = {
  crop: string;
  emoji: string;
  /** How thirsty the crop is overall. */
  demand: 'High' | 'Medium' | 'Low';
  /** How often it generally needs water, in words rather than in days. */
  frequency: string;
  note: string;
};

/** 📅 One field waiting to be watered. */
export type WateringReminder = {
  id: string;
  fieldId: string;
  fieldName: string;
  crop: string;
  emoji: string;
  /** Plain wording for when it is due, for example "Today" or "In 2 days". */
  dueLabel: string;
  /** Display date, for example "28 Sep 2026". */
  dueOn: string;
  /** What to aim for, in words rather than in a volume. */
  instruction: string;
  priority: ReminderPriority;
};

/** 🌧️ Rain that has already fallen, over one stretch of time. */
export type RainfallRecord = {
  id: string;
  /** What stretch of time this covers, for example "Last 7 days". */
  label: string;
  /** Total rain over that stretch, in millimetres. */
  totalMm: number;
  note: string;
};

/** 🌧️ Rain expected on one day of the forecast. */
export type RainfallExpectation = {
  day: string;
  date: string;
  emoji: string;
  /** Chance of rain, as written on the forecast, for example "70%". */
  rainChance: string;
  /** Expected rain in millimetres, or `null` when none is expected. */
  expectedMm: number | null;
};

/** 💡 One habit that lowers how much water a field needs. */
export type WaterSavingTip = {
  id: string;
  title: string;
  detail: string;
};

/** One of the ways a farm can be watered, for the 🚿 comparison list. */
export type IrrigationTypeNote = {
  id: IrrigationTypeId;
  emoji: string;
  /** Matches a value in `IRRIGATION_OPTIONS` in `models/farmer-profile.ts`. */
  name: string;
  detail: string;
  /** What it costs you, in water or in effort. Worth reading before switching. */
  tradeoff: string;
};

export type IrrigationTypeId = 'well' | 'borewell' | 'canal' | 'river' | 'pond' | 'rain' | 'drip' | 'sprinkler';

/**
 * 🚿 The ways a farm can be watered.
 *
 * The names match the options on the farmer profile, so the card can mark the one
 * that is actually in use. Every option carries a tradeoff as well as a
 * description, because the question a farmer is really asking is not "what is
 * drip irrigation" but "would drip suit me".
 */
export const IRRIGATION_TYPE_NOTES: readonly IrrigationTypeNote[] = [
  {
    id: 'well',
    emoji: '\u{1F6B1}',
    name: 'Well',
    detail: 'Water lifted from a well inside the farm, whenever you decide to.',
    tradeoff: 'Costs pump electricity and labour, but the timing is entirely yours.',
  },
  {
    id: 'borewell',
    emoji: '\u{1F6E1}',
    name: 'Borewell',
    detail: 'A deeper well, usually giving a stronger and steadier supply than a well.',
    tradeoff: 'The strongest option on the farm, and the most expensive one to put in and run.',
  },
  {
    id: 'canal',
    emoji: '\u{1F30A}',
    name: 'Canal',
    detail: 'Gravity-fed water from a canal, taken at set times on a rota.',
    tradeoff: 'Almost free in electricity, but you irrigate when the canal says so, not when the field needs it. Check the closure dates before a dry spell.',
  },
  {
    id: 'river',
    emoji: '\u{1F4A7}',
    name: 'River',
    detail: 'Lifting water from a river or stream close to the farm.',
    tradeoff: 'Reliable while the river holds, and it does not during a dry spell, which is exactly when you need it most.',
  },
  {
    id: 'pond',
    emoji: '\u{1FAA3}',
    name: 'Pond',
    detail: 'Rain and runoff collected on the farm and stored for later use.',
    tradeoff: 'Free water once the pond is full, but the storage has to be built and kept clean, and evaporation takes a slice every year.',
  },
  {
    id: 'rain',
    emoji: '\u{1F327}',
    name: 'Rain-fed',
    detail: 'No irrigation at all, relying on the season\u2019s rain.',
    tradeoff: 'Nothing to pay and nothing to maintain, which makes millets and groundnut the sensible crops on such a field.',
  },
  {
    id: 'drip',
    emoji: '\u{1F4A7}',
    name: 'Drip Irrigation',
    detail: 'Slow water through pipes laid along the rows, straight onto each root.',
    tradeoff: 'Uses the least water of anything here and cuts weeds, but the lines and filters need cleaning or they clog.',
  },
  {
    id: 'sprinkler',
    emoji: '\u{1F4A8}',
    name: 'Sprinkler Irrigation',
    detail: 'Water sprayed over the field from overhead sprinklers.',
    tradeoff: 'Good for field crops like wheat, but wind carries some away and it uses more water than drip.',
  },
];

/**
 * 💧 The water in each field.
 *
 * The field ids point at `DEMO_FARM`, so the name, size and crop on each row come
 * from the farm itself instead of being repeated here. North Field is doing well
 * because it is low-lying and holds water, East Field is the one that needs
 * attention, and South Field is fallow, so it is left out of the reminders below
 * rather than being watered for the sake of a complete list.
 */
export const DEMO_FIELD_WATER: readonly FieldWaterStatus[] = [
  {
    fieldId: 'field-north',
    level: 'adequate',
    reading: 'Standing water at 5 cm across most of the plot',
    action: 'No action needed. Keep an eye on it after the rain on Wednesday.',
    daysSinceIrrigation: 4,
  },
  {
    fieldId: 'field-east',
    level: 'due',
    reading: 'Soil dry to about 12 cm, and the tomato rows are wilting by noon',
    action: 'Irrigate today, early morning or late evening. The rain is not due until Wednesday.',
    daysSinceIrrigation: 3,
  },
  {
    fieldId: 'field-south',
    level: 'not-needed',
    reading: 'Fallow, and holding moisture from the compost worked in earlier',
    action: 'Nothing to water. Keep the surface covered so it does not dry out.',
    daysSinceIrrigation: null,
  },
];

/**
 * 🌱 How thirsty the crops on this farm are.
 *
 * The numbers are words on purpose. A crop does not need "3.2 units of water a
 * week", it needs water often and evenly, or rarely and deeply, and that is the
 * distinction a farmer can act on without a soil test in hand.
 */
export const CROP_WATER_NEEDS: readonly CropWaterNeed[] = [
  {
    crop: 'Paddy',
    emoji: '\u{1F33E}',
    demand: 'High',
    frequency: 'Keep standing water, refreshing it as it seeps away',
    note: 'Paddy grows in flooded soil, so the water is held on purpose rather than drained off. Alternate wetting and drying between irrigations cuts the water used without hurting the crop.',
  },
  {
    crop: 'Tomato',
    emoji: '\u{1F345}',
    demand: 'High',
    frequency: 'Light and often, keeping the soil evenly moist',
    note: 'Tomato has shallow roots and a fruit that has to fill, so it suffers from both dry soil and waterlogged soil. Steady moisture is what keeps the fruit from splitting.',
  },
  {
    crop: 'Coconut',
    emoji: '\u{1F965}',
    demand: 'Medium',
    frequency: 'Deep and infrequent, around every two weeks in dry weather',
    note: 'Coconut sends its roots wide and deep, so it copes with longer gaps than a vegetable crop. A thick mulch around the base is worth more than an extra watering.',
  },
  {
    crop: 'Vegetables',
    emoji: '\u{1F33D}',
    demand: 'High',
    frequency: 'Most often of anything, because the roots sit near the surface',
    note: 'Leafy and root vegetables show a missed watering within a day. Drip lines under the rows save more water here than any other change, because they put the water where the roots are.',
  },
  {
    crop: 'Millets',
    emoji: '\u{1F33E}',
    demand: 'Low',
    frequency: 'Rarely, and only in a long dry spell',
    note: 'Millets are grown precisely for fields that do not get much water, so they are the right crop to leave unwatered rather than the wrong one to keep.',
  },
];

/**
 * 📅 The fields waiting to be watered, soonest first.
 *
 * A fallow field does not get a reminder to irrigate a crop, because there is no
 * crop to irrigate and a reminder like that would train a farmer to ignore the
 * ones that matter. South Field does appear, but only for the water a fallow field
 * genuinely needs: keeping the compost in it wet so it is ready for the next
 * sowing. A crop name of "Fallow" is the signal that this row is about the soil,
 * not a planting.
 */
export const DEMO_WATERING_REMINDERS: readonly WateringReminder[] = [
  {
    id: 'reminder-east-tomato',
    fieldId: 'field-east',
    fieldName: 'East Field',
    crop: 'Tomato',
    emoji: '\u{1F345}',
    dueLabel: 'Today',
    dueOn: '28 Sep 2026',
    instruction: 'Irrigate the rows evenly and stop before it starts to puddle.',
    priority: 'today',
  },
  {
    id: 'reminder-north-paddy',
    fieldId: 'field-north',
    fieldName: 'North Field',
    crop: 'Paddy',
    emoji: '\u{1F33E}',
    dueLabel: 'In 2 days',
    dueOn: '30 Sep 2026',
    instruction: 'Top the standing water back up to 5 cm once Wednesday\u2019s rain has drained.',
    priority: 'soon',
  },
  {
    id: 'reminder-south-prep',
    fieldId: 'field-south',
    fieldName: 'South Field',
    crop: 'Fallow',
    emoji: '\u{1F33E}',
    dueLabel: 'In 5 days',
    dueOn: '02 Oct 2026',
    instruction: 'Water the compost in before the next sowing, so it starts working immediately.',
    priority: 'later',
  },
];

/** 🌧️ Rain that has already fallen on this farm. */
export const DEMO_RAINFALL: readonly RainfallRecord[] = [
  {
    id: 'rainfall-week',
    label: 'Last 7 days',
    totalMm: 22,
    note: 'Two light showers. Enough to keep the seedbed moist, nowhere near enough to call off an irrigation.',
  },
  {
    id: 'rainfall-month',
    label: 'Last 30 days',
    totalMm: 118,
    note: 'A normal month for this area. The North Field is holding its water because it is low-lying, not because the rain has been heavy.',
  },
];

/**
 * 🌧️ The rain expected next, taken from the same week the ⚠️ weather alerts
 * describe, so the two screens cannot tell a farmer different stories.
 */
export const DEMO_RAINFALL_EXPECTED: readonly RainfallExpectation[] = [
  { day: 'Today', date: '28 Sep', emoji: '\u{1F324}\uFE0F', rainChance: '20%', expectedMm: null },
  { day: 'Tue', date: '29 Sep', emoji: '\u{1F326}\uFE0F', rainChance: '20%', expectedMm: null },
  { day: 'Wed', date: '30 Sep', emoji: '\u{1F327}\uFE0F', rainChance: '80%', expectedMm: 60 },
  { day: 'Thu', date: '01 Oct', emoji: '\u{1F327}\uFE0F', rainChance: '40%', expectedMm: 12 },
  { day: 'Fri', date: '02 Oct', emoji: '\u{1F326}\uFE0F', rainChance: '10%', expectedMm: null },
];

/** 💡 Habits that lower the water a field needs, rather than supplying more of it. */
export const WATER_SAVING_TIPS: readonly WaterSavingTip[] = [
  {
    id: 'drip',
    title: 'Put the water at the roots',
    detail:
      'Drip lines and sprinklers deliver water to the rows instead of the gaps between them. On a vegetable field this is usually the single biggest saving available, and it cuts the weeds you have to water too.',
  },
  {
    id: 'mulch',
    title: 'Cover the soil',
    detail:
      'Straw, leaves or a layer of compost cut evaporation and stop the soil crusting over. It also keeps weeds down, so you are not watering plants you never planted.',
  },
  {
    id: 'alternate-wetting',
    title: 'Alternate wetting and drying in paddy',
    detail:
      'Let the water drop a few days and then let it back in, rather than topping it up every day. It uses noticeably less water and the roots reach further down for it.',
  },
  {
    id: 'early-hours',
    title: 'Irrigate early or late, never at noon',
    detail:
      'Most of the water applied at midday evaporates before it reaches the roots, and it carries soil with it. Early morning loses the least, and late evening is the next best.',
  },
  {
    id: 'repair-leaks',
    title: 'Fix leaks before you look for a bigger source',
    detail:
      'A dripping joint and an over-running channel waste more in a week than most farmers realise. Check the channel ends and the pipe joints at the start of every season.',
  },
  {
    id: 'compost',
    title: 'Add organic matter to the soil',
    detail:
      'Soil with compost in it holds more of the rain that does fall, so the same shower goes further. On sandy soil this is the difference between watering daily and watering twice a week.',
  },
];

/** One acre in hectares, the same conversion the Profile tab uses. */
const ACRES_IN_HECTARES = 0.404686;

/**
 * How a field's size is written, using the 📐 unit the farmer chose on the Profile
 * tab. Fields are read from `models/farm.ts`, so the two screens cannot disagree
 * about how big a plot is, and the unit is applied here rather than stored, so
 * changing the setting never changes the underlying number.
 */
export function fieldAreaLabel(areaAcres: string, unit: LandAreaUnit): string {
  const acres = Number(areaAcres) || 0;

  if (unit === 'hectares') {
    const hectares = Math.round(acres * ACRES_IN_HECTARES * 100) / 100;

    return `${hectares} ${hectares === 1 ? 'hectare' : 'hectares'}`;
  }

  return formatAcres(acres);
}

/** 📅 Soonest first, and the ones still to do before the ones already done. */
export function remindersInOrder(
  reminders: readonly WateringReminder[],
  doneIds: readonly string[]
): WateringReminder[] {
  return [...reminders].sort((a, b) => {
    if (doneIds.includes(a.id) !== doneIds.includes(b.id)) {
      return doneIds.includes(a.id) ? 1 : -1;
    }

    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });
}

const PRIORITY_ORDER: Record<ReminderPriority, number> = {
  today: 0,
  soon: 1,
  later: 2,
};

/** 📅 How many reminders are still waiting. */
export function pendingReminderCount(
  reminders: readonly WateringReminder[],
  doneIds: readonly string[]
): number {
  return reminders.filter((reminder) => !doneIds.includes(reminder.id)).length;
}

/** 📅 The one reminder a farmer should deal with first, or `undefined` if none. */
export function nextReminder(
  reminders: readonly WateringReminder[],
  doneIds: readonly string[]
): WateringReminder | undefined {
  return remindersInOrder(reminders, doneIds).find((reminder) => !doneIds.includes(reminder.id));
}

/** 💧 The one-word summary for the page subtitle. */
export function waterSummary(statuses: readonly FieldWaterStatus[]): string {
  const planted = statuses.filter((status) => status.level !== 'not-needed');

  if (planted.length === 0) {
    return 'No planted fields';
  }

  const due = planted.filter((status) => status.level === 'due').length;
  const low = planted.filter((status) => status.level === 'low').length;

  if (due > 0) {
    return due === 1 ? '1 field needs water today' : `${due} fields need water today`;
  }

  if (low > 0) {
    return low === 1 ? '1 field is running low' : `${low} fields are running low`;
  }

  return planted.length === 1 ? '1 planted field has enough' : `${planted.length} planted fields have enough`;
}

/** 🌧️ The total rain expected in the forecast, in millimetres. */
export function expectedRainMm(expectations: readonly RainfallExpectation[]): number {
  return expectations.reduce((total, entry) => total + (entry.expectedMm ?? 0), 0);
}

/** 🌧️ The wettest day coming up, which is the day a farmer plans around. */
export function wettestDay(
  expectations: readonly RainfallExpectation[]
): RainfallExpectation | undefined {
  return expectations.reduce<RainfallExpectation | undefined>(
    (wettest, entry) => ((entry.expectedMm ?? 0) > (wettest?.expectedMm ?? 0) ? entry : wettest),
    undefined
  );
}
