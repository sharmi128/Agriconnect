import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { expectedValue, formatQuintals, type HarvestLot } from '@/models/buyer-connection';
import { formatHarvestQuantity, type JournalCrop } from '@/models/crop-journal';
import { formatRupees } from '@/models/expenses';

type HarvestLotCardProps = {
  lot: HarvestLot;
  /** The crop in the journal, so the name, emoji and field stay in one place. */
  crop?: JournalCrop;
  /** True for the lot whose buyers are listed underneath. */
  isSelected: boolean;
  onPress: (lot: HarvestLot) => void;
};

/**
 * 🌾 One lot of harvest that is ready to sell.
 *
 * The card answers the two questions a buyer asks first — how much is there, and
 * what is it worth — as labelled figures, and keeps the farmer's asking rate in
 * the same block so the two can be compared without arithmetic.
 *
 * Tapping the card picks the crop for the buying sections below it, which is why
 * the selected lot carries a green border and a "Buyers shown" chip, exactly like
 * the crop cards on the Harvest screen.
 */
export function HarvestLotCard({ lot, crop, isSelected, onPress }: HarvestLotCardProps) {
  const colors = useAgriTheme();
  const cropName = crop?.name ?? 'Crop';
  const where = crop ? `${crop.fieldName} · ${lot.grade}` : lot.grade;

  const accessibilityLabel = `${cropName}, ${formatQuintals(
    lot.availableKg
  )} ready to sell, asking ${formatRupees(lot.expectedPricePerQuintal)} a quintal. ${
    isSelected ? 'Their buyers are listed below.' : 'Tap to see the buyers for this lot.'
  }`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={accessibilityLabel}
      onPress={() => onPress(lot)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 1,
        },
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.icon}>{crop?.emoji ?? '🌾'}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {cropName}
          </Text>
          <Text style={[styles.where, { color: colors.textSecondary }]} numberOfLines={1}>
            {where}
          </Text>
        </View>

        {isSelected ? (
          <View style={[styles.selectedChip, { backgroundColor: colors.primary }]}>
            <Text style={[styles.selectedChipText, { color: colors.onPrimary }]} numberOfLines={1}>
              Buyers shown
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={2}>
        {lot.note ?? 'No extra notes for this lot yet.'}
      </Text>

      <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>📦 Available</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatQuintals(lot.availableKg)}
          </Text>
          <Text style={[styles.statHint, { color: colors.textSecondary }]} numberOfLines={1}>
            {formatHarvestQuantity(lot.availableKg)}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>💰 Expected price</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatRupees(lot.expectedPricePerQuintal)}
          </Text>
          <Text style={[styles.statHint, { color: colors.textSecondary }]} numberOfLines={1}>
            per quintal
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={[styles.readyChip, { backgroundColor: colors.warningSoft }]}>
          <Text style={[styles.readyText, { color: colors.warning }]} numberOfLines={1}>
            {lot.readyLabel}
          </Text>
        </View>

        <Text style={[styles.lotValue, { color: colors.textSecondary }]} numberOfLines={1}>
          {`Worth ${formatRupees(expectedValue(lot))} at your rate`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    lineHeight: 28,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  where: {
    ...AgriTypography.caption,
  },
  selectedChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  selectedChipText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  note: {
    ...AgriTypography.caption,
    fontWeight: '400',
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
  statHint: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  readyChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AgriRadius.pill,
    flexShrink: 1,
  },
  readyText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  lotValue: {
    ...AgriTypography.caption,
    fontSize: 12,
    flexShrink: 1,
    textAlign: 'right',
  },
});
