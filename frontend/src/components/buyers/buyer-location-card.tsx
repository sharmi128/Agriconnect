import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { Buyer } from '@/models/buyer-connection';

type BuyerLocationCardProps = {
  /** The buyers inside the chosen area, already nearest first. */
  buyers: readonly Buyer[];
  onPress: (buyer: Buyer) => void;
};

/**
 * 📍 Buyer Location, one row per buyer and nearest first.
 *
 * Distance is what decides whether a rate is worth taking, because a lorry has
 * to travel it, so every row leads with the town and how far away it is. Rows
 * are tappable and open 📞 Contact Buyer, which keeps the list useful rather
 * than just informative.
 */
export function BuyerLocationCard({ buyers, onPress }: BuyerLocationCardProps) {
  const colors = useAgriTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {buyers.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          No buyers in this area yet. Try a wider range.
        </Text>
      ) : (
        buyers.map((buyer, index) => (
          <Pressable
            key={buyer.id}
            accessibilityRole="button"
            accessibilityLabel={`${buyer.name} in ${buyer.location}, ${buyer.distanceKm} kilometres away. Tap to contact them.`}
            onPress={() => onPress(buyer)}
            style={({ pressed }) => [
              styles.row,
              index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
              pressed && styles.pressed,
            ]}>
            <Text style={styles.emoji}>{buyer.emoji}</Text>

            <View style={styles.rowText}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {buyer.name}
              </Text>
              <Text style={[styles.place, { color: colors.textSecondary }]} numberOfLines={1}>
                {`📍 ${buyer.location} · ${buyer.pickup}`}
              </Text>
            </View>

            <Text style={[styles.distance, { color: colors.primary }]} numberOfLines={1}>
              {`${buyer.distanceKm} km`}
            </Text>
          </Pressable>
        ))
      )}

      {buyers.length > 0 ? (
        <Text
          style={[
            styles.caption,
            { color: colors.textSecondary, borderTopColor: colors.border },
          ]}>
          {`Nearest is ${buyers[0].distanceKm} km away in ${buyers[0].location}. Distances are measured from the farm gate.`}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  emoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  place: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  distance: {
    ...AgriTypography.label,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  empty: {
    ...AgriTypography.caption,
    paddingVertical: Spacing.three,
    textAlign: 'center',
  },
  caption: {
    ...AgriTypography.caption,
    fontSize: 12,
    borderTopWidth: 1,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
});
