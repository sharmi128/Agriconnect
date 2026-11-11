import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type EmptyStateProps = {
  /** The category's icon, so the empty state still looks like where it is. */
  emoji: string;
  title: string;
  body: string;
  /** Optional action, for example clearing a search that matched nothing. */
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
};

/**
 * What a category page shows when a search or filter leaves nothing behind.
 *
 * It says what to do about it rather than just reporting an empty list, because
 * "no results" with no way forward is the one screen a farmer cannot act on.
 */
export function EmptyState({
  emoji,
  title,
  body,
  actionLabel,
  onAction,
  testID,
}: EmptyStateProps) {
  const colors = useAgriTheme();

  return (
    <View
      testID={testID}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconTile, { backgroundColor: colors.harvestSoft }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text>

      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={({ pressed }) => [
            styles.action,
            { backgroundColor: colors.primarySoft, borderColor: colors.primary },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.actionText, { color: colors.primaryDark }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  body: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
  action: {
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  actionText: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
