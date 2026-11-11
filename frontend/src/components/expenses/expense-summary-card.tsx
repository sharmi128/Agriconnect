import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatMonthYear, formatRupees } from '@/models/expenses';

type ExpenseSummaryCardProps = {
  /** Everything the farmer has recorded, across all dates. */
  total: number;
  /** Only the entries dated in the current month. */
  monthTotal: number;
  /** How many entries the totals were worked out from. */
  entryCount: number;
};

/**
 * The two headline figures at the top of the Expenses screen.
 *
 * The month figure is the one a farmer checks before buying anything, so it is
 * the larger of the two, and it is labelled with the month and year it actually
 * covers rather than a vague "this month". The all-time figure sits underneath
 * as the running total of everything recorded so far.
 *
 * Both numbers are worked out by the model from the list rather than stored, so
 * they cannot drift away from the entries listed underneath them.
 */
export function ExpenseSummaryCard({
  total,
  monthTotal,
  entryCount,
}: ExpenseSummaryCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      testID="expense-summary-card"
      style={[styles.card, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
      <View style={styles.headline}>
        <Text style={[styles.headlineLabel, { color: colors.onPrimary }]}>
          {`Spent in ${formatMonthYear()}`}
        </Text>
        <Text style={[styles.headlineValue, { color: colors.onPrimary }]} numberOfLines={1}>
          {formatRupees(monthTotal)}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.onPrimary }]} />

      <View style={styles.secondaryRow}>
        <View style={styles.secondary}>
          <Text style={[styles.secondaryLabel, { color: colors.onPrimary }]}>
            All-time total
          </Text>
          <Text style={[styles.secondaryValue, { color: colors.onPrimary }]} numberOfLines={1}>
            {formatRupees(total)}
          </Text>
        </View>

        <View style={styles.secondary}>
          <Text style={[styles.secondaryLabel, { color: colors.onPrimary }]}>Entries</Text>
          <Text style={[styles.secondaryValue, { color: colors.onPrimary }]}>
            {entryCount}
          </Text>
        </View>
      </View>
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
  headline: {
    gap: 2,
  },
  headlineLabel: {
    ...AgriTypography.caption,
    opacity: 0.9,
  },
  headlineValue: {
    ...AgriTypography.title,
  },
  divider: {
    height: 1,
    opacity: 0.25,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  secondary: {
    flex: 1,
    gap: 2,
  },
  secondaryLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
    opacity: 0.9,
  },
  secondaryValue: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
});
