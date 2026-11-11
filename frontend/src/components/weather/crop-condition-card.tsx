import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography, type AgriPalette } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { CropCondition, CropStatus } from '@/models/weather';

type CropConditionCardProps = {
  condition: CropCondition;
};

/**
 * How one crop is doing, shown as a simple status label.
 *
 * The status is a dot plus a word rather than colour alone, so it still reads
 * correctly for colour blind users and in dark mode.
 */
export function CropConditionCard({ condition }: CropConditionCardProps) {
  const colors = useAgriTheme();
  const { background, text } = getStatusColors(condition.status, colors);

  return (
    <View
      accessibilityLabel={`${condition.crop} in ${condition.field}. ${condition.status}. ${condition.note}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconCircle, { backgroundColor: background }]}>
        <Text style={styles.emoji}>{condition.emoji}</Text>
      </View>

      <View style={styles.text}>
        <View style={styles.headerRow}>
          <Text style={[styles.crop, { color: colors.text }]} numberOfLines={1}>
            {condition.crop}
          </Text>

          <View style={[styles.badge, { backgroundColor: background }]}>
            <View style={[styles.badgeDot, { backgroundColor: text }]} />
            <Text style={[styles.badgeText, { color: text }]} numberOfLines={1}>
              {condition.status}
            </Text>
          </View>
        </View>

        <Text style={[styles.field, { color: colors.textSecondary }]} numberOfLines={1}>
          {condition.field}
        </Text>

        <Text style={[styles.note, { color: colors.textSecondary }]}>{condition.note}</Text>
      </View>
    </View>
  );
}

/** Maps a crop status to the background and text colour of its label. */
function getStatusColors(
  status: CropStatus,
  colors: AgriPalette
): { background: string; text: string } {
  if (status === 'At risk') {
    return { background: colors.dangerSoft, text: colors.danger };
  }
  if (status === 'Watch') {
    return { background: colors.warningSoft, text: colors.warning };
  }
  if (status === 'Good') {
    return { background: colors.primarySoft, text: colors.primaryDark };
  }
  return { background: colors.primary, text: colors.onPrimary };
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 19,
    lineHeight: 24,
  },
  text: {
    flex: 1,
    gap: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  crop: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    flexShrink: 1,
  },
  field: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  note: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});
