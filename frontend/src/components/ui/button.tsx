import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** Shows a spinner and blocks presses while a request is running. */
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
};

/**
 * The one button used across the auth screens, so every action in the flow
 * looks the same. `primary` is the green filled button, `secondary` is the
 * outlined one used for less important actions.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  testID,
}: ButtonProps) {
  const colors = useAgriTheme();
  const isPrimary = variant === 'primary';
  // A loading button must not fire again, so it counts as disabled.
  const isInactive = disabled || loading;

  const backgroundColor = isPrimary ? colors.primary : 'transparent';
  const textColor = isPrimary ? colors.onPrimary : colors.primary;
  const borderColor = isPrimary ? colors.primary : colors.borderStrong;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      testID={testID}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        // A filled button is the one thing on screen a finger is aimed at, so it
        // carries a little more lift than the cards around it.
        isPrimary && AgriShadows.raised,
        { backgroundColor, borderColor },
        // Only dim on press, so a disabled button still looks readable.
        pressed && !isInactive && styles.pressed,
        isInactive && styles.inactive,
        style,
      ]}>
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={textColor} />
          <Text style={[styles.label, { color: textColor }]}>Please wait...</Text>
        </View>
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.8,
  },
  inactive: {
    opacity: 0.5,
  },
  label: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
