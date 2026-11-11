import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography, type AgriPalette } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  daysUntilHarvest,
  describeDaysToHarvest,
  stageProgress,
  type JournalCrop,
} from '@/models/crop-journal';

type ExpectedHarvestCardProps = {
  crop: JournalCrop;
};

/**
 * 🌾 One crop's expected harvest date.
 *
 * The date is the headline, and the chip beside the crop name says how far away
 * it is, so a farmer can see what is coming up without doing the arithmetic. The
 * chip turns amber inside a week and red once the date has passed.
 *
 * A crop that is already harvested shows "Harvested" instead of a countdown,
 * because a date in the past would otherwise read as overdue forever.
 */
export function ExpectedHarvestCard({ crop }: ExpectedHarvestCardProps) {
  const colors = useAgriTheme();

  const days = daysUntilHarvest(crop.expectedHarvest);
  const isHarvested = crop.stage === 'Harvested';
  const countdown = isHarvested ? 'Harvested' : describeDaysToHarvest(days);
  const countdownColors = getCountdownColors(days, isHarvested, colors);
  const progress = stageProgress(crop.stage);

  return (
    <View
      accessibilityLabel={`${crop.name} in ${crop.fieldName}. Expected harvest ${crop.expectedHarvest}. ${countdown}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.icon}>{crop.emoji}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {crop.name}
          </Text>
          <Text style={[styles.field, { color: colors.textSecondary }]} numberOfLines={1}>
            {crop.fieldName} · {crop.areaAcres} ac
          </Text>
        </View>

        <View style={[styles.chip, { backgroundColor: countdownColors.background }]}>
          <Text
            style={[styles.chipText, { color: countdownColors.text }]}
            numberOfLines={1}>
            {countdown}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.detail}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            🌾 Expected harvest
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
            {crop.expectedHarvest}
          </Text>
        </View>

        <View style={styles.detail}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            Current stage
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
            {crop.stage} · {progress}%
          </Text>
        </View>
      </View>
    </View>
  );
}

/**
 * How urgent the countdown chip looks.
 *
 * A harvested crop is finished rather than late, so it keeps the calm green and
 * never turns red.
 */
function getCountdownColors(
  days: number | null,
  isHarvested: boolean,
  colors: AgriPalette
): { background: string; text: string } {
  if (!isHarvested && days !== null && days < 0) {
    return { background: colors.dangerSoft, text: colors.danger };
  }
  if (!isHarvested && days !== null && days <= 7) {
    return { background: colors.warningSoft, text: colors.warning };
  }
  return { background: colors.primarySoft, text: colors.primaryDark };
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    lineHeight: 26,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...AgriTypography.body,
    fontWeight: '700',
  },
  field: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AgriRadius.pill,
  },
  chipText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.two,
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  detail: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  detailValue: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
});
