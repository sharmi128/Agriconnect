import { Pressable, StyleSheet, Text } from 'react-native';

import { AgriTypography } from '@/constants/agri-theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type AuthSwitchLinkProps = {
  /** The plain prompt, for example "Already have an account?". */
  prompt: string;
  /** The tappable word, for example "Login". */
  actionLabel: string;
  onPress: () => void;
};

/**
 * The "Already have an account? Login" line at the bottom of the Register
 * screen, and its counterpart on the Login screen.
 */
export function AuthSwitchLink({ prompt, actionLabel, onPress }: AuthSwitchLinkProps) {
  const colors = useAgriTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${prompt} ${actionLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <Text style={[styles.prompt, { color: colors.textSecondary }]}>{prompt} </Text>
      <Text style={[styles.action, { color: colors.primary }]}>{actionLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  prompt: {
    ...AgriTypography.body,
  },
  action: {
    ...AgriTypography.body,
    fontWeight: '700',
  },
});
