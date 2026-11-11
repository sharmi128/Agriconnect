/**
 * Validation for the Edit Profile form and the first-run Farmer Profile Setup.
 *
 * The shared helpers come from `validation.ts`, the same ones the auth screens
 * use, so error messages read the same way throughout the app.
 *
 * `validateFarmerProfile` covers the six details Edit Profile can change, and
 * `validateProfileSetup` adds the 💰 income and 🏦 loan status questions that only
 * the setup form asks for.
 *
 * These rules run on the device only. The Spring Boot backend must check the
 * same things on the server once it is connected.
 */

import type { FarmerProfile } from '@/models/farmer-profile';
import { validateRequired, type FieldErrors } from '@/utils/validation';

/** Matches plain numbers such as "2", "2.5" or "0.75". */
const DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

/** Matches plain numbers with no decimal part, such as "3". */
const WHOLE_NUMBER_PATTERN = /^\d+$/;

/**
 * Land area in acres. Decimals are allowed, because a plot can be 2.5 acres,
 * but zero and negative values are not real land.
 */
export function validateLandArea(landArea: string): string | undefined {
  const trimmed = landArea.trim();

  if (trimmed.length === 0) {
    return 'Land area is required.';
  }
  if (!DECIMAL_PATTERN.test(trimmed)) {
    return 'Enter land area in acres, using numbers only, for example 2.5.';
  }
  if (Number(trimmed) <= 0) {
    return 'Land area must be greater than 0.';
  }
  return undefined;
}

/**
 * Number of fields. This has to be a whole number, because half a field is not
 * something a farmer can own.
 */
export function validateFieldCount(fieldCount: string): string | undefined {
  const trimmed = fieldCount.trim();

  if (trimmed.length === 0) {
    return 'Number of fields is required.';
  }
  if (!WHOLE_NUMBER_PATTERN.test(trimmed)) {
    return 'Enter the number of fields as a whole number, for example 3.';
  }
  if (Number(trimmed) <= 0) {
    return 'Number of fields must be at least 1.';
  }
  return undefined;
}

export function validateMainCrop(mainCrop: string): string | undefined {
  return validateRequired(mainCrop, 'Main crop');
}

export function validateIrrigationType(irrigationType: string): string | undefined {
  return validateRequired(irrigationType, 'Irrigation type');
}

/** Runs every profile rule and returns only the fields that failed. */
export function validateFarmerProfile(
  values: FarmerProfile
): FieldErrors<FarmerProfile> {
  const errors: FieldErrors<FarmerProfile> = {};

  const nameError = validateRequired(values.name, 'Name');
  if (nameError) errors.name = nameError;

  const locationError = validateRequired(values.location, 'Location');
  if (locationError) errors.location = locationError;

  const landAreaError = validateLandArea(values.landArea);
  if (landAreaError) errors.landArea = landAreaError;

  const fieldCountError = validateFieldCount(values.fieldCount);
  if (fieldCountError) errors.fieldCount = fieldCountError;

  const mainCropError = validateMainCrop(values.mainCrop);
  if (mainCropError) errors.mainCrop = mainCropError;

  const irrigationError = validateIrrigationType(values.irrigationType);
  if (irrigationError) errors.irrigationType = irrigationError;

  return errors;
}

export function validateIncome(income: string): string | undefined {
  return validateRequired(income, 'Approximate income');
}

export function validateLoanStatus(loanStatus: string): string | undefined {
  return validateRequired(loanStatus, 'Loan status');
}

/**
 * The stricter rules used by the first-run Farmer Profile Setup.
 *
 * This is what stands between a new farmer and the rest of the app, so it asks
 * for the two extra questions Edit Profile does not show: 💰 income and 🏦 loan
 * status. Everything else is the shared profile rule, so the messages a farmer
 * sees on setup are the same ones they see later when editing their details.
 */
export function validateProfileSetup(
  values: FarmerProfile
): FieldErrors<FarmerProfile> {
  const errors: FieldErrors<FarmerProfile> = { ...validateFarmerProfile(values) };

  const incomeError = validateIncome(values.income);
  if (incomeError) errors.income = incomeError;

  const loanStatusError = validateLoanStatus(values.loanStatus);
  if (loanStatusError) errors.loanStatus = loanStatusError;

  return errors;
}
