import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useFarm } from '@/context/farm-context';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import {
  ADD_CROP_OPTIONS,
  buildField,
  EMPTY_ADD_FIELD_FORM,
  SOIL_OPTIONS,
  validateAddField,
} from '@/models/add-field';
import { IRRIGATION_OPTIONS } from '@/models/farmer-profile';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Add Field screen, opened from the ✚ Add Field button on My Farm.
 *
 * The form starts from a copy of the shared farm profile where it is helpful:
 * the location and irrigation type are already filled, because a new plot is
 * usually in the same place and watered the same way. Save validates, writes the
 * new field to the shared farm, then returns to My Farm, which lists the field
 * at the top and recomputes the total land area. Cancel simply goes back and
 * throws the typed values away.
 */
export default function AddFieldScreen() {
  const { profile } = useFarmerProfile();
  const { addField } = useFarm();

  // The lazy initialiser runs once per mount, so the form keeps what the user
  // types while they move between fields.
  const [values, setValues] = useState(() => ({
    ...EMPTY_ADD_FIELD_FORM,
    location: profile.location,
    irrigation: profile.irrigationType,
  }));
  const [errors, setErrors] = useState<FieldErrors<typeof values>>({});

  /** Updates one field and clears its error as soon as the user types. */
  function handleChange(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSave() {
    const nextErrors = validateAddField(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    addField(buildField(values));

    router.back();
  }

  function handleCancel() {
    // No state is written, so My Farm still shows the old field list.
    router.back();
  }

  return (
    <AuthScreen testID="add-field-screen">
      <AuthHeader
        title="Add Field"
        subtitle="Count a new plot on your farm."
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
          testID="input-field-name"
        />

        <TextField
          label="📐 Field Area (Acres)"
          placeholder="e.g. 1.5"
          value={values.areaAcres}
          onChangeText={(value) => handleChange('areaAcres', value)}
          error={errors.areaAcres}
          keyboardType="decimal-pad"
          returnKeyType="next"
          testID="input-field-area"
        />

        <TextField
          label="📍 Location"
          placeholder="e.g. Nagercoil"
          value={values.location}
          onChangeText={(value) => handleChange('location', value)}
          error={errors.location}
          autoCapitalize="words"
          returnKeyType="next"
          testID="input-field-location"
        />

        <SelectField
          label="🌱 Current Crop"
          value={values.crop}
          options={ADD_CROP_OPTIONS}
          onChange={(value) => handleChange('crop', value)}
          placeholder="Choose a crop, or no crop"
          error={errors.crop}
          testID="select-field-crop"
        />

        <SelectField
          label="💧 Irrigation Type"
          value={values.irrigation}
          options={IRRIGATION_OPTIONS}
          onChange={(value) => handleChange('irrigation', value)}
          placeholder="How this field is watered"
          error={errors.irrigation}
          testID="select-field-irrigation"
        />

        <SelectField
          label="🌿 Soil Type"
          value={values.soil}
          options={SOIL_OPTIONS}
          onChange={(value) => handleChange('soil', value)}
          placeholder="What the field grows in"
          error={errors.soil}
          testID="select-field-soil"
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