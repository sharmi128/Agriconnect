import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatQuintals, type Buyer } from '@/models/buyer-connection';
import { findCrop, formatHarvestQuantity, type JournalCrop } from '@/models/crop-journal';
import { formatRupees } from '@/models/expenses';

type BuyerCardProps = {
  buyer: Buyer;
  /** The journal crops, so every offer can show a crop name and emoji. */
  crops: readonly JournalCrop[];
  onPress: (buyer: Buyer) => void;
};

/**
 * 🛒 One buyer who is looking for produce.
 *
 * The card carries 📍 Buyer Location, 💰 Expected Price and 📦 Crop Quantity at
 * once, because that is how they are weighed up in practice: a rate only means
 * something next to the distance it has to travel and the amount the buyer will
 * actually take. Each offer is one crop, so a buyer who wants two crops shows two
 * blocks instead of one crowded sentence.
 *
 * Tapping the card opens 📞 Contact Buyer, which is also spelled out in the
 * footer so the tap target is obvious.
 */
export function BuyerCard({ buyer, crops, onPress }: BuyerCardProps) {
  const colors = useAgriTheme();

  const accessibilityLabel = `${buyer.name}, ${buyer.kind}, ${buyer.distanceKm} kilometres away in ${buyer.location}. Tap to contact them.`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => onPress(buyer)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.icon}>{buyer.emoji}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {buyer.name}
          </Text>
          <Text style={[styles.kind, { color: colors.textSecondary }]} numberOfLines={1}>
            {`${buyer.kind} · ⭐ ${buyer.rating.toFixed(1)}`}
          </Text>
        </View>

        {buyer.verified ? (
          <View style={[styles.verifiedChip, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.verifiedText, { color: colors.primaryDark }]} numberOfLines={1}>
              {'✅ Verified'}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.factList}>
        <Text style={[styles.fact, { color: colors.textSecondary }]} numberOfLines={1}>
          {`📍 ${buyer.location} · ${buyer.distanceKm} km from your farm`}
        </Text>
        <Text style={[styles.fact, { color: colors.textSecondary }]} numberOfLines={1}>
          {`🚚 ${buyer.pickup} · 💳 ${buyer.payment}`}
        </Text>
      </View>

      <View style={styles.offerList}>
        {buyer.offers.map((offer) => {
          const crop = findCrop(crops, offer.cropId);

          return (
            <View
              key={offer.cropId}
              style={[
                styles.offer,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}>
              <View style={styles.offerHeader}>
                <Text style={styles.offerEmoji}>{crop?.emoji ?? '🌾'}</Text>
                <Text style={[styles.offerCrop, { color: colors.text }]} numberOfLines={1}>
                  {crop?.name ?? 'Crop'}
                </Text>
                <Text style={[styles.offerPrice, { color: colors.primaryDark }]} numberOfLines={1}>
                  {`${formatRupees(offer.pricePerQuintal)} / quintal`}
                </Text>
              </View>

              <Text style={[styles.offerQuantity, { color: colors.textSecondary }]} numberOfLines={1}>
                {`📦 Wants up to ${formatQuintals(offer.neededKg)} (${formatHarvestQuantity(
                  offer.neededKg
                )})`}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.closes, { color: colors.textSecondary }]} numberOfLines={1}>
          {buyer.closesOn}
        </Text>

        <Text style={[styles.contact, { color: colors.primary }]} numberOfLines={1}>
          {'📞 Contact Buyer ›'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
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
  kind: {
    ...AgriTypography.caption,
  },
  verifiedChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  verifiedText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  factList: {
    gap: 2,
  },
  fact: {
    ...AgriTypography.caption,
  },
  offerList: {
    gap: Spacing.two,
  },
  offer: {
    padding: Spacing.two,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
    gap: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offerEmoji: {
    fontSize: 14,
    lineHeight: 20,
  },
  offerCrop: {
    ...AgriTypography.label,
    flex: 1,
  },
  offerPrice: {
    ...AgriTypography.label,
    fontWeight: '700',
    flexShrink: 1,
  },
  offerQuantity: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  closes: {
    ...AgriTypography.caption,
    fontSize: 12,
    flexShrink: 1,
  },
  contact: {
    ...AgriTypography.label,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
});
