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
import { loginUser } from '@/services/auth-service';
import {
  hasErrors,
  validateLoginForm,
  type FieldErrors,
  type LoginFormValues,
} from '@/utils/validation';

const EMPTY_FORM: LoginFormValues = {
  email: '',
  password: '',
};

/**
 * Login screen.
 *
 * Works the same way as Register: validate on the device, call the backend when
 * one is configured, then go to Home.
 */
export default function LoginScreen() {
  const [values, setValues] = useState<LoginFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<LoginFormValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof LoginFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleSubmit() {
    const nextErrors = validateLoginForm(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (IS_API_CONFIGURED) {
        await loginUser({ email: values.email, password: values.password });
      }

      // TODO: store the returned token in secure storage once the backend is live.
      router.replace('/home');
    } catch (error) {
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
    <AuthScreen testID="login-screen">
      <AuthHeader
        title="Welcome back"
        subtitle="Log in to continue to your farm dashboard."
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
          label="Password"
          placeholder="Enter your password"
          value={values.password}
          onChangeText={(value) => handleChange('password', value)}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          testID="input-password"
        />

        <Button label="Login" onPress={handleSubmit} loading={isSubmitting} testID="submit-login" />

        <AuthSwitchLink
          prompt="Don't have an account?"
          actionLabel="Register"
          onPress={() => router.replace('/register')}
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
