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
import {
  ADD_CROP_OPTIONS,
  applyFieldValues,
  EMPTY_ADD_FIELD_FORM,
  formFromField,
  SOIL_OPTIONS,
  validateAddField,
  type AddFieldFormValues,
} from '@/models/add-field';
import { IRRIGATION_OPTIONS } from '@/models/farmer-profile';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Edit Field screen, opened from ✏️ Edit Field on the Field Details page.
 *
 * The form starts from the field's current values, so only what the farmer
 * actually changes is rewritten. Save validates, applies the changes to the
 * field in the shared farm, then returns to Field Details, which re-reads the
 * field and re-renders with the new values. Cancel simply goes back and throws
 * the typed values away.
 *
 * The 📈 growth stage and 📅 expected harvest are not in this form on purpose:
 * they describe the crop's progress rather than the plot, and the app has no
 * place to record them yet.
 */
export default function EditFieldScreen() {
  const { farm, updateField } = useFarm();
  const params = useLocalSearchParams<{ id?: string }>();

  const field = farm.fields.find((entry) => entry.id === params.id);

  // The lazy initialiser runs once per mount, so the form keeps what the user
  // types while they move between fields.
  const [values, setValues] = useState<AddFieldFormValues>(() =>
    field ? formFromField(field) : EMPTY_ADD_FIELD_FORM
  );
  const [errors, setErrors] = useState<FieldErrors<AddFieldFormValues>>({});

  /** Updates one field and clears its error as soon as the user types. */
  function handleChange(key: keyof AddFieldFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSave() {
    if (!field) {
      router.back();
      return;
    }

    const nextErrors = validateAddField(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    updateField(field.id, applyFieldValues(field, values));

    router.back();
  }

  function handleCancel() {
    // No state is written, so Field Details still shows the old values.
    router.back();
  }

  if (!field) {
    // The field is gone (for example after an app restart), so there is nothing
    // to edit. The user came here from the details page, and Back takes them home.
    return (
      <AuthScreen testID="edit-field-missing-screen">
        <AuthHeader title="Edit Field" onBack={handleCancel} />
        <Button
          label="Back to My Farm"
          onPress={() => router.replace('/farm')}
          testID="edit-field-missing-back"
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen testID="edit-field-screen">
      <AuthHeader
        title="Edit Field"
        subtitle="Update what you know about this plot."
        onBack={handleCancel}
      />

      <View style={styles.form}>
        <TextField
          label="🏞️ Field Name"
          placeholder="e.g. Riverside Plot"
          value={values.name}
          onChangeText={(value) => handleChange('name', value)}
          error={errors.name}
          autoCapitalize="words"
          returnKeyType="next"
          testID="edit-input-field-name"
        />

        <TextField
          label="📐 Field Area (Acres)"
          placeholder="e.g. 1.5"
          value={values.areaAcres}
          onChangeText={(value) => handleChange('areaAcres', value)}
          error={errors.areaAcres}
          keyboardType="decimal-pad"
          returnKeyType="next"
          testID="edit-input-field-area"
        />

        <TextField
          label="📍 Location"
          placeholder="e.g. Nagercoil"
          value={values.location}
          onChangeText={(value) => handleChange('location', value)}
          error={errors.location}
          autoCapitalize="words"
          returnKeyType="next"
          testID="edit-input-field-location"
        />

        <SelectField
          label="🌱 Current Crop"
          value={values.crop}
          options={ADD_CROP_OPTIONS}
          onChange={(value) => handleChange('crop', value)}
          placeholder="Choose a crop, or no crop"
          error={errors.crop}
          testID="edit-select-field-crop"
        />

        <SelectField
          label="💧 Irrigation Type"
          value={values.irrigation}
          options={IRRIGATION_OPTIONS}
          onChange={(value) => handleChange('irrigation', value)}
          placeholder="How this field is watered"
          error={errors.irrigation}
          testID="edit-select-field-irrigation"
        />

        <SelectField
          label="🌿 Soil Type"
          value={values.soil}
          options={SOIL_OPTIONS}
          onChange={(value) => handleChange('soil', value)}
          placeholder="What the field grows in"
          error={errors.soil}
          testID="edit-select-field-soil"
        />

        <View style={styles.actions}>
          <Button label="💾 Save Field" onPress={handleSave} testID="save-field" />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={handleCancel}
            testID="cancel-field"
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