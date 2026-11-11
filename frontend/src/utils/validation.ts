/**
 * Form validation for the AgriConnect auth screens.
 *
 * Every validator returns `undefined` when the value is fine, and a short
 * human-readable message when it is not. `validateRegisterForm` and
 * `validateLoginForm` run all the rules at once and return an object keyed by
 * field name, which is exactly the shape the screens keep in their state.
 *
 * These rules run on the device only. The Spring Boot backend must validate
 * everything again on the server, because a client can always be bypassed.
 */

/** Shortest password we accept. */
export const MIN_PASSWORD_LENGTH = 8;

export type RegisterFormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

/** Errors are keyed by field name. A field with no error is simply absent. */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Pragmatic email check: something, an `@`, a domain, and a dot plus a short
 * top-level domain. It is intentionally not a full RFC 5322 parser.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Digits only, 7 to 15 of them, which is the E.164 range. */
const PHONE_DIGITS_PATTERN = /^\d{7,15}$/;

/** Strips spaces, dashes, dots and brackets so "+254 (712) 345-678" is accepted. */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return PHONE_DIGITS_PATTERN.test(digitsOnly(phone));
}

export function validateRequired(value: string, fieldLabel: string): string | undefined {
  return value.trim().length > 0 ? undefined : `${fieldLabel} is required.`;
}

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return 'Email is required.';
  }
  if (!isValidEmail(trimmed)) {
    return 'Enter a valid email address, for example name@example.com.';
  }
  return undefined;
}

export function validatePhone(phone: string): string | undefined {
  const trimmed = phone.trim();
  if (trimmed.length === 0) {
    return 'Phone number is required.';
  }
  if (!isValidPhone(trimmed)) {
    return 'Enter a valid phone number with 7 to 15 digits.';
  }
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (password.length === 0) {
    return 'Password is required.';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }
  return undefined;
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): string | undefined {
  if (confirmPassword.length === 0) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return undefined;
}

export function validateFullName(fullName: string): string | undefined {
  const trimmed = fullName.trim();
  const requiredError = validateRequired(trimmed, 'Full name');
  if (requiredError) {
    return requiredError;
  }
  if (trimmed.length < 2) {
    return 'Full name looks too short.';
  }
  return undefined;
}

/** Runs every register rule and returns only the fields that failed. */
export function validateRegisterForm(values: RegisterFormValues): FieldErrors<RegisterFormValues> {
  const errors: FieldErrors<RegisterFormValues> = {};

  const fullNameError = validateFullName(values.fullName);
  if (fullNameError) errors.fullName = fullNameError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validatePasswordConfirmation(
    values.password,
    values.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
}

export function validateLoginForm(values: LoginFormValues): FieldErrors<LoginFormValues> {
  const errors: FieldErrors<LoginFormValues> = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validateRequired(values.password, 'Password');
  if (passwordError) errors.password = passwordError;

  return errors;
}

/** True when the errors object has no entries. */
export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
