import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import { useOnboarding } from '@/context/onboarding-context';
import {
  CROP_OPTIONS,
  EMPTY_FARMER_PROFILE,
  INCOME_OPTIONS,
  IRRIGATION_OPTIONS,
  LOAN_STATUS_OPTIONS,
  type FarmerProfile,
} from '@/models/farmer-profile';
import { validateProfileSetup } from '@/utils/profile-validation';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Farmer Profile Setup, the second screen of the first-run flow.
 *
 * It asks the eight questions the app needs before it can help anybody: who the
 * farmer is, where the farm is, how big it is, what grows on it, how it is
 * watered, and what the farm's financial situation is. Every one of them is
 * required, and nothing else in the app opens until the form is saved.
 *
 * On save, in order:
 *   1. `validateProfileSetup` checks all eight fields and shows the problems
 *      inline, so the farmer is never told only that "something went wrong".
 *   2. The trimmed answers go to the shared profile, so the Profile tab and
 *      Edit Profile read the same values.
 *   3. `completeProfileSetup` writes them to local storage and sets the saved
 *      `profileCompleted` flag, which is what lets the Home dashboard open and
 *      what stops the app showing the Welcome screen on the next launch.
 *   4. The redirect at the top of this screen then takes over and sends the
 *      farmer to `/home`, the Home dashboard. It is left to run on the
 *      re-render rather than being called here, because the guard around
 *      `(tabs)` only opens on that same re-render, and navigating to a screen
 *      that is not in the navigator yet would be dropped.
 *
 * This is frontend-only. Nothing is sent to the Spring Boot backend yet; the
 * answers are saved on the device, so reopening the app goes straight to Home.
 */
export default function ProfileSetupScreen() {
  const { status, isProfileComplete, completeProfileSetup } = useOnboarding();
  const { updateProfile } = useFarmerProfile();

  // The lazy initialiser runs once per mount, so the form keeps what the farmer
  // types while they move between fields, and starts completely blank.
  const [values, setValues] = useState<FarmerProfile>(() => ({ ...EMPTY_FARMER_PROFILE }));
  const [errors, setErrors] = useState<FieldErrors<FarmerProfile>>({});

  // Still reading the saved flag, so hold the screen back rather than flashing
  // the form at a farmer who has already finished setup.
  if (status === 'loading') {
    return null;
  }

  // A farmer who already has a profile has no reason to see this form again,
  // however they arrived here. This redirect is also what sends the farmer to
  // the Home dashboard the moment `completeProfileSetup` marks setup as done and
  // writes `profileCompleted = true` to local storage.
  if (isProfileComplete) {
    return <Redirect href="/home" />;
  }

  /** Updates one field and clears its error as soon as the user types. */
  function handleChange(field: keyof FarmerProfile, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSave() {
    const nextErrors = validateProfileSetup(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    // Trim the typed fields so "  Nagercoil  " is not stored with the spaces.
    const profile: FarmerProfile = {
      ...values,
      name: values.name.trim(),
      location: values.location.trim(),
    };

    updateProfile(profile);
    completeProfileSetup(profile);
  }

  return (
    <AuthScreen testID="profile-setup-screen">
      <AuthHeader
        title="👨‍🌾 Farmer Profile Setup"
        subtitle="Tell us about your farm so AgriConnect can guide you. Every field is needed before you enter the app."
        onBack={() => router.back()}
      />

      <View style={styles.form}>
        <FormAlert
          tone="info"
          message="Your answers are saved on this device only. Once you tap Save & Continue, the Home dashboard, My Farm, Farming Guide and Marketplace all open."
          testID="profile-setup-alert"
        />

        <TextField
          label="👤 Full Name"
          placeholder="e.g. Amina Kamau"
          value={values.name}
          onChangeText={(value) => handleChange('name', value)}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          testID="input-name"
        />

        <TextField
          label="📍 Location"
          placeholder="e.g. Nagercoil"
          value={values.location}
          onChangeText={(value) => handleChange('location', value)}
          error={errors.location}
          autoCapitalize="words"
          returnKeyType="next"
          testID="input-location"
        />

        <TextField
          label="📐 Total Land Area (Acres)"
          placeholder="e.g. 2"
          value={values.landArea}
          onChangeText={(value) => handleChange('landArea', value)}
          error={errors.landArea}
          keyboardType="decimal-pad"
          returnKeyType="next"
          testID="input-land-area"
        />

        <TextField
          label="🏞️ Number of Fields"
          placeholder="e.g. 3"
          value={values.fieldCount}
          onChangeText={(value) => handleChange('fieldCount', value)}
          error={errors.fieldCount}
          keyboardType="number-pad"
          returnKeyType="next"
          testID="input-field-count"
        />

        <SelectField
          label="🌱 Main Crop"
          value={values.mainCrop}
          options={CROP_OPTIONS}
          onChange={(value) => handleChange('mainCrop', value)}
          placeholder="Select your main crop"
          error={errors.mainCrop}
          testID="select-main-crop"
        />

        <SelectField
          label="💧 Irrigation Type"
          value={values.irrigationType}
          options={IRRIGATION_OPTIONS}
          onChange={(value) => handleChange('irrigationType', value)}
          placeholder="Select your irrigation type"
          error={errors.irrigationType}
          testID="select-irrigation-type"
        />

        <SelectField
          label="💰 Approximate Income"
          value={values.income}
          options={INCOME_OPTIONS}
          onChange={(value) => handleChange('income', value)}
          placeholder="Select your income range per year"
          error={errors.income}
          testID="select-income"
        />

        <SelectField
          label="🏦 Loan Status"
          value={values.loanStatus}
          options={LOAN_STATUS_OPTIONS}
          onChange={(value) => handleChange('loanStatus', value)}
          placeholder="Select your current loan status"
          error={errors.loanStatus}
          testID="select-loan-status"
        />

        <View style={styles.actions}>
          <Button label="Save & Continue" onPress={handleSave} testID="save-profile-setup" />
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
