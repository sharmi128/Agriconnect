import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthScreen } from '@/components/auth/auth-screen';
import { AuthSwitchLink } from '@/components/auth/auth-switch-link';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { IS_API_CONFIGURED } from '@/config/env';
import { ApiError } from '@/services/api-client';
import { registerUser } from '@/services/auth-service';
import {
  hasErrors,
  MIN_PASSWORD_LENGTH,
  validateRegisterForm,
  type FieldErrors,
  type RegisterFormValues,
} from '@/utils/validation';

const EMPTY_FORM: RegisterFormValues = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

/**
 * Register screen.
 *
 * What happens on submit, in order:
 *   1. Validate every field on the device and show the messages inline.
 *   2. If a backend URL is configured, POST the details to the Spring Boot API.
 *   3. Go to the app's Home screen.
 *
 * Step 2 is skipped while no backend is configured, which is why the app can be
 * tested on its own. The note above the form explains this to the user instead
 * of showing a made-up "registration successful" message.
 */
export default function RegisterScreen() {
  const [values, setValues] = useState<RegisterFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<RegisterFormValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Updates one field and clears its error as soon as the user starts typing. */
  function handleChange(field: keyof RegisterFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleSubmit() {
    const nextErrors = validateRegisterForm(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (IS_API_CONFIGURED) {
        await registerUser({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        });
      }

      // TODO: store the returned token in secure storage once the backend is live.
      router.replace('/home');
    } catch (error) {
      // Map per-field problems from the backend onto the matching inputs.
      if (error instanceof ApiError) {
        setErrors((current) => ({ ...current, ...error.fieldErrors }));
        setFormError(error.message);
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen testID="register-screen">
      <AuthHeader
        title="Create your account"
        subtitle="A few details and you are ready to start farming smarter."
        onBack={() => router.back()}
      />

      <View style={styles.form}>
        {!IS_API_CONFIGURED ? (
          <FormAlert
            tone="info"
            message="Demo mode: the backend is not connected yet, so only your form will be checked. Set EXPO_PUBLIC_API_URL in .env to connect it."
            testID="demo-mode-alert"
          />
        ) : null}

        {formError ? <FormAlert tone="error" message={formError} testID="form-error" /> : null}

        <TextField
          label="Full Name"
          placeholder="e.g. Amina Kamau"
          value={values.fullName}
          onChangeText={(value) => handleChange('fullName', value)}
          error={errors.fullName}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          testID="input-full-name"
        />

        <TextField
          label="Email"
          placeholder="e.g. amina@example.com"
          value={values.email}
          onChangeText={(value) => handleChange('email', value)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          testID="input-email"
        />

        <TextField
          label="Phone Number"
          placeholder="e.g. +254 712 345 678"
          value={values.phone}
          onChangeText={(value) => handleChange('phone', value)}
          error={errors.phone}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="next"
          testID="input-phone"
        />

        <TextField
          label="Password"
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          value={values.password}
          onChangeText={(value) => handleChange('password', value)}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          testID="input-password"
        />

        <TextField
          label="Confirm Password"
          placeholder="Type your password again"
          value={values.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
          error={errors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          testID="input-confirm-password"
        />

        <Button
          label="Register"
          onPress={handleSubmit}
          loading={isSubmitting}
          testID="submit-register"
        />

        <AuthSwitchLink
          prompt="Already have an account?"
          actionLabel="Login"
          onPress={() => router.replace('/login')}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
});
