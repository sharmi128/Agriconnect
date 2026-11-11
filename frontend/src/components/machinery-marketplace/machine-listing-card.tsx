import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import type { AgriPalette } from '@/constants/agri-theme';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { ListingTone } from '@/models/marketplace';
import {
  machineDistanceLabel,
  ownerPhoneUrl,
  type MachineListing,
} from '@/models/machinery-marketplace';

type MachineListingCardProps = {
  listing: MachineListing;
};

/**
 * 🚜 One machine listed as available.
 *
 * Mirrors the marketplace listing card so both pages feel like the same
 * marketplace: a themed block stands in for a photo, with the offer badge on
 * it. Below it sit the facts a farmer compares machines by — how far, what
 * type, what it costs and whether it is free — and the 📞 row calls the owner
 * straight from the card, the same way the help contacts open the dialler.
 */
export function MachineListingCard({ listing }: MachineListingCardProps) {
  const colors = useAgriTheme();
  const tone = getToneColors(listing.tone, colors);

  return (
    <View
      testID={`machine-listing-${listing.id}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.image, { backgroundColor: tone.background }]}>
        <Text style={styles.imageEmoji}>{listing.emoji}</Text>

        <View style={[styles.badge, { backgroundColor: tone.background }]}>
          <Text style={[styles.badgeText, { color: tone.text }]} numberOfLines={1}>
            {listing.offer}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {listing.title}
        </Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationEmoji}>{'\u{1F4CD}'}</Text>
          <Text
            style={[styles.location, { color: colors.textSecondary }]}
            numberOfLines={1}>
            {`${listing.location} · ${machineDistanceLabel(listing.distanceKm)}`}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={[styles.detail, { borderTopColor: colors.border }]}>
            <Text style={styles.detailEmoji}>{'\u{1F527}'}</Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Machine type
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
              {listing.machineType}
            </Text>
          </View>

          <View
            style={[
              styles.detail,
              styles.detailDivider,
              { borderTopColor: colors.border, borderLeftColor: colors.border },
            ]}>
            <Text style={styles.detailEmoji}>{'\u{1F4C5}'}</Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Availability
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
              {listing.availability}
            </Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceEmoji}>{'\u{1F4B0}'}</Text>
          <Text style={[styles.price, { color: tone.text }]} numberOfLines={1}>
            {listing.price}
          </Text>
        </View>

        <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={2}>
          {listing.note}
        </Text>

        <Pressable
          testID={`contact-owner-${listing.id}`}
          accessibilityRole="link"
          accessibilityLabel={`Call ${listing.owner} at ${listing.phone}`}
          onPress={() => {
            Linking.openURL(ownerPhoneUrl(listing.phone)).catch(() => undefined);
          }}
          style={({ pressed }) => [
            styles.contact,
            { backgroundColor: colors.background, borderColor: colors.border },
            pressed && styles.contactPressed,
          ]}>
          <Text style={styles.contactEmoji}>{'\u{1F4DE}'}</Text>

          <View style={styles.contactCopy}>
            <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>
              Contact owner
            </Text>
            <Text style={[styles.contactValue, { color: colors.primary }]} numberOfLines={1}>
              {`${listing.owner} · ${listing.phone}`}
            </Text>
          </View>

          <Text style={[styles.chevron, { color: colors.primary }]}>{'\u203A'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Maps a listing tone to the card accent colours, the same way the marketplace does. */
function getToneColors(
  tone: ListingTone,
  colors: AgriPalette
): { background: string; text: string } {
  if (tone === 'gold') {
    return { background: colors.harvestSoft, text: colors.harvestDark };
  }
  if (tone === 'earth') {
    return { background: colors.earthSoft, text: colors.earth };
  }
  if (tone === 'blue') {
    return { background: colors.waterSoft, text: colors.water };
  }
  return { background: colors.primarySoft, text: colors.primaryDark };
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: {
    fontSize: 44,
    lineHeight: 56,
  },
  badge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: Spacing.three,
    gap: 6,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationEmoji: {
    fontSize: 12,
    lineHeight: 18,
  },
  location: {
    ...AgriTypography.caption,
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    marginTop: 4,
  },
  detail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
    borderTopWidth: 1,
  },
  detailDivider: {
    borderLeftWidth: 1,
    paddingLeft: Spacing.two,
  },
  detailEmoji: {
    fontSize: 13,
    lineHeight: 18,
  },
  detailLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  detailValue: {
    ...AgriTypography.label,
    fontSize: 14,
    flexShrink: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.one,
  },
  priceEmoji: {
    fontSize: 14,
    lineHeight: 20,
  },
  price: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  note: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    padding: Spacing.two,
    marginTop: Spacing.one,
  },
  contactPressed: {
    opacity: 0.7,
  },
  contactEmoji: {
    fontSize: 17,
    lineHeight: 22,
  },
  contactCopy: {
    flex: 1,
    gap: 1,
  },
  contactLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  contactValue: {
    ...AgriTypography.body,
    fontWeight: '600',
    flexShrink: 1,
  },
  chevron: {
    fontSize: 20,
    lineHeight: 24,
  },
});