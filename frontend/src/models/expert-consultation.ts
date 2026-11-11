/**
 * Expert Consultation model and demo data.
 *
 * This is the data behind the Expert Consultation screen: who advises farmers,
 * which crops each of them knows best, where they work, and the questions and
 * consultation requests the farmer has raised.
 *
 * ── What this file deliberately does not contain ────────────────────────────
 *
 * No star ratings, no review counts and no "verified" badges. Every one of those
 * is a claim about a real person, and a demo database full of invented five-star
 * reviews is the fastest way to teach a farmer that numbers on a screen mean
 * nothing. What is here instead is verifiable-shaped: a name, a qualification,
 * which crops a person actually covers, the languages they speak, and how they
 * can be reached.
 *
 * ── Honest about what this is ──────────────────────────────────────────────
 *
 * There is no API call. `askQuestion` and `requestConsultation` validate on the
 * device and return a local object; nothing is sent, no expert is notified, and
 * nothing is stored between app restarts. The reply times shown are demo content
 * describing what usually happens, not a guarantee from anyone.
 */

import { DEMO_JOURNAL_CROPS, cropOptionsFor } from '@/models/crop-journal';
import type { SelectOption } from '@/models/farmer-profile';
import { hasErrors, validateRequired, type FieldErrors } from '@/utils/validation';

/** How a farmer meets an expert. */
export type ConsultationMode = 'call' | 'visit' | 'video';

/** The short word shown on a badge, one per mode. */
export const CONSULTATION_MODE_LABELS: Record<ConsultationMode, string> = {
  call: 'Phone call',
  visit: 'Farm visit',
  video: 'Video call',
};

/** The one-line explanation under each mode badge. */
export const CONSULTATION_MODE_NOTES: Record<ConsultationMode, string> = {
  call: 'The expert calls you. Fastest, and needs no travel.',
  visit: 'The expert comes to the field. Slowest, and the most useful for a problem you cannot photograph.',
  video: 'A video call, so you can show the leaves or the water level while you talk.',
};

/** How far a farmer is willing to go, which narrows the expert list. */
export type DistanceFilter = 'all' | 'nearby' | 'anywhere';

/** 👨‍🌾 One person a farmer can ask. */
export type Expert = {
  id: string;
  emoji: string;
  name: string;
  /** The job title, for example "Horticulture Officer". */
  title: string;
  /** What they actually studied or is certified in. */
  qualification: string;
  yearsExperience: number;
  /** Crop names this person is known for, matched against the app's crops. */
  crops: string[];
  /** The one-line reason to pick this person. */
  specialty: string;
  /** The office or area they work from. */
  base: string;
  distanceKm: number;
  /** Languages a farmer can ask in. */
  languages: string[];
  modes: ConsultationMode[];
  /** What usually happens after a request. Demo content. */
  responseTime: string;
};

/** 📅 A slot a farmer can ask for. */
export type ConsultationSlot = {
  id: string;
  /** Shown to the farmer, for example "Wed 30 Sep". */
  label: string;
  /** ISO date, so the day can be compared and sorted. */
  iso: string;
  /** Which modes this slot supports. */
  modes: ConsultationMode[];
};

/** Where a question has got to. */
export type QuestionStatus = 'sent' | 'answered' | 'closed';

/** The short word shown on a badge, one per status. */
export const QUESTION_STATUS_LABELS: Record<QuestionStatus, string> = {
  sent: 'With the expert',
  answered: 'Answered',
  closed: 'Closed',
};

/** 💬 One question a farmer has asked, and what came back. */
export type AskedQuestion = {
  id: string;
  expertId: string;
  expertName: string;
  cropName: string;
  question: string;
  askedOn: string;
  status: QuestionStatus;
  /** What the expert said. `null` while it is still with them. */
  answer: string | null;
  /** True when this row came from the demo data rather than from this device. */
  isDemo: boolean;
};

/** 👨‍🌾 The experts a farmer can ask, nearest first in the data itself. */
export const DEMO_EXPERTS: readonly Expert[] = [
  {
    id: 'expert-ramesh',
    emoji: '\u{1F468}\u200D\u{1F33E}',
    name: 'Ramesh Kumar',
    title: 'Horticulture Officer',
    qualification: 'MSc in Horticulture, 12 years in the county extension service',
    yearsExperience: 12,
    crops: ['Tomato', 'Paddy'],
    specialty: 'Vegetable problems: leaf disease, fruit rot, and why a tomato row stops setting fruit.',
    base: 'Block Agricultural Office',
    distanceKm: 4,
    languages: ['Tamil', 'English'],
    modes: ['call', 'visit', 'video'],
    responseTime: 'Usually answers a phone question the same day.',
  },
  {
    id: 'expert-lakshmi',
    emoji: '\u{1F469}\u200D\u{1F33E}',
    name: 'Lakshmi Narayanan',
    title: 'Rice Specialist',
    qualification: 'Specialist in paddy, 9 years advising coastal clay soils',
    yearsExperience: 9,
    crops: ['Paddy'],
    specialty: 'Paddy from sowing to harvest: standing water, nitrogen timing, blast and stem borer.',
    base: 'Irrigation Section, Block Office',
    distanceKm: 11,
    languages: ['Tamil', 'English', 'Malayalam'],
    modes: ['call', 'visit'],
    responseTime: 'Usually answers within a day, and visits the same week if it is serious.',
  },
  {
    id: 'expert-anjali',
    emoji: '\u{1F469}\u200D\u{1F4BB}',
    name: 'Anjali Menon',
    title: 'Soil & Water Engineer',
    qualification: 'BEng Agricultural Engineering, 7 years in irrigation planning',
    yearsExperience: 7,
    crops: ['Paddy', 'Maize', 'Tomato'],
    specialty: 'Water and soil: drainage, salinity, and getting a pump to water a field evenly.',
    base: 'District Engineering Unit',
    distanceKm: 26,
    languages: ['English', 'Malayalam'],
    modes: ['video', 'visit'],
    responseTime: 'Books a slot about a week ahead.',
  },
  {
    id: 'expert-suresh',
    emoji: '\u{1F468}\u200D\u{1F4BB}',
    name: 'Suresh Babu',
    title: 'Plant Protection Assistant',
    qualification: 'Diploma in Plant Protection, 6 years in pest surveillance',
    yearsExperience: 6,
    crops: ['Tomato', 'Maize'],
    specialty: 'Identifying a pest before it spreads, and spraying in a way that keeps it off the harvest.',
    base: 'Krishi Vigyan Kendra',
    distanceKm: 38,
    languages: ['Tamil', 'Telugu', 'English'],
    modes: ['call', 'video'],
    responseTime: 'Usually answers the same day, and is best on a photo of the affected leaf.',
  },
];

/**
 * 📅 The next slots a farmer can ask for.
 *
 * Deliberately only four, and all within the week. A long calendar of dates a
 * farmer cannot act on is noise; four real-looking slots is a decision.
 */
export const DEMO_SLOTS: readonly ConsultationSlot[] = [
  { id: 'slot-1', label: 'Wed 30 Sep', iso: '2026-09-30', modes: ['call', 'video'] },
  { id: 'slot-2', label: 'Thu 01 Oct', iso: '2026-10-01', modes: ['call', 'visit', 'video'] },
  { id: 'slot-3', label: 'Sat 03 Oct', iso: '2026-10-03', modes: ['visit'] },
  { id: 'slot-4', label: 'Mon 05 Oct', iso: '2026-10-05', modes: ['call', 'video', 'visit'] },
];

/**
 * 💬 Questions already asked, so the section is not empty on arrival.
 *
 * Every row is marked `isDemo`. A farmer must be able to tell the difference
 * between something a real expert said and something this app made up.
 */
export const DEMO_QUESTIONS: readonly AskedQuestion[] = [
  {
    id: 'question-demo-tomato-leaf',
    expertId: 'expert-ramesh',
    expertName: 'Ramesh Kumar',
    cropName: 'Tomato',
    question: 'The lower leaves on my tomato rows are turning yellow from the bottom up.',
    askedOn: '22 Sep 2026',
    status: 'answered',
    answer:
      'Start at the bottom and work up, with no spots on the leaf, that is nitrogen the plant cannot reach rather than a disease. Check the soil is moist two fingers down before adding anything, and do not feed a plant that is already dry.',
    isDemo: true,
  },
  {
    id: 'question-demo-paddy-water',
    expertId: 'expert-lakshmi',
    expertName: 'Lakshmi Narayanan',
    cropName: 'Paddy',
    question: 'Should I drain my paddy field for a week before harvest?',
    askedOn: '25 Sep 2026',
    status: 'sent',
    answer: null,
    isDemo: true,
  },
];

/** 🌱 The app's own crops as dropdown options, so the form cannot invent one. */
export const EXPERT_CROP_OPTIONS: SelectOption[] = cropOptionsFor(DEMO_JOURNAL_CROPS);

/** 📝 What the question form collects. */
export type QuestionFormValues = {
  cropName: string;
  question: string;
};

/** 📅 What the consultation request collects. */
export type ConsultationFormValues = {
  expertId: string;
  slotId: string;
  mode: string;
};

/** 📅 A consultation booking, kept on this device only. */
export type ConsultationRequest = {
  id: string;
  expertId: string;
  expertName: string;
  slotLabel: string;
  mode: ConsultationMode;
  requestedOn: string;
  isDemo: false;
};

/** Shortest question worth an expert's time, so a one-word form is rejected. */
const MIN_QUESTION_LENGTH = 15;

/**
 * 📝 Validates the question.
 *
 * A vague question cannot be answered, so the check is about being specific
 * enough to act on rather than about grammar or spelling.
 */
export function validateQuestionForm(values: QuestionFormValues): FieldErrors<QuestionFormValues> {
  const errors: FieldErrors<QuestionFormValues> = {};

  if (values.cropName.length === 0) {
    errors.cropName = 'Choose the crop the question is about.';
  }

  const cropError = validateRequired(values.question, 'Your question');
  if (cropError) {
    errors.question = cropError;
  } else if (values.question.trim().length < MIN_QUESTION_LENGTH) {
    errors.question = `Add a little more detail, ${MIN_QUESTION_LENGTH} characters or more, so the expert can answer it.`;
  }

  return errors;
}

/** 📅 Validates the booking against the slot and mode actually chosen. */
export function validateConsultationForm(
  values: ConsultationFormValues
): FieldErrors<ConsultationFormValues> {
  const errors: FieldErrors<ConsultationFormValues> = {};

  if (values.expertId.length === 0) {
    errors.expertId = 'Choose the expert you want to talk to.';
  }

  const slot = DEMO_SLOTS.find((entry) => entry.id === values.slotId);
  if (!slot) {
    errors.slotId = 'Choose a day that suits you.';
  }

  if (values.mode.length === 0) {
    errors.mode = 'Choose how you want to meet.';
  } else if (slot && !slot.modes.includes(values.mode as ConsultationMode)) {
    // Caught because the mode list changes with the day. Booking a farm visit on
    // a day with no visits would be a wasted journey for the farmer.
    errors.mode = 'That expert does not do this on the day you picked. Pick another day or another way to meet.';
  }

  return errors;
}

/** 📅 The days an expert can actually be met, as dropdown options. */
export function slotOptionsForExpert(expert: Expert | undefined): SelectOption[] {
  if (!expert) {
    return [];
  }

  return DEMO_SLOTS.filter((slot) =>
    slot.modes.some((mode) => expert.modes.includes(mode))
  ).map((slot) => ({ label: slot.label, value: slot.id }));
}

/** 📝 Saves a question locally, or returns `null` when it is not ready. */
export function askQuestion(
  values: QuestionFormValues,
  expert: Expert | undefined,
  sequence: number
): AskedQuestion | null {
  if (hasErrors(validateQuestionForm(values)) || !expert) {
    return null;
  }

  return {
    id: `question-local-${sequence}`,
    cropName: values.cropName,
    question: values.question.trim(),
    expertId: expert.id,
    expertName: expert.name,
    askedOn: todayLabel(),
    // Always "sent" and never answered, because nothing is sent. The row stays in
    // the list with a waiting badge so the farmer can see it was recorded.
    status: 'sent',
    answer: null,
    isDemo: false,
  };
}

/** 📅 Saves a booking locally, or returns `null` when it is not ready. */
export function requestConsultation(
  values: ConsultationFormValues,
  expert: Expert | undefined,
  sequence: number
): ConsultationRequest | null {
  if (hasErrors(validateConsultationForm(values)) || !expert) {
    return null;
  }

  const slot = DEMO_SLOTS.find((entry) => entry.id === values.slotId);

  return {
    id: `consult-local-${sequence}`,
    expertId: expert.id,
    expertName: expert.name,
    slotLabel: slot?.label ?? '',
    mode: values.mode as ConsultationMode,
    requestedOn: todayLabel(),
    isDemo: false,
  };
}

/** 📅 `18 Sep 2026`, the format the rest of the demo data uses. */
function todayLabel(): string {
  const now = new Date();
  const months = [
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

  return `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

/** 👨‍🌾 The experts, narrowed to how far the farmer will travel. */
export function expertsWithin(
  experts: readonly Expert[],
  filter: DistanceFilter
): Expert[] {
  if (filter === 'anywhere') {
    return [...experts];
  }

  if (filter === 'nearby') {
    return experts.filter((expert) => expert.distanceKm <= 15);
  }

  return [...experts];
}

/** 🌱 The experts who actually cover a crop, so the list is never a guess. */
export function expertsForCrop(experts: readonly Expert[], cropName: string): Expert[] {
  if (cropName.length === 0) {
    return [...experts];
  }

  return experts.filter((expert) => expert.crops.includes(cropName));
}

/** 🌱 The crops every expert in the list can answer for. */
function commonCrops(experts: readonly Expert[]): string[] {
  const counts = new Map<string, number>();

  for (const expert of experts) {
    for (const crop of expert.crops) {
      counts.set(crop, (counts.get(crop) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([crop]) => crop);
}

/** 💬 Newest question first, so the one just asked is at the top. */
export function questionsNewestFirst(questions: readonly AskedQuestion[]): AskedQuestion[] {
  return [...questions].sort((a, b) => (a.isDemo === b.isDemo ? b.id.localeCompare(a.id) : a.isDemo ? 1 : -1));
}

/** 💬 One line for the section heading, counting only what is still open. */
export function questionSummary(questions: readonly AskedQuestion[]): string {
  const waiting = questions.filter((question) => question.status === 'sent').length;

  if (questions.length === 0) {
    return 'No questions yet';
  }

  const base = `${questions.length} ${questions.length === 1 ? 'question' : 'questions'}`;

  return waiting > 0 ? `${base} \u00B7 ${waiting} still with the expert` : base;
}

/** 👨‍🌾 One line for the page subtitle. */
export function expertSummary(experts: readonly Expert[]): string {
  return `${experts.length} experts across ${commonCrops(experts).length} crops`;
}
