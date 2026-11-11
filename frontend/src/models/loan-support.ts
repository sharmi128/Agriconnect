/**
 * Loan & Support model and demo data.
 *
 * This is the data behind the Loan & Support screen: the loans a farmer can ask
 * about, the support schemes that sit alongside them, the papers an office will
 * want to see, and where to go when the answer is still unclear.
 *
 * ── What this file deliberately does not contain ────────────────────────────
 *
 * No interest rate, no APR, no penalty and no repayment schedule is stated as a
 * fact. Those are set by a lender and they change, and an app that prints a rate
 * a farmer then relies on is worse than one that admits the number is not its to
 * give. So a loan below carries what the farmer can act on — who it is for, what
 * it is for, how long it usually takes — and the rate is left to the officer.
 *
 * The one number that does appear is a range written as "up to", which is the way
 * a lender actually advertises a ceiling. It is demo content and is labelled as
 * such on the screen.
 *
 * ── Honest about what this is ──────────────────────────────────────────────
 *
 * There is no API call. `submitApplication` validates on the device and returns a
 * reference number, but nothing is sent, stored or sent to any office, and the
 * returned application is a local object the screen holds in state for the visit.
 * The status timeline below it is demo data describing what usually happens to a
 * real application, not a live status.
 *
 * Validation runs on the device only, and a real deployment has to run all of it
 * again on the server.
 */

import type { SelectOption } from '@/models/farmer-profile';
import { hasErrors, validateFullName, validatePhone, type FieldErrors } from '@/utils/validation';

/** How a farmer is judged against a loan or scheme before being accepted. */
export type LoanCategory = 'seasonal' | 'equipment' | 'land' | 'livestock';

/** The short word shown on a badge, one per category. */
export const LOAN_CATEGORY_LABELS: Record<LoanCategory, string> = {
  seasonal: 'Seasonal',
  equipment: 'Equipment',
  land: 'Land',
  livestock: 'Livestock',
};

/** Who a loan is meant for, which decides what a farmer is offered. */
export type LoanFor = 'smallholder' | 'cooperative' | 'newcomer' | 'any';

/** The short word shown on a badge, one per audience. */
export const LOAN_FOR_LABELS: Record<LoanFor, string> = {
  smallholder: 'Smallholder',
  cooperative: 'Cooperative',
  newcomer: 'New farmer',
  any: 'Any farmer',
};

/** 💰 One source of money for the farm. */
export type LoanOption = {
  id: string;
  emoji: string;
  name: string;
  provider: string;
  category: LoanCategory;
  forWho: LoanFor;
  /** What the money is meant for, in the lender's own words. */
  purpose: string;
  /** A ceiling, written the way a lender advertises it. Demo content. */
  amountLabel: string;
  /** What the farmer must already have for the loan to be considered. */
  requirement: string;
  /** How long it usually takes, because that is what a farmer plans around. */
  turnaround: string;
  /** The one line that decides whether this is worth the farmer's time. */
  note: string;
};

/** 📋 A scheme that gives something away or reduces a cost, rather than lending. */
export type SupportProgram = {
  id: string;
  emoji: string;
  name: string;
  provider: string;
  /** What the farmer actually receives. */
  benefit: string;
  /** The catch, stated plainly. A scheme with no catch shown is a trap. */
  requirement: string;
  /** How to ask for it. */
  howToApply: string;
};

/** 📄 One paper an office will ask for. */
export type RequiredDocument = {
  id: string;
  emoji: string;
  name: string;
  /** Where it comes from, so a farmer knows which counter to visit. */
  issuedBy: string;
  /** Why it is wanted, because a farmer is more willing to go and get it. */
  why: string;
  /** `null` when a farmer without this can still be considered. */
  note?: string;
};

/** 📊 How far a real application has got. */
export type ApplicationStage = 'submitted' | 'documents' | 'assessment' | 'approved';

/** The short word shown on a badge, one per stage. */
export const APPLICATION_STAGE_LABELS: Record<ApplicationStage, string> = {
  submitted: 'Submitted',
  documents: 'Documents check',
  assessment: 'Assessment',
  approved: 'Approved',
};

/** How long each stage usually takes, in plain words. */
export const APPLICATION_STAGE_DURATIONS: Record<ApplicationStage, string> = {
  submitted: 'Same day',
  documents: '3 to 5 days',
  assessment: '1 to 2 weeks',
  approved: 'After assessment',
};

/** One step in the timeline shown under 📊 Application Status. */
export type ApplicationStep = {
  stage: ApplicationStage;
  label: string;
  detail: string;
};

/** 📞 One way to reach a person rather than a form. */
export type HelpContact = {
  id: string;
  emoji: string;
  label: string;
  /** Shown to the farmer, and the value the phone button dials. */
  value: string;
  /** `phone`, `email` or `sms`, which decides how the row opens. */
  kind: 'phone' | 'email' | 'sms';
  note: string;
};

/** 💰 Loans a farmer might ask about, most commonly asked for first. */
export const DEMO_LOANS: readonly LoanOption[] = [
  {
    id: 'loan-seasonal-input',
    emoji: '\u{1F33E}',
    name: 'Seasonal crop loan',
    provider: 'Agricultural Bank',
    category: 'seasonal',
    forWho: 'smallholder',
    purpose: 'Seed, fertilizer and hired labour for one season, repaid after the harvest.',
    amountLabel: 'Up to 150,000',
    requirement: 'At least one season of cropping history you can show records for.',
    turnaround: 'About 2 weeks once the papers are in.',
    note: 'The safest loan to start with, because what it is borrowed for pays it back.',
  },
  {
    id: 'loan-equipment',
    emoji: '\u{1F6E1}\uFE0F',
    name: 'Farm equipment loan',
    provider: 'Cooperative Credit Union',
    category: 'equipment',
    forWho: 'cooperative',
    purpose: 'A pump, sprayer, tiller or thresher, repaid over several years.',
    amountLabel: 'Up to 800,000',
    requirement: 'Two years of cooperative membership.',
    turnaround: 'About 4 weeks, because the equipment is inspected first.',
    note: 'A pump paid for out of saved water usually pays for itself faster than a bigger loan would.',
  },
  {
    id: 'loan-new-farmer',
    emoji: '\u{1F331}',
    name: 'New farmer starter loan',
    provider: 'County Farmers Cooperative',
    category: 'seasonal',
    forWho: 'newcomer',
    purpose: 'A smaller loan for a farmer who has no record of borrowing before.',
    amountLabel: 'Up to 40,000',
    requirement: 'A farm advisor must visit and confirm you are farming.',
    turnaround: 'About 3 weeks.',
    note: 'Built for someone with no paperwork history, so the advisor visit is the whole process.',
  },
  {
    id: 'loan-land',
    emoji: '\u{1F3E1}',
    name: 'Land purchase or improvement loan',
    provider: 'Agricultural Bank',
    category: 'land',
    forWho: 'smallholder',
    purpose: 'Buying land, or improving land you already own, such as levelling or drainage.',
    amountLabel: 'Up to 2,000,000',
    requirement: 'A title deed, and the land must already be zoned for farming.',
    turnaround: '6 to 8 weeks, the longest wait of any of these.',
    note: 'The biggest number here and the hardest to qualify for. Not a first loan.',
  },
];

/** 📋 Schemes that support a farmer without lending anything. */
export const DEMO_SUPPORT_PROGRAMS: readonly SupportProgram[] = [
  {
    id: 'support-subsidy-seed',
    emoji: '\u{1F33E}',
    name: 'Seed and fertilizer subsidy',
    provider: 'Ministry of Agriculture',
    benefit: 'A share of the price of certified seed and fertilizer, taken off at the counter.',
    requirement: 'Register your farm and crop area before the season starts.',
    howToApply: 'Ask at the ward agricultural office, or through your cooperative.',
  },
  {
    id: 'support-training',
    emoji: '\u{1F393}',
    name: 'Farm training and extension visits',
    provider: 'County Extension Service',
    benefit: 'A trained officer visits the farm and advises on the crop being grown.',
    requirement: 'Nothing. Any farmer in the county can ask.',
    howToApply: 'Call the extension office, or ask your cooperative to book a visit.',
  },
  {
    id: 'support-equipment-grant',
    emoji: '\u{1F6E1}\uFE0F',
    name: 'Equipment matching grant',
    provider: 'County Government',
    benefit: 'Part of the cost of a pump, drip line or sprayer, matched against what you pay.',
    requirement: 'Proof you already farm the land, and quotes for the equipment.',
    howToApply: 'Take quotes and your ID to the county agricultural office.',
  },
  {
    id: 'support-warehouse',
    emoji: '\u{1F4E6}',
    name: 'Warehouse receipt loan',
    provider: 'Agricultural Bank',
    benefit: 'Borrow against stored grain instead of selling it at a low price in the season.',
    requirement: 'Grain in a registered warehouse, with a receipt issued.',
    howToApply: 'Ask the bank whether a registered warehouse is near you.',
  },
];

/** 📄 The papers an office asks for, ordered by how hard they are to replace. */
export const DEMO_REQUIRED_DOCUMENTS: readonly RequiredDocument[] = [
  {
    id: 'doc-national-id',
    emoji: '\u{1F4C4}',
    name: 'National ID card',
    issuedBy: 'Held by you, no visit needed.',
    why: 'Everything else is filed against this number.',
    note: 'A copy is enough. Laminated cards are usually not accepted.',
  },
  {
    id: 'doc-land-title',
    emoji: '\u{1F3E1}',
    name: 'Land title deed or lease',
    issuedBy: 'County land office, or whoever holds your lease.',
    why: 'A lender has to know the loan is secured against land you actually control.',
    note: 'A lease works for many lenders, but it must be registered, not a private agreement.',
  },
  {
    id: 'doc-kra-pin',
    emoji: '\u{1F4DD}',
    name: 'KRA PIN certificate',
    issuedBy: 'Kenya Revenue Authority, online or at any tax office.',
    why: 'Needed before any loan is disbursed, whoever the lender is.',
    note: 'Free to get, and takes a few days if you apply online.',
  },
  {
    id: 'doc-farm-records',
    emoji: '\u{1F4D3}',
    name: 'Farm records from last season',
    issuedBy: 'You, from your receipts and any cooperative records.',
    why: 'This is how a lender decides you can repay. It matters more than any other paper here.',
    note: 'Receipts for fertilizer, seed and any sold produce are enough to start.',
  },
  {
    id: 'doc-cooperative',
    emoji: '\u{1F465}',
    name: 'Cooperative membership card',
    issuedBy: 'Your local cooperative society.',
    why: 'Required for cooperative loans and it often unlocks a better rate.',
    note: 'Joinable at any time, and it also gets you advice and a buyer connection.',
  },
  {
    id: 'doc-photo-passport',
    emoji: '\u{1F4F8}',
    name: 'Two passport photos',
    issuedBy: 'Any photo studio, or taken at the office.',
    why: 'Attached to the file so the officer can identify you in person.',
    note: 'Cheapest item on this list. Leave it last so it does not delay the rest.',
  },
];

/** 📊 The path an application normally takes, in order. */
export const APPLICATION_STEPS: readonly ApplicationStep[] = [
  {
    stage: 'submitted',
    label: 'Application received',
    detail: 'Your form and reference number are logged. Nothing is decided at this point.',
  },
  {
    stage: 'documents',
    label: 'Documents checked',
    detail: 'The office confirms every paper is there and current. Missing papers stop here.',
  },
  {
    stage: 'assessment',
    label: 'Farm assessment',
    detail: 'An officer visits or reads your farm records and decides what you can repay.',
  },
  {
    stage: 'approved',
    label: 'Offer and disbursement',
    detail: 'You are told the amount, the rate and the dates, and you accept or decline.',
  },
];

/**
 * 📊 A demo application already part-way through, so the status section has
 * something to show before the farmer applies.
 */
export const DEMO_APPLICATION: ApplicationSnapshot = {
  reference: 'AGR-2026-004182',
  loanId: 'loan-seasonal-input',
  loanName: 'Seasonal crop loan',
  /** `null` when nothing has been submitted yet on this device. */
  stage: 'documents',
  submittedOn: '18 Sep 2026',
  /** The stage a farmer is waiting on, so the card can say it in one line. */
  waitingOn: 'Two documents still to bring: the KRA PIN certificate and two passport photos.',
};

/** 📞 Real counters, not a support chatbot. Demo numbers. */
export const DEMO_HELP_CONTACTS: readonly HelpContact[] = [
  {
    id: 'help-extension',
    emoji: '\u{1F4DE}',
    label: 'Farm extension office',
    value: '+254 700 118 240',
    kind: 'phone',
    note: 'Advice on your crop, and help with any form on this page.',
  },
  {
    id: 'help-agribank',
    emoji: '\u{1F3E7}',
    label: 'Agricultural Bank credit line',
    value: '+254 700 442 190',
    kind: 'phone',
    note: 'Loans and repayment questions. Open 8am to 5pm on weekdays.',
  },
  {
    id: 'help-cooperative',
    emoji: '\u{1F465}',
    label: 'Cooperative office',
    value: '+254 700 663 118',
    kind: 'sms',
    note: 'Send a message and someone replies, which is easier than a call.',
  },
  {
    id: 'help-email',
    emoji: '\u{2709}\uFE0F',
    label: 'Email the county office',
    value: 'agriculture@county.go.ke',
    kind: 'email',
    note: 'Best for sending scans of documents. Allow two working days.',
  },
];

/** 🏛️ The counter every farmer has to visit in person at least once. */
export const DEMO_HELP_DESK = {
  officeName: 'Ward Agricultural Office',
  location: 'Behind the market, next to the cooperative store',
  hours: 'Monday to Friday, 8am to 5pm. Closed on public holidays.',
  note: 'Take your national ID and your land papers every time. Going without them is the most common reason a visit is wasted.',
} as const;

/** 💰 Loan types a farmer can pick in the application form. */
export const LOAN_OPTIONS: SelectOption[] = DEMO_LOANS.map((loan) => ({
  label: loan.name,
  value: loan.id,
}));

/**
 * 📝 What the application form collects.
 *
 * Amount is a string for the same reason it is on the profile: it comes straight
 * from a text input, and the form should not have to guess what was typed before
 * validation runs.
 */
export type ApplicationFormValues = {
  fullName: string;
  phone: string;
  nationalId: string;
  loanId: string;
  amount: string;
  purpose: string;
};

/** An application that exists only on this device. */
export type ApplicationSnapshot = {
  reference: string;
  loanId: string;
  loanName: string;
  stage: ApplicationStage | null;
  submittedOn: string;
  waitingOn: string;
};

const EMPTY_FORM: ApplicationFormValues = {
  fullName: '',
  phone: '',
  nationalId: '',
  loanId: '',
  amount: '',
  purpose: '',
};

/** Smallest loan worth applying for, in the same units the options advertise. */
const MIN_AMOUNT = 5_000;

/**
 * Validates the application form.
 *
 * The rules are deliberately shallow: a real office decides whether an amount is
 * sensible for the crop, so the form only checks that it is a number the farmer
 * could plausibly have meant.
 */
export function validateApplicationForm(
  values: ApplicationFormValues
): FieldErrors<ApplicationFormValues> {
  const errors: FieldErrors<ApplicationFormValues> = {};

  const nameError = validateFullName(values.fullName);
  if (nameError) errors.fullName = nameError;

  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;

  const idError = validateNationalId(values.nationalId);
  if (idError) errors.nationalId = idError;

  if (values.loanId.length === 0) {
    errors.loanId = 'Choose the loan you are applying for.';
  }

  const amountError = validateAmount(values.amount);
  if (amountError) errors.amount = amountError;

  const purposeError = validatePurpose(values.purpose);
  if (purposeError) errors.purpose = purposeError;

  return errors;
}

/** An ID is 7 or 8 digits in Kenya, with no letters and no spaces. */
export function validateNationalId(value: string): string | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'National ID number is required.';
  }

  if (!/^\d{7,8}$/.test(trimmed)) {
    return 'Enter the 7 or 8 digits on your national ID, with no letters.';
  }

  return undefined;
}

export function validateAmount(value: string): string | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Enter the amount you are asking for.';
  }

  // Commas are the only non-digit a farmer is likely to type, so they are dropped
  // rather than rejected, which keeps "150,000" from failing on a comma.
  const digits = trimmed.replace(/,/g, '');

  if (!/^\d+$/.test(digits)) {
    return 'Enter the amount as a whole number, for example 150000.';
  }

  const amount = Number(digits);

  if (amount < MIN_AMOUNT) {
    return `Enter at least ${MIN_AMOUNT.toLocaleString()}, which is the smallest useful amount.`;
  }

  return undefined;
}

export function validatePurpose(value: string): string | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Say briefly what the money is for.';
  }

  if (trimmed.length < 10) {
    return 'A little more detail helps the officer decide. Ten characters or more.';
  }

  return undefined;
}

/**
 * 📝 Builds a local application from a form.
 *
 * Returns `null` when the form is not valid, so the screen can show the errors
 * instead of a reference number. A valid form returns the local application.
 *
 * The reference number is made from the year and a counter the screen passes in,
 * rather than randomly, so two applications in the same session cannot collide and
 * the farmer can read the date back out of the number. It is not a real
 * registration.
 */
export function submitApplication(
  values: ApplicationFormValues,
  sequence: number
): ApplicationSnapshot | null {
  if (hasErrors(validateApplicationForm(values))) {
    return null;
  }

  const loan = DEMO_LOANS.find((entry) => entry.id === values.loanId);
  const today = new Date();

  return {
    reference: `AGR-${today.getFullYear()}-${String(sequence).padStart(6, '0')}`,
    loanId: values.loanId,
    loanName: loan?.name ?? 'Loan application',
    // A fresh application starts at the first step. It never jumps ahead, and it
    // never moves on its own, because nothing is watching it.
    stage: 'submitted',
    submittedOn: formatShortDate(today),
    waitingOn: 'The office will contact you to confirm the papers you listed.',
  };
}

/** 📅 `18 Sep 2026`, the format used across the app's demo data. */
function formatShortDate(date: Date): string {
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

  const day = String(date.getDate()).padStart(2, '0');

  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/** A form that starts from the profile, so the farmer does not retype their name. */
export function formFromProfile(fullName: string): ApplicationFormValues {
  return { ...EMPTY_FORM, fullName: fullName === 'Farmer Name' ? '' : fullName };
}

/** 💰 One line summarising the page, so the header says something useful. */
export function loanSummary(loans: readonly LoanOption[], programs: readonly SupportProgram[]): string {
  return `${loans.length} loans and ${programs.length} support schemes`;
}

/** 📞 The URL a help row opens, chosen by how the farmer wants to make contact. */
export function contactUrl(contact: HelpContact): string {
  if (contact.kind === 'email') {
    return `mailto:${contact.value}`;
  }

  if (contact.kind === 'sms') {
    return `sms:${contact.value.replace(/[^+\d]/g, '')}`;
  }

  return `tel:${contact.value.replace(/[^+\d]/g, '')}`;
}

/** 📄 How many of the papers a farmer has ticked off, for the checklist header. */
export function documentProgress(
  documents: readonly RequiredDocument[],
  readyIds: readonly string[]
): { ready: number; total: number } {
  return { ready: documents.filter((doc) => readyIds.includes(doc.id)).length, total: documents.length };
}

/** 📄 The papers still missing, which is the list the farmer actually needs. */
export function missingDocuments(
  documents: readonly RequiredDocument[],
  readyIds: readonly string[]
): RequiredDocument[] {
  return documents.filter((doc) => !readyIds.includes(doc.id));
}

/** 📊 The timeline with every step up to the current one marked as done. */
export function applicationStepsWithProgress(
  steps: readonly ApplicationStep[],
  stage: ApplicationStage | null
): { step: ApplicationStep; done: boolean; current: boolean }[] {
  if (stage === null) {
    return steps.map((step) => ({ step, done: false, current: false }));
  }

  const currentIndex = steps.findIndex((step) => step.stage === stage);

  return steps.map((step, index) => ({
    step,
    done: index < currentIndex,
    current: index === currentIndex,
  }));
}

/** 📊 One line describing where an application has got to. */
export function applicationStatusLabel(snapshot: ApplicationSnapshot): string {
  if (snapshot.stage === null) {
    return 'Nothing submitted yet';
  }

  return `At the ${APPLICATION_STAGE_LABELS[snapshot.stage].toLowerCase()} step`;
}

