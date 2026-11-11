import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  demandCount,
  formatQuintals,
  totalAvailableKg,
  totalDemandKg,
  type Buyer,
  type HarvestLot,
} from '@/models/buyer-connection';
import { findCrop, formatHarvestQuantity, type JournalCrop } from '@/models/crop-journal';

type QuantitySummaryCardProps = {
  lots: readonly HarvestLot[];
  /** The buyers being counted, so the area filter is respected here too. */
  buyers: readonly Buyer[];
  crops: readonly JournalCrop[];
};

/**
 * 📦 Crop Quantity: how much is ready, and how much of it the buyers can take.
 *
 * Every crop gets a bar measured against the heaviest lot, so the biggest pile of
 * produce is obvious at a glance, with the demand for that same crop written
 * beside it. That pairing is what stops a farmer ringing a buyer who can only
 * take a small part of the bags in the shed.
 */
export function QuantitySummaryCard({ lots, buyers, crops }: QuantitySummaryCardProps) {
  const colors = useAgriTheme();

  const availableTotal = totalAvailableKg(lots);
  // One entry per crop on the screen, which is what the lots already are.
  const enquiryCount = lots.reduce((total, lot) => total + demandCount(buyers, lot.cropId), 0);
  const demandTotal = lots.reduce((total, lot) => total + totalDemandKg(buyers, lot.cropId), 0);
  const heaviest = lots.reduce((max, lot) => Math.max(max, lot.availableKg), 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'📦'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatQuintals(availableTotal)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {`Ready to sell (${formatHarvestQuantity(availableTotal)})`}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'🛒'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {`${enquiryCount}`}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {enquiryCount === 1 ? 'Buyer enquiry' : 'Buyer enquiries'}
          </Text>
        </View>
      </View>

      <Text style={[styles.demandLine, { color: colors.textSecondary }]}>
        {enquiryCount === 0
          ? 'No buyer is looking for these crops yet.'
          : `Buyers shown want about ${formatQuintals(demandTotal)} of what you have ready.`}
      </Text>

      {lots.map((lot) => {
        const crop = findCrop(crops, lot.cropId);
        const demand = totalDemandKg(buyers, lot.cropId);
        const enquiring = demandCount(buyers, lot.cropId);
        const percent = heaviest > 0 ? Math.round((lot.availableKg / heaviest) * 100) : 0;

        return (
          <View key={lot.id} style={[styles.lotRow, { borderTopColor: colors.border }]}>
            <View style={styles.lotHeader}>
              <Text style={styles.lotEmoji}>{crop?.emoji ?? '🌾'}</Text>
              <Text style={[styles.lotName, { color: colors.text }]} numberOfLines={1}>
                {crop?.name ?? 'Crop'}
              </Text>
              <Text style={[styles.lotQuantity, { color: colors.text }]} numberOfLines={1}>
                {formatQuintals(lot.availableKg)}
              </Text>
            </View>

            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <View
                style={[styles.fill, { backgroundColor: colors.primary, width: `${percent}%` }]}
              />
            </View>

            <Text style={[styles.lotDetail, { color: colors.textSecondary }]} numberOfLines={1}>
              {enquiring > 0
                ? `${enquiring} ${
                    enquiring === 1 ? 'buyer can take' : 'buyers can take'
                  } ${formatQuintals(demand)} between them`
                : 'No buyer has quoted for this crop yet'}
            </Text>
          </View>
        );
      })}

      <Text
        style={[styles.caption, { color: colors.textSecondary, borderTopColor: colors.border }]}>
        Only produce that is already picked is counted here. Crops still in the field are on the
        Harvest screen.
      </Text>
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
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  statLabel: {
    ...AgriTypography.caption,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: Spacing.one,
  },
  demandLine: {
    ...AgriTypography.caption,
    textAlign: 'center',
  },
  lotRow: {
    borderTopWidth: 1,
    paddingTop: Spacing.two,
    gap: Spacing.one,
  },
  lotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lotEmoji: {
    fontSize: 16,
    lineHeight: 22,
  },
  lotName: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
  },
  lotQuantity: {
    ...AgriTypography.label,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
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
  lotDetail: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  caption: {
    ...AgriTypography.caption,
    fontSize: 12,
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
});
