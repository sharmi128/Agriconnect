/**
 * Add Field form model and validation.
 *
 * The form only asks for what the farmer can know at the moment they mark a new
 * plot: the name, size, location, crop (or fallow), irrigation and soil. It does
 * not invent the sowing date, stage or harvest date for a crop the farmer may
 * not have planted yet — `buildField` leaves those off, and the field card says
 * so plainly until they are added.
 */

import { CROP_OPTIONS, type SelectOption } from '@/models/farmer-profile';
import type { FarmField } from '@/models/farm';
import { validateRequired, type FieldErrors } from '@/utils/validation';

/** The values the Add Field form collects. */
export type AddFieldFormValues = {
  name: string;
  /** Size in acres, for example "1.5". */
  areaAcres: string;
  location: string;
  /** A crop name, or `FALLOW_VALUE` when nothing is planted. */
  crop: string;
  irrigation: string;
  soil: string;
};

export const EMPTY_ADD_FIELD_FORM: AddFieldFormValues = {
  name: '',
  areaAcres: '',
  location: '',
  crop: '',
  irrigation: '',
  soil: '',
};

/** The value that "current crop" holds when the field stays unplanted. */
export const FALLOW_VALUE = 'Fallow';

/** 🌱 Current crop choices: every crop the profile knows, plus "no crop". */
export const ADD_CROP_OPTIONS: SelectOption[] = [
  ...CROP_OPTIONS,
  { label: 'None — field is fallow', value: FALLOW_VALUE },
];

/** 🌿 Soil types. Names match the Fertilizer Guide, so the vocabulary is shared. */
export const SOIL_OPTIONS: SelectOption[] = [
  { label: 'Clay soil', value: 'Clay soil' },
  { label: 'Sandy soil', value: 'Sandy soil' },
  { label: 'Loam soil', value: 'Loam soil' },
  { label: 'Red and laterite soil', value: 'Red and laterite soil' },
  { label: 'Peaty and black soil', value: 'Peaty and black soil' },
];

/** Matches plain numbers such as "2", "1.5" or "0.75". */
const AREA_PATTERN = /^\d+(\.\d+)?$/;

export function validateFieldArea(areaAcres: string): string | undefined {
  const trimmed = areaAcres.trim();

  if (trimmed.length === 0) {
    return 'Field area is required.';
  }
  if (!AREA_PATTERN.test(trimmed)) {
    return 'Enter the field area in acres, using numbers only, for example 1.5.';
  }
  if (Number(trimmed) <= 0) {
    return 'Field area must be greater than 0.';
  }
  return undefined;
}

/** Runs every Add Field rule and returns only the fields that failed. */
export function validateAddField(values: AddFieldFormValues): FieldErrors<AddFieldFormValues> {
  const errors: FieldErrors<AddFieldFormValues> = {};

  const nameError = validateRequired(values.name, 'Field name');
  if (nameError) errors.name = nameError;

  const areaError = validateFieldArea(values.areaAcres);
  if (areaError) errors.areaAcres = areaError;

  const locationError = validateRequired(values.location, 'Location');
  if (locationError) errors.location = locationError;

  const cropError = validateRequired(values.crop, 'Current crop');
  if (cropError) errors.crop = cropError;

  const irrigationError = validateRequired(values.irrigation, 'Irrigation type');
  if (irrigationError) errors.irrigation = irrigationError;

  const soilError = validateRequired(values.soil, 'Soil type');
  if (soilError) errors.soil = soilError;

  return errors;
}

/**
 * Turns the validated form into a field ready to be shown on My Farm.
 *
 * A field with no crop gets `crop: null`, which is the same "fallow" state the
 * demo fields use. A field that does have a crop records only its name: stage,
 * sowing and harvest dates are left for the farmer to add later rather than
 * invented here.
 */
export function buildField(values: AddFieldFormValues): FarmField {
  const hasCrop = values.crop !== FALLOW_VALUE;

  return {
    id: `field-${Date.now()}`,
    name: values.name.trim(),
    areaAcres: values.areaAcres.trim(),
    crop: hasCrop ? { name: values.crop } : null,
    location: values.location.trim(),
    irrigation: values.irrigation,
    soil: values.soil,
  };
}

/**
 * Fills the form from an existing field, so Edit Field starts from the current
 * values rather than blanks. A field with no location, irrigation or soil
 * recorded falls back to empty, which the form reads as "not set".
 */
export function formFromField(field: FarmField): AddFieldFormValues {
  return {
    name: field.name,
    areaAcres: field.areaAcres,
    location: field.location ?? '',
    crop: field.crop?.name ?? FALLOW_VALUE,
    irrigation: field.irrigation ?? '',
    soil: field.soil ?? '',
  };
}

/**
 * Applies validated form values to a field, keeping its id.
 *
 * Changing the crop forgets the old growth details (stage, sowing and harvest
 * dates), because those belonged to the previous crop. The record keeps the
 * original note, which Add Field does not edit.
 */
export function applyFieldValues(field: FarmField, values: AddFieldFormValues): FarmField {
  const hasCrop = values.crop !== FALLOW_VALUE;

  return {
    ...field,
    name: values.name.trim(),
    areaAcres: values.areaAcres.trim(),
    crop: hasCrop ? { name: values.crop } : null,
    location: values.location.trim(),
    irrigation: values.irrigation,
    soil: values.soil,
  };
}