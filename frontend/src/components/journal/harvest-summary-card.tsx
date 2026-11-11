import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  formatHarvestQuantity,
  harvestedCropCount,
  totalHarvestQuantityKg,
  totalHarvestValue,
  type HarvestRecord,
} from '@/models/crop-journal';
import { formatRupees } from '@/models/expenses';

type HarvestSummaryCardProps = {
  records: HarvestRecord[];
};

/**
 * ⚖️ Harvest Quantity and 💰 Harvest Value, added up across every recorded
 * harvest.
 *
 * The two totals are computed from the records rather than stored, so they can
 * never disagree with the history list underneath. Money is formatted with the
 * same `formatRupees` helper the expenses screen uses, so a rupee amount is
 * written the same way wherever it appears.
 */
export function HarvestSummaryCard({ records }: HarvestSummaryCardProps) {
  const colors = useAgriTheme();

  const totalQuantity = totalHarvestQuantityKg(records);
  const totalValue = totalHarvestValue(records);
  const cropCount = harvestedCropCount(records);

  const caption =
    records.length === 0
      ? 'Nothing harvested yet this season.'
      : `${records.length} ${records.length === 1 ? 'harvest' : 'harvests'} from ${cropCount} ${
          cropCount === 1 ? 'crop' : 'crops'
        }`;

  return (
    <View
      testID="harvest-summary-card"
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'⚖️'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatHarvestQuantity(totalQuantity)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total quantity
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'💰'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatRupees(totalValue)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total value</Text>
        </View>
      </View>

      <Text style={[styles.caption, { color: colors.textSecondary }]}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: Spacing.two,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  statValue: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  statLabel: {
    ...AgriTypography.caption,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: Spacing.one,
  },
  caption: {
    ...AgriTypography.caption,
    textAlign: 'center',
  },
});
