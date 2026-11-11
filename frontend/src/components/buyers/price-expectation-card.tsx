import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography, type AgriPalette } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  KG_PER_QUINTAL,
  bestOfferFor,
  expectedValue,
  priceGapPerQuintal,
  totalBestOfferValue,
  totalExpectedValue,
  type Buyer,
  type BuyerOfferMatch,
  type HarvestLot,
} from '@/models/buyer-connection';
import { findCrop, type JournalCrop } from '@/models/crop-journal';
import { formatRupees } from '@/models/expenses';

type PriceExpectationCardProps = {
  lots: readonly HarvestLot[];
  /** The buyers being compared against, so the area filter is respected here too. */
  buyers: readonly Buyer[];
  crops: readonly JournalCrop[];
};

/**
 * 💰 Expected Price: what the farmer is asking, next to the best rate on offer.
 *
 * The two totals at the top are the whole point of the section — the asking value
 * of everything ready, and what that same harvest would fetch at the best rates
 * currently shown — because that difference is the decision the screen exists to
 * support. Each lot then shows the gap per quintal, so a shortfall is visible
 * before the call is made rather than after.
 */
export function PriceExpectationCard({ lots, buyers, crops }: PriceExpectationCardProps) {
  const colors = useAgriTheme();

  const askedTotal = totalExpectedValue(lots);
  const offerTotal = totalBestOfferValue(lots, buyers);
  const difference = offerTotal - askedTotal;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'💰'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatRupees(askedTotal)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>You are asking</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'🛒'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatRupees(offerTotal)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Best offers</Text>
        </View>
      </View>

      <Text
        style={[
          styles.difference,
          { color: difference >= 0 ? colors.primaryDark : colors.warning },
        ]}>
        {describeDifference(difference)}
      </Text>

      {lots.map((lot) => (
        <LotPriceRow
          key={lot.id}
          lot={lot}
          crop={findCrop(crops, lot.cropId)}
          match={bestOfferFor(buyers, lot.cropId)}
        />
      ))}

      <Text
        style={[styles.caption, { color: colors.textSecondary, borderTopColor: colors.border }]}>
        Rates are per quintal. A lot no buyer has quoted on is counted at your own asking rate.
      </Text>
    </View>
  );
}

type LotPriceRowProps = {
  lot: HarvestLot;
  crop?: JournalCrop;
  /** The best buyer for this crop, or `undefined` when nobody wants it. */
  match?: BuyerOfferMatch;
};

/** 💰 One crop's asking rate, the best offer for it, and the gap between them. */
function LotPriceRow({ lot, crop, match }: LotPriceRowProps) {
  const colors = useAgriTheme();
  const gap = match ? priceGapPerQuintal(lot, match.offer) : 0;
  const tone = getGapTone(gap, Boolean(match), colors);

  const gapLabel = !match
    ? 'No offers yet'
    : gap > 0
      ? `▲ ${formatRupees(gap)} more`
      : gap < 0
        ? `▼ ${formatRupees(Math.abs(gap))} less`
        : 'Same as your rate';

  const detail = match
    ? `You asked ${formatRupees(lot.expectedPricePerQuintal)} · ${
        match.buyer.name
      } offers ${formatRupees(match.offer.pricePerQuintal)}`
    : `You asked ${formatRupees(lot.expectedPricePerQuintal)} · no buyer has quoted yet`;

  return (
    <View style={[styles.lotRow, { borderTopColor: colors.border }]}>
      <View style={styles.lotHeader}>
        <Text style={styles.lotEmoji}>{crop?.emoji ?? '🌾'}</Text>
        <Text style={[styles.lotName, { color: colors.text }]} numberOfLines={1}>
          {crop?.name ?? 'Crop'}
        </Text>

        <View style={[styles.gapChip, { backgroundColor: tone.background }]}>
          <Text style={[styles.gapText, { color: tone.text }]} numberOfLines={1}>
            {gapLabel}
          </Text>
        </View>
      </View>

      <Text style={[styles.lotDetail, { color: colors.textSecondary }]} numberOfLines={2}>
        {detail}
      </Text>

      <Text style={[styles.lotValue, { color: colors.textSecondary }]} numberOfLines={1}>
        {match
          ? `💰 Lot value ${formatRupees(expectedValue(lot))} → ${formatRupees(
              valueAtRate(lot, match.offer.pricePerQuintal)
            )} at that rate`
          : `💰 Lot value ${formatRupees(expectedValue(lot))} at your rate`}
      </Text>
    </View>
  );
}

/** The line under the two totals, so the comparison needs no mental arithmetic. */
function describeDifference(difference: number): string {
  if (difference > 0) {
    return `Best offers are ${formatRupees(difference)} above your asking rates.`;
  }

  if (difference < 0) {
    return `Best offers are ${formatRupees(Math.abs(difference))} below your asking rates.`;
  }

  return 'Best offers match your asking rates.';
}

/** What one lot would fetch at a given rate. */
function valueAtRate(lot: HarvestLot, pricePerQuintal: number): number {
  return Math.round((lot.availableKg / KG_PER_QUINTAL) * pricePerQuintal);
}

/** Green when a buyer beats the asking rate, amber when the rate falls short. */
function getGapTone(
  gap: number,
  hasOffer: boolean,
  colors: AgriPalette
): { background: string; text: string } {
  if (!hasOffer) {
    return { background: colors.background, text: colors.textSecondary };
  }

  if (gap < 0) {
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
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: Spacing.one,
  },
  difference: {
    ...AgriTypography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  lotRow: {
    borderTopWidth: 1,
    paddingTop: Spacing.two,
    gap: 2,
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
  gapChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
    flexShrink: 1,
  },
  gapText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  lotDetail: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  lotValue: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  caption: {
    ...AgriTypography.caption,
    fontSize: 12,
    borderTopWidth: 1,
    paddingTop: Spacing.two,
    textAlign: 'center',
  },
});

