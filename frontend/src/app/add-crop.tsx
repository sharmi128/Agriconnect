import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useFarm } from '@/context/farm-context';
import { CROP_STAGE_OPTIONS } from '@/models/crop-journal';
import {
  buildCrop,
  CROP_HEALTH_OPTIONS,
  EMPTY_CROP_FORM,
  validateCropForm,
  type CropFormValues,
} from '@/models/crop-form';
import { CROP_OPTIONS } from '@/models/farmer-profile';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Add Crop screen, opened from 🌱 Plant a Crop on a fallow field, and from ✏️
 * Edit Crop on Crop Details when the farmer is switching to a different crop.
 *
 * The form asks for what the farmer can know at the moment they plant: which
 * crop, how far along it already is, how it is doing and the two dates. Save
 * validates, writes the crop to the field in the shared farm, then returns to
 * where the farmer came from, which re-reads the field and re-renders with the
 * crop on it. Cancel simply goes back and throws the typed values away.
 *
 * A field grows one crop at a time, so planting into a field that already has one
 * replaces it. That is the same thing the 🌱 Current Crop dropdown on Add Field
 * and Edit Field does, kept in step on purpose.
 *
 * Saving is held back while the saved fields are still being read, so a crop
 * recorded in that first moment cannot be overwritten by the load.
 */
export default function AddCropScreen() {
  const { farm, setCrop, isHydrated } = useFarm();
  const params = useLocalSearchParams<{ id?: string }>();

  const field = farm.fields.find((entry) => entry.id === params.id);

  // The lazy initialiser runs once per mount, so the form keeps what the user
  // types while they look up a sowing date.
  const [values, setValues] = useState<CropFormValues>(EMPTY_CROP_FORM);
  const [errors, setErrors] = useState<FieldErrors<CropFormValues>>({});

  /** Updates one field and clears its error as soon as the user types. */
  function handleChange(key: keyof CropFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSave() {
    if (!field || !isHydrated) {
      router.back();
      return;
    }

    const nextErrors = validateCropForm(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setCrop(field.id, buildCrop(values));

    router.back();
  }

  function handleCancel() {
    // No state is written, so the field still shows what it showed before.
    router.back();
  }

  if (!field) {
    // The field is gone (for example after an app restart), so there is nothing
    // to plant in. The farmer came here from the field, and Back takes them home.
    return (
      <AuthScreen testID="add-crop-missing-screen">
        <AuthHeader title="Add Crop" onBack={handleCancel} />
        <Button
          label="Back to My Farm"
          onPress={() => router.replace('/farm')}
          testID="add-crop-missing-back"
        />
      </AuthScreen>
    );
  }

  const existingCrop = field.crop;

  return (
    <AuthScreen testID="add-crop-screen">
      <AuthHeader
        title="Add Crop"
        subtitle={
          existingCrop
            ? `This replaces the ${existingCrop.name} in ${field.name}.`
            : `Record what you planted in ${field.name}.`
        }
        onBack={handleCancel}
      />

      <View style={styles.form}>
        <SelectField
          label="\u{1F331} Crop Name"
          value={values.name}
          options={CROP_OPTIONS}
          onChange={(value) => handleChange('name', value)}
          placeholder="Which crop is planted"
          error={errors.name}
          testID="add-select-crop-name"
        />

        <SelectField
          label="\u{1F33F} Growth Stage"
          value={values.stage}
          options={CROP_STAGE_OPTIONS}
          onChange={(value) => handleChange('stage', value)}
          placeholder="How far along the season"
          error={errors.stage}
          testID="add-select-crop-stage"
        />

        <SelectField
          label="\u{1F9E0} Crop Health"
          value={values.health}
          options={CROP_HEALTH_OPTIONS}
          onChange={(value) => handleChange('health', value)}
          placeholder="How the crop is doing"
          error={errors.health}
          testID="add-select-crop-health"
        />

        <TextField
          label="\u{1F4C5} Planting Date"
          placeholder="e.g. 12 Jun 2026"
          value={values.sownOn}
          onChangeText={(value) => handleChange('sownOn', value)}
          autoCapitalize="words"
          returnKeyType="next"
          testID="add-input-crop-planting"
        />

        <TextField
          label="\u{1F33E} Expected Harvest"
          placeholder="e.g. 20 Oct 2026"
          value={values.expectedHarvest}
          onChangeText={(value) => handleChange('expectedHarvest', value)}
          autoCapitalize="words"
          returnKeyType="done"
          testID="add-input-crop-harvest"
        />

        <View style={styles.actions}>
          <Button
            label="\u{1F4BE} Save Crop"
            onPress={handleSave}
            disabled={!isHydrated}
            testID="save-crop"
          />
          <Button label="Cancel" variant="secondary" onPress={handleCancel} testID="cancel-crop" />
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
