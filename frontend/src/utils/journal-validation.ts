/**
 * Validation for the two forms on the Crop Journal screen: Add Growth Update and
 * Record Harvest.
 *
 * The shared helpers come from `validation.ts`, the same ones the auth screens
 * and Edit Profile use, so error messages read the same way across the app.
 *
 * These rules run on the device only. The Spring Boot backend must check the same
 * things on the server once it is connected.
 */

import { isHarvestUnit } from '@/models/crop-journal';
import { validateRequired, type FieldErrors } from '@/utils/validation';

/** Matches plain numbers such as "60", "2.5" or "0.75". */
const DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

/** Longest note we accept, so one entry cannot take over the whole timeline. */
export const MAX_NOTE_LENGTH = 240;

export type GrowthUpdateFormValues = {
  cropId: string;
  stage: string;
  note: string;
};

export type HarvestFormValues = {
  cropId: string;
  /** The quantity as typed, in whatever unit is selected. */
  quantity: string;
  unit: string;
  /** 💰 Harvest value in rupees, as typed. */
  value: string;
};

/** Which crop the update belongs to. */
export function validateUpdateCrop(cropId: string): string | undefined {
  return validateRequired(cropId, 'Crop');
}

/** The stage the crop has reached. */
export function validateStage(stage: string): string | undefined {
  return validateRequired(stage, 'Growth stage');
}

/**
 * The note is the substance of the update, so it is required rather than
 * optional. It is also length-capped, because a timeline entry is a note, not a
 * diary.
 */
export function validateNote(note: string): string | undefined {
  const trimmed = note.trim();

  if (trimmed.length === 0) {
    return 'Write a short note about what you saw.';
  }
  if (trimmed.length > MAX_NOTE_LENGTH) {
    return `Keep the note under ${MAX_NOTE_LENGTH} characters.`;
  }
  return undefined;
}

/** ⚖️ Harvest quantity: a real number greater than zero. */
export function validateQuantity(quantity: string): string | undefined {
  const trimmed = quantity.trim();

  if (trimmed.length === 0) {
    return 'Harvest quantity is required.';
  }
  if (!DECIMAL_PATTERN.test(trimmed)) {
    return 'Enter the quantity as a number, for example 60 or 2.5.';
  }
  if (Number(trimmed) <= 0) {
    return 'Harvest quantity must be greater than 0.';
  }
  return undefined;
}

/** The unit the quantity was recorded in. */
export function validateUnit(unit: string): string | undefined {
  return isHarvestUnit(unit) ? undefined : 'Select the unit for this harvest.';
}

/**
 * 💰 Harvest value.
 *
 * Zero is allowed on purpose: a farmer may have picked the crop but not sold it
 * yet, and forcing a number would lead to made-up values. The field still has to
 * be filled in, so the choice is deliberate.
 */
export function validateHarvestValue(value: string): string | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Harvest value is required. Enter 0 if it is not sold yet.';
  }
  if (!DECIMAL_PATTERN.test(trimmed)) {
    return 'Enter the value in rupees, using numbers only, for example 1800.';
  }
  return undefined;
}

/** Runs every growth update rule and returns only the fields that failed. */
export function validateGrowthUpdate(
  values: GrowthUpdateFormValues
): FieldErrors<GrowthUpdateFormValues> {
  const errors: FieldErrors<GrowthUpdateFormValues> = {};

  const cropError = validateUpdateCrop(values.cropId);
  if (cropError) errors.cropId = cropError;

  const stageError = validateStage(values.stage);
  if (stageError) errors.stage = stageError;

  const noteError = validateNote(values.note);
  if (noteError) errors.note = noteError;

  return errors;
}

/** Runs every harvest rule and returns only the fields that failed. */
export function validateHarvestForm(values: HarvestFormValues): FieldErrors<HarvestFormValues> {
  const errors: FieldErrors<HarvestFormValues> = {};

  const cropError = validateUpdateCrop(values.cropId);
  if (cropError) errors.cropId = cropError;

  const quantityError = validateQuantity(values.quantity);
  if (quantityError) errors.quantity = quantityError;

  const unitError = validateUnit(values.unit);
  if (unitError) errors.unit = unitError;

  const valueError = validateHarvestValue(values.value);
  if (valueError) errors.value = valueError;

  return errors;
}
