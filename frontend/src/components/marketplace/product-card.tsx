import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AddToCartButton } from '@/components/marketplace/add-to-cart-button';
import { ListingImage } from '@/components/marketplace/listing-image';
import { productHref } from '@/components/marketplace/routes';
import { WishlistButton } from '@/components/marketplace/wishlist-button';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  listingBadge,
  listingFacts,
  listingOffer,
  type MarketplaceListing,
} from '@/models/marketplace';
import { listingImageKey } from '@/models/marketplace-images';

type ProductCardProps = {
  listing: MarketplaceListing;
};

/**
 * One listing on a category page: the image, the name, whether it is rent or
 * buy, where it is, what it costs, and a button that opens the details.
 *
 * The card is one tap deep. Everything a farmer scans for while comparing
 * several listings — the name, the place, the price, the one line about it — is
 * on the card itself, so the only reason to go further is to decide.
 *
 * Rent and buy land and machinery is shown as a chip in the image corner and as
 * a word beside the price, because it changes what the price means. Everything
 * sold in a bag or a box has no offer, so those cards show the stock tag and
 * the pack size in the same slots rather than leaving a gap.
 *
 * The heart and the cart sit on the card as well, because saving something and
 * asking about it are decisions a farmer makes while comparing, not after
 * opening a listing. They are separate tap targets inside the card, so tapping
 * one never opens the details page.
 */
export function ProductCard({ listing }: ProductCardProps) {
  const colors = useAgriTheme();
  const offer = listingOffer(listing);
  const facts = listingFacts(listing);

  return (
    <Pressable
      testID={`marketplace-product-${listing.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${listing.title}, ${listing.price}, ${listing.location}`}
      onPress={() => router.push(productHref(listing.id))}
      style={({ pressed }) => [
        styles.card,
        AgriShadows.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.image, { borderColor: colors.border }]}>
        <ListingImage
          image={listingImageKey(listing.id)}
          tone={listing.tone}
          height={124}
          badge={listingBadge(listing)}
        />

        {/* Top-right of the image, so the heart is where a farmer's thumb already is. */}
        <View style={styles.wishlist}>
          <WishlistButton listingId={listing.id} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {listing.title}
        </Text>

        <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={2}>
          {listing.note}
        </Text>

        <View style={styles.locationRow}>
          <Text style={[styles.pin, { color: colors.primary }]}>{'\u{1F4CD}'}</Text>
          <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
            {listing.location}
          </Text>
        </View>

        <View style={[styles.facts, { borderTopColor: colors.border }]}>
          <Text style={[styles.fact, { color: colors.textSecondary }]} numberOfLines={1}>
            {facts[0].value}
          </Text>
          <View style={[styles.factDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.fact, { color: colors.textSecondary }]} numberOfLines={1}>
            {facts[1].value}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text }]} numberOfLines={1}>
            {listing.price}
          </Text>

          <View
            style={[
              styles.offer,
              { backgroundColor: offer ? colors.primarySoft : colors.harvestSoft },
            ]}>
            <Text
              style={[
                styles.offerText,
                { color: offer ? colors.primaryDark : colors.harvestDark },
              ]}
              numberOfLines={1}>
              {offer ?? listingBadge(listing)}
            </Text>
          </View>
        </View>

        <View style={[styles.actions, { borderColor: colors.borderStrong }]}>
          <AddToCartButton listingId={listing.id} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View details for ${listing.title}`}
            onPress={() => router.push(productHref(listing.id))}
            style={({ pressed }) => [
              styles.viewAction,
              { borderColor: colors.borderStrong },
              pressed && styles.actionPressed,
            ]}>
            <Text style={[styles.viewActionText, { color: colors.primary }]}>View Details</Text>
            <Text style={[styles.viewActionArrow, { color: colors.primary }]}>{'\u2192'}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    borderBottomWidth: 1,
  },
  wishlist: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
  },
  body: {
    padding: Spacing.three,
    gap: 8,
  },
  name: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  note: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 19,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pin: {
    fontSize: 12,
    lineHeight: 18,
  },
  location: {
    ...AgriTypography.caption,
    fontSize: 12,
    flexShrink: 1,
  },
  facts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
  },
  fact: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  factDivider: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  price: {
    ...AgriTypography.subtitle,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    flexShrink: 1,
  },
  offer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  offerText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  /**
   * The last row: add it to the cart, or open the details. Both are their own
   * press targets inside the card, so a farmer can save a listing without
   * losing the category they are comparing in.
   */
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: 2,
  },
  viewAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: Spacing.two,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
  },
  viewActionText: {
    ...AgriTypography.label,
    fontSize: 13,
    fontWeight: '700',
  },
  viewActionArrow: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  actionPressed: {
    opacity: 0.7,
  },
});
