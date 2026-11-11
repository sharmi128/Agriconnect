import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type FeatureCardProps = {
  emoji: string;
  title: string;
  /** The headline number or status shown in bold. */
  value: string;
  /** Small supporting line under the value. */
  caption: string;
  /**
   * Called when the card is tapped. The cards are already tappable and give
   * press feedback; the handler is where a real route will be opened later.
   */
  onPress: () => void;
};

/**
 * One of the tappable feature tiles on the Home dashboard.
 *
 * The whole card is a single press target, so it is easy to hit on a phone.
 * `value` and `caption` both use `numberOfLines` so a long translation cannot
 * push the card taller than its neighbour in the grid.
 */
export function FeatureCard({ emoji, title, value, caption, onPress }: FeatureCardProps) {
  const colors = useAgriTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${value}. ${caption}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View
        style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <Text style={[styles.title, { color: colors.textSecondary }]} numberOfLines={1}>
        {title}
      </Text>

      <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>

      <Text style={[styles.caption, { color: colors.textSecondary }]} numberOfLines={2}>
        {caption}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    // `flex: 1` lets two cards share a row evenly, whatever their content.
    flex: 1,
    gap: 2,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    // Gives every card the same height, so the grid lines up.
    minHeight: 156,
  },
  pressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  title: {
    ...AgriTypography.caption,
  },
  value: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  caption: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
});
