/**
 * Add Crop and Edit Crop form model and validation.
 *
 * Both forms collect the same facts about a planting — which crop it is, how far
 * along the season is, how it is doing, and when it was sown and is due — so
 * they share one set of values, one set of rules and one set of dropdown
 * options. The only difference is where the values come from: Add Crop starts
 * blank, Edit Crop starts from what the field already has.
 *
 * Both write to the field's `crop` record in `models/farm.ts`, the same place My
 * Farm, Field Details and Crop Details read from, so a saved change shows up on
 * every screen at once.
 *
 * The 💧 water status, 🌤️ weather and 📈 growth updates sections are read-only on
 * purpose: they describe conditions from other models, and a form here would
 * pretend the app could change the weather.
 */

import { isCropStage } from '@/models/crop-journal';
import type { SelectOption } from '@/models/farmer-profile';
import type { CropHealth, FarmField, FieldCrop } from '@/models/farm';
import { validateRequired, type FieldErrors } from '@/utils/validation';

/** The values the Add Crop and Edit Crop forms collect. */
export type CropFormValues = {
  /** A crop name from `CROP_OPTIONS`. */
  name: string;
  /** A growth stage from `CROP_STAGE_OPTIONS`. */
  stage: string;
  /** Free-text sowing date, for example "12 Jun 2026". */
  sownOn: string;
  /** Free-text expected harvest date, for example "20 Oct 2026". */
  expectedHarvest: string;
  /** A value from `CROP_HEALTH_OPTIONS`. */
  health: string;
};

/** The blank form Add Crop starts from. */
export const EMPTY_CROP_FORM: CropFormValues = {
  name: '',
  stage: '',
  sownOn: '',
  expectedHarvest: '',
  health: '',
};

/** 🤒 Health choices, the same words the field and journal cards use. */
export const CROP_HEALTH_OPTIONS: SelectOption[] = (
  ['Good', 'Watch', 'Action needed'] as const
).map((health) => ({ value: health, label: health }));

/** Narrows form text down to the health values the farm model accepts. */
export function isCropHealth(value: string): value is CropHealth {
  return value === 'Good' || value === 'Watch' || value === 'Action needed';
}

/**
 * Runs every crop rule and returns only the fields that failed.
 *
 * The dates are left alone on purpose: the crop facts the app can reason about
 * are the name, stage and health, and the dates stay free text in the same
 * "12 Jun 2026" style the rest of the app uses.
 */
export function validateCropForm(values: CropFormValues): FieldErrors<CropFormValues> {
  const errors: FieldErrors<CropFormValues> = {};

  const nameError = validateRequired(values.name, 'Crop name');
  if (nameError) errors.name = nameError;

  const stageError = validateRequired(values.stage, 'Growth stage');
  if (stageError) errors.stage = stageError;

  const healthError = validateRequired(values.health, 'Crop health');
  if (healthError) errors.health = healthError;

  return errors;
}

/**
 * Fills the form from a field's current crop, so Edit Crop starts from what is
 * there rather than blanks. A crop that only records its name leaves the
 * optional facts empty, which the form reads as "not set".
 */
export function formFromCrop(crop: NonNullable<FarmField['crop']>): CropFormValues {
  return {
    name: crop.name,
    stage: crop.stage ?? '',
    sownOn: crop.sownOn ?? '',
    expectedHarvest: crop.expectedHarvest ?? '',
    health: crop.health ?? '',
  };
}

/**
 * Turns validated form values into a crop record.
 *
 * Blank dates become missing values rather than empty strings, so a crop with no
 * harvest date yet keeps the honest "Not added yet" instead of a blank row.
 */
export function buildCrop(values: CropFormValues): FieldCrop {
  return {
    name: values.name.trim(),
    stage: isCropStage(values.stage) ? values.stage : undefined,
    sownOn: values.sownOn.trim() || undefined,
    expectedHarvest: values.expectedHarvest.trim() || undefined,
    health: isCropHealth(values.health) ? values.health : undefined,
  };
}

/**
 * Applies validated values to the field's crop, keeping the field's id and its
 * other facts.
 */
export function applyCropValues(field: FarmField, values: CropFormValues): FarmField {
  return {
    ...field,
    crop: buildCrop(values),
  };
}
