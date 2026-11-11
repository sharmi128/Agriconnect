import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

/**
 * The look of the bordered row that sits under a field label.
 *
 * `TextField` and `SelectField` both spread this over their own container and
 * add the colours they need, so text inputs and dropdowns stay pixel-identical.
 */
export const fieldRowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderRadius: AgriRadius.medium,
  paddingHorizontal: 14,
  minHeight: 52,
} as const;

type FieldWrapperProps = {
  label: string;
  /** Message from validation. When set, the row border should turn red. */
  error?: string;
  /** The input or dropdown itself. */
  children: React.ReactNode;
};

/**
 * Label, content and error message, shared by every form field in the app.
 * Keeping this in one place is what makes all the forms look the same.
 */
export function FieldWrapper({ label, error, children }: FieldWrapperProps) {
  const colors = useAgriTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>

      {children}

      {/* The error only takes up room once it exists, so the form shifts a little. */}
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    ...AgriTypography.label,
  },
  error: {
    ...AgriTypography.caption,
  },
});
