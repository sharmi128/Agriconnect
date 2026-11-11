import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import {
  CROP_OPTIONS,
  IRRIGATION_OPTIONS,
  type FarmerProfile,
} from '@/models/farmer-profile';
import { validateFarmerProfile } from '@/utils/profile-validation';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Edit Profile screen.
 *
 * The form starts from a copy of the shared profile, so the user edits the
 * current values rather than blanks. Save validates, writes the copy back to
 * the shared profile, then returns to the Profile screen, which re-renders with
 * the new values. Cancel simply goes back and throws the copy away.
 */
export default function EditProfileScreen() {
  const { profile, updateProfile } = useFarmerProfile();

  // The lazy initialiser runs once per mount, so the form keeps what the user
  // types while they move between fields.
  const [values, setValues] = useState<FarmerProfile>(() => ({ ...profile }));
  const [errors, setErrors] = useState<FieldErrors<FarmerProfile>>({});

  /** Updates one field and clears its error as soon as the user types. */
  function handleChange(field: keyof FarmerProfile, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSave() {
    const nextErrors = validateFarmerProfile(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    // Trim the text fields so "  Nagercoil  " is not stored with the spaces.
    updateProfile({
      ...values,
      name: values.name.trim(),
      location: values.location.trim(),
    });

    router.back();
  }

  function handleCancel() {
    // No state is written, so the Profile screen still shows the old values.
    router.back();
  }

  return (
    <AuthScreen testID="edit-profile-screen">
      <AuthHeader
        title="Edit Profile"
        subtitle="Keep your farm details up to date."
        onBack={handleCancel}
      />

      <View style={styles.form}>
        <TextField
          label="Full Name"
          placeholder="e.g. Amina Kamau"
          value={values.name}
          onChangeText={(value) => handleChange('name', value)}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          testID="input-name"
        />

        <TextField
          label="Location"
          placeholder="e.g. Nagercoil"
          value={values.location}
          onChangeText={(value) => handleChange('location', value)}
          error={errors.location}
          autoCapitalize="words"
          returnKeyType="next"
          testID="input-location"
        />

        <TextField
          label="Land Area (Acres)"
          placeholder="e.g. 2"
          value={values.landArea}
          onChangeText={(value) => handleChange('landArea', value)}
          error={errors.landArea}
          keyboardType="decimal-pad"
          returnKeyType="next"
          testID="input-land-area"
        />

        <TextField
          label="Number of Fields"
          placeholder="e.g. 3"
          value={values.fieldCount}
          onChangeText={(value) => handleChange('fieldCount', value)}
          error={errors.fieldCount}
          keyboardType="number-pad"
          returnKeyType="next"
          testID="input-field-count"
        />

        <SelectField
          label="Main Crop"
          value={values.mainCrop}
          options={CROP_OPTIONS}
          onChange={(value) => handleChange('mainCrop', value)}
          placeholder="Select your main crop"
          error={errors.mainCrop}
          testID="select-main-crop"
        />

        <SelectField
          label="Irrigation Type"
          value={values.irrigationType}
          options={IRRIGATION_OPTIONS}
          onChange={(value) => handleChange('irrigationType', value)}
          placeholder="Select your irrigation type"
          error={errors.irrigationType}
          testID="select-irrigation-type"
        />

        <View style={styles.actions}>
          <Button label="Save Changes" onPress={handleSave} testID="save-profile" />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={handleCancel}
            testID="cancel-profile"
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
