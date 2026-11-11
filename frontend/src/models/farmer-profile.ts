/**
 * The farmer profile data model.
 *
 * Numbers are stored as strings on purpose. They come straight out of text
 * inputs, and keeping them as text means the form never has to guess what the
 * user typed before validation runs. They are only converted for display.
 *
 * The land size is always saved in acres. The 📐 unit picked in the Profile
 * settings only changes how it is written on screen, which is why the unit is
 * passed in at display time rather than stored on the profile.
 *
 * This is frontend-only for now. When the Spring Boot backend is ready, the same
 * shape can be filled from the server instead of the placeholder values below.
 */

import type { LandAreaUnit } from '@/models/app-settings';

export type FarmerProfile = {
  name: string;
  location: string;
  /** Land size in acres, for example "2" or "2.5". */
  landArea: string;
  /** How many separate plots the farm is divided into. */
  fieldCount: string;
  mainCrop: string;
  irrigationType: string;
  /**
   * Rough yearly farm income, stored as one of `INCOME_OPTIONS`. Asked for by the
   * first-run Farmer Profile Setup so support can suggest schemes and loans that
   * fit the farm's size.
   */
  income: string;
  /** Whether the farm already has a loan, stored as one of `LOAN_STATUS_OPTIONS`. */
  loanStatus: string;
};

/** One choice in a dropdown. */
export type SelectOption = {
  label: string;
  value: string;
};

/**
 * Placeholder profile so the screens have something sensible to show before a
 * backend or a real account exists. Replace this with server data later.
 */
export const DEFAULT_FARMER_PROFILE: FarmerProfile = {
  // The name starts blank on purpose: screens fall back to "Your name" or
  // "Farmer", and the Edit Profile field shows its own placeholder instead of a
  // fake saved name ("Farmer Name") that looks like real data.
  name: '',
  location: 'Nagercoil',
  landArea: '2',
  fieldCount: '3',
  mainCrop: 'Paddy',
  irrigationType: 'Well',
  // The last two are only filled in by the first-run Farmer Profile Setup, so
  // they start blank too. Only that form requires them; Edit Profile leaves them
  // alone, so a farmer who has never set them up can still change other details.
  income: '',
  loanStatus: '',
};

/**
 * The blank form the first-run Farmer Profile Setup starts from.
 *
 * Unlike `DEFAULT_FARMER_PROFILE` nothing is filled in: on the setup screen a
 * pre-filled value would look like it was already answered, and the farmer
 * would just tap Save & Continue without reading it.
 */
export const EMPTY_FARMER_PROFILE: FarmerProfile = {
  name: '',
  location: '',
  landArea: '',
  fieldCount: '',
  mainCrop: '',
  irrigationType: '',
  income: '',
  loanStatus: '',
};

/** Crops a farmer can pick as their main crop. */
export const CROP_OPTIONS: SelectOption[] = [
  { label: 'Paddy', value: 'Paddy' },
  { label: 'Wheat', value: 'Wheat' },
  { label: 'Maize', value: 'Maize' },
  { label: 'Sugarcane', value: 'Sugarcane' },
  { label: 'Cotton', value: 'Cotton' },
  { label: 'Groundnut', value: 'Groundnut' },
  { label: 'Soybean', value: 'Soybean' },
  { label: 'Millets', value: 'Millets' },
  { label: 'Banana', value: 'Banana' },
  { label: 'Vegetables', value: 'Vegetables' },
];

/** Ways a farm can be watered. */
export const IRRIGATION_OPTIONS: SelectOption[] = [
  { label: 'Well', value: 'Well' },
  { label: 'Borewell', value: 'Borewell' },
  { label: 'Canal', value: 'Canal' },
  { label: 'River', value: 'River' },
  { label: 'Pond', value: 'Pond' },
  { label: 'Rain-fed', value: 'Rain-fed' },
  { label: 'Drip Irrigation', value: 'Drip Irrigation' },
  { label: 'Sprinkler Irrigation', value: 'Sprinkler Irrigation' },
];

/**
 * Rough yearly income bands.
 *
 * Bands instead of a rupee figure, because an exact number is hard to remember
 * and hard to type on a phone, while a band is enough to point a farmer at the
 * right schemes and support.
 */
export const INCOME_OPTIONS: SelectOption[] = [
  { label: 'Below 100,000', value: 'Below 100,000' },
  { label: '100,000 - 300,000', value: '100,000 - 300,000' },
  { label: '300,000 - 500,000', value: '300,000 - 500,000' },
  { label: '500,000 - 1,000,000', value: '500,000 - 1,000,000' },
  { label: 'Above 1,000,000', value: 'Above 1,000,000' },
];

/** Whether the farm already carries a loan. */
export const LOAN_STATUS_OPTIONS: SelectOption[] = [
  { label: 'No loan yet', value: 'No loan yet' },
  { label: 'Loan taken, repaying', value: 'Loan taken, repaying' },
  { label: 'Loan repaid', value: 'Loan repaid' },
  { label: 'Applying for a loan', value: 'Applying for a loan' },
];

/** Finds the label for a stored value, falling back to the value itself. */
export function getOptionLabel(options: SelectOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

/** One acre in hectares, used when the farmer prefers hectares on screen. */
const ACRES_IN_HECTARES = 0.404686;

/**
 * Formats the land area for display, for example "2.5 Acres" or "1.01 Hectares".
 *
 * The profile always stores acres, because that is what the Edit Profile form
 * asks for. The unit is only applied here, so switching the 📐 unit setting
 * changes how the size is written without touching the saved value.
 */
export function formatLandArea(landArea: string, unit: LandAreaUnit = 'acres'): string {
  const acres = Number(landArea);

  if (unit === 'hectares' && Number.isFinite(acres)) {
    const hectares = Math.round(acres * ACRES_IN_HECTARES * 100) / 100;

    return `${hectares} ${hectares === 1 ? 'Hectare' : 'Hectares'}`;
  }

  return `${landArea} ${landArea.trim() === '1' ? 'Acre' : 'Acres'}`;
}
