import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  /** Renders a back arrow when provided, for screens pushed from Welcome. */
  onBack?: () => void;
};

/**
 * Title, subtitle and optional back button shown at the top of the form screens.
 *
 * The native header is hidden in these layouts, so this component is what users
 * tap to go back.
 */
export function AuthHeader({ title, subtitle, onBack }: AuthHeaderProps) {
  const colors = useAgriTheme();

  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={[styles.backChevron, { color: colors.primary }]}>{'\u2039'}</Text>
          <Text style={[styles.backLabel, { color: colors.primary }]}>Back</Text>
        </Pressable>
      ) : null}

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
    marginBottom: Spacing.two,
  },
  pressed: {
    opacity: 0.6,
  },
  backChevron: {
    fontSize: 28,
    lineHeight: 30,
    marginTop: -4,
  },
  backLabel: {
    ...AgriTypography.label,
  },
  title: {
    ...AgriTypography.title,
  },
  subtitle: {
    ...AgriTypography.body,
  },
});
