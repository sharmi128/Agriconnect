import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatHarvestQuantity, type HarvestRecord, type JournalCrop } from '@/models/crop-journal';
import { formatRupees } from '@/models/expenses';

type HarvestRecordCardProps = {
  record: HarvestRecord;
  /** The crop the record belongs to. Missing only if the crop was removed. */
  crop?: JournalCrop;
};

/**
 * 📋 One line of harvest history: what was picked, when, how much, and what it
 * was worth.
 *
 * Quantity and value are shown as two labelled figures rather than one sentence,
 * which is what makes a column of these easy to scan.
 */
export function HarvestRecordCard({ record, crop }: HarvestRecordCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      accessibilityLabel={`${crop?.name ?? 'Crop'}, ${record.date}, ${formatHarvestQuantity(
        record.quantityKg
      )}, ${formatRupees(record.value)}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.icon}>{crop?.emoji ?? '🌾'}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {crop?.name ?? 'Crop'}
          </Text>
          <Text style={[styles.field, { color: colors.textSecondary }]} numberOfLines={1}>
            {crop ? crop.fieldName : 'Field not recorded'}
          </Text>
        </View>

        <Text style={[styles.date, { color: colors.textSecondary }]}>{record.date}</Text>
      </View>

      <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>⚖️ Quantity</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatHarvestQuantity(record.quantityKg)}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>💰 Value</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatRupees(record.value)}
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
  date: {
    ...AgriTypography.caption,
    fontWeight: '700',
    flexShrink: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  statValue: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
});
