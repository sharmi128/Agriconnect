import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatRupees, summarizeByCategory, type Expense } from '@/models/expenses';

type CategoryBreakdownCardProps = {
  expenses: Expense[];
};

/**
 * Where the money went, one row per category.
 *
 * The bar is the category's share of everything spent, so a farmer can see at a
 * glance whether fertiliser or labour is running away with the budget. A category
 * with no spending is left out rather than shown as a zero row, because an empty
 * row is noise on a screen the farmer reads quickly; the full set of categories
 * is still in the Add Expense dropdown, so nothing is harder to record.
 */
export function CategoryBreakdownCard({ expenses }: CategoryBreakdownCardProps) {
  const colors = useAgriTheme();
  const rows = summarizeByCategory(expenses).filter((row) => row.total > 0);

  if (rows.length === 0) {
    return null;
  }

  return (
    <SectionCard
      title="\u{1F4CA} Where It Went"
      subtitle="Each category's share of everything recorded"
      testID="expense-breakdown-card">
      {rows.map((row, index) => (
        <View
          key={row.category.id}
          style={[
            styles.row,
            index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
          ]}>
          <View style={styles.rowHeader}>
            <Text style={styles.rowEmoji}>{row.category.emoji}</Text>
            <Text style={[styles.rowLabel, { color: colors.text }]} numberOfLines={1}>
              {row.category.label}
            </Text>
            <Text style={[styles.rowPercent, { color: colors.textSecondary }]}>
              {`${row.percent}%`}
            </Text>
            <Text style={[styles.rowTotal, { color: colors.text }]}>
              {formatRupees(row.total)}
            </Text>
          </View>

          <View style={[styles.track, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.fill,
                { backgroundColor: colors.primary, width: `${row.percent}%` },
              ]}
            />
          </View>
        </View>
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 6,
    paddingVertical: Spacing.two,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowEmoji: {
    fontSize: 15,
    width: 20,
    textAlign: 'center',
  },
  rowLabel: {
    ...AgriTypography.body,
    flex: 1,
  },
  rowPercent: {
    ...AgriTypography.caption,
  },
  rowTotal: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
