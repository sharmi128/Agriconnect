import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatQuintals } from '@/models/buyer-connection';
import { demandCoversHarvest, priceGap, type CropDemand } from '@/models/buyers';
import { formatRupees } from '@/models/expenses';

type CropDemandCardProps = {
  /** The crops the buyers currently on screen want, added up per crop. */
  demand: readonly CropDemand[];
};

/**
 * 🌱📦💰 What the buyers on screen want, one row per crop.
 *
 * This is the card that answers the three questions a farmer asks before ringing
 * anyone: which crop is wanted, how much of it is wanted, and what it is worth.
 * The 💰 best rate is shown next to the farmer's own asking rate, because a rate
 * on its own means nothing until it is compared to what they had in mind.
 *
 * The rows are worked out from whichever buyers are showing, so the card and the
 * buyer list underneath it can never describe different sets. A row also says
 * whether the demand would swallow the whole lot, which is the moment a farmer
 * stops looking for a second buyer.
 */
export function CropDemandCard({ demand }: CropDemandCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="🌱 Crop Required"
      subtitle="What the buyers shown are looking for, and what it is worth per quintal"
      testID="buyers-crop-demand">
      {demand.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          None of the buyers shown want a crop you grow. Clear a filter to see the whole list.
        </Text>
      ) : (
        <View style={styles.list}>
          {demand.map((entry, index) => {
            const gap = priceGap(entry);
            const covered = demandCoversHarvest(entry);

            return (
              <View
                key={entry.cropId}
                style={[
                  styles.row,
                  // A hairline between rows, but not above the first one.
                  index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                ]}>
                <View style={styles.header}>
                  <Text style={styles.emoji}>{entry.emoji}</Text>
                  <Text style={[styles.crop, { color: colors.text }]} numberOfLines={1}>
                    {entry.name}
                  </Text>

                  <Text style={[styles.price, { color: colors.primaryDark }]} numberOfLines={1}>
                    {`💰 ${formatRupees(entry.bestPricePerQuintal)} / qtl`}
                  </Text>
                </View>

                <View style={styles.facts}>
                  <Text style={[styles.fact, { color: colors.textSecondary }]}>
                    {`📦 ${formatQuintals(entry.wantedKg)} wanted by ${entry.buyerCount} ${
                      entry.buyerCount === 1 ? 'buyer' : 'buyers'
                    }`}
                  </Text>
                  <Text style={[styles.fact, { color: colors.textSecondary }]} numberOfLines={2}>
                    {`📍 Best rate from ${entry.bestBuyerName}, ${entry.bestBuyerDistanceKm} km away`}
                  </Text>
                </View>

                {entry.expectedPricePerQuintal !== undefined ? (
                  <View style={styles.gapRow}>
                    <Text style={[styles.gapLabel, { color: colors.textSecondary }]}>
                      {`You asked ${formatRupees(entry.expectedPricePerQuintal)} / qtl`}
                    </Text>

                    <Text
                      style={[
                        styles.gapValue,
                        { color: gap !== null && gap >= 0 ? colors.primary : colors.danger },
                      ]}
                      numberOfLines={1}>
                      {gap === null
                        ? 'No rate given'
                        : `${gap >= 0 ? '▲' : '▼'} ${formatRupees(Math.abs(gap))} / qtl`}
                    </Text>
                  </View>
                ) : null}

                {entry.availableKg !== undefined ? (
                  <View
                    style={[
                      styles.cover,
                      covered
                        ? { backgroundColor: colors.primarySoft, borderColor: colors.primary }
                        : { backgroundColor: colors.background, borderColor: colors.border },
                    ]}>
                    <Text
                      style={[
                        styles.coverText,
                        { color: covered ? colors.primaryDark : colors.textSecondary },
                      ]}>
                      {covered
                        ? `These buyers could take all ${formatQuintals(entry.availableKg)} you have ready.`
                        : `You have ${formatQuintals(entry.availableKg)} ready. These buyers want less, so the rest needs another buyer.`}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  empty: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  row: {
    paddingVertical: Spacing.three,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 15,
    lineHeight: 21,
  },
  crop: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
  },
  price: {
    ...AgriTypography.label,
    fontWeight: '700',
    flexShrink: 1,
  },
  facts: {
    gap: 2,
  },
  fact: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  gapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  gapLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
    flexShrink: 1,
  },
  gapValue: {
    ...AgriTypography.label,
    fontWeight: '700',
    flexShrink: 1,
  },
  cover: {
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  coverText: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});
