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
  applyCropValues,
  CROP_HEALTH_OPTIONS,
  EMPTY_CROP_FORM,
  formFromCrop,
  validateCropForm,
  type CropFormValues,
} from '@/models/crop-form';
import { CROP_OPTIONS } from '@/models/farmer-profile';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Edit Crop screen, opened from ✏️ Edit Crop on the Crop Details page.
 *
 * The form starts from the crop's current values, so only what the farmer
 * actually changes is rewritten. Save validates, applies the changes to the
 * field's crop in the shared farm, then returns to Crop Details, which re-reads
 * the field and re-renders with the new values. Cancel simply goes back and
 * throws the typed values away.
 *
 * A farmer who is swapping one crop for another is better served by Add Crop,
 * which spells out that the previous planting is being replaced. This form is for
 * correcting the planting that is already there.
 *
 * The 💧 water status, 🌤️ weather and 📈 growth updates are not editable on
 * purpose: they describe current conditions from other models, and a form here
 * would pretend the app could change the weather.
 */
export default function EditCropScreen() {
  const { farm, updateField, isHydrated } = useFarm();
  const params = useLocalSearchParams<{ id?: string }>();

  const field = farm.fields.find((entry) => entry.id === params.id);
  const crop = field?.crop ?? null;

  // The lazy initialiser runs once per mount, so the form keeps what the user
  // types while they move between crops.
  const [values, setValues] = useState<CropFormValues>(() =>
    crop ? formFromCrop(crop) : EMPTY_CROP_FORM
  );
  const [errors, setErrors] = useState<FieldErrors<CropFormValues>>({});

  /** Updates one field and clears its error as soon as the user types. */
  function handleChange(key: keyof CropFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSave() {
    if (!field || !crop || !isHydrated) {
      router.back();
      return;
    }

    const nextErrors = validateCropForm(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    updateField(field.id, applyCropValues(field, values));

    router.back();
  }

  function handleCancel() {
    // No state is written, so Crop Details still shows the old values.
    router.back();
  }

  if (!field || !crop) {
    // The field or its crop is gone, so there is nothing to edit. Back takes the
    // user where they came from.
    return (
      <AuthScreen testID="edit-crop-missing-screen">
        <AuthHeader title="Edit Crop" onBack={handleCancel} />
        <Button
          label="Back to My Farm"
          onPress={() => router.replace('/farm')}
          testID="edit-crop-missing-back"
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen testID="edit-crop-screen">
      <AuthHeader
        title="Edit Crop"
        subtitle={`Update the facts about the ${crop.name} in ${field.name}.`}
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
          testID="edit-select-crop-name"
        />

        <SelectField
          label="\u{1F33F} Growth Stage"
          value={values.stage}
          options={CROP_STAGE_OPTIONS}
          onChange={(value) => handleChange('stage', value)}
          placeholder="How far along the season"
          error={errors.stage}
          testID="edit-select-crop-stage"
        />

        <SelectField
          label="\u{1F9E0} Crop Health"
          value={values.health}
          options={CROP_HEALTH_OPTIONS}
          onChange={(value) => handleChange('health', value)}
          placeholder="How the crop is doing"
          error={errors.health}
          testID="edit-select-crop-health"
        />

        <TextField
          label="\u{1F4C5} Planting Date"
          placeholder="e.g. 12 Jun 2026"
          value={values.sownOn}
          onChangeText={(value) => handleChange('sownOn', value)}
          autoCapitalize="words"
          returnKeyType="next"
          testID="edit-input-crop-planting"
        />

        <TextField
          label="\u{1F33E} Expected Harvest"
          placeholder="e.g. 20 Oct 2026"
          value={values.expectedHarvest}
          onChangeText={(value) => handleChange('expectedHarvest', value)}
          autoCapitalize="words"
          returnKeyType="done"
          testID="edit-input-crop-harvest"
        />

        <View style={styles.actions}>
          <Button
            label="\u{1F4BE} Save Crop"
            onPress={handleSave}
            disabled={!isHydrated}
            testID="save-crop"
          />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={handleCancel}
            testID="cancel-crop"
          />
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
