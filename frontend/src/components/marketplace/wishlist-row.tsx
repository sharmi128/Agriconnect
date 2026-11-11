import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AddToCartButton } from '@/components/marketplace/add-to-cart-button';
import { ListingImage } from '@/components/marketplace/listing-image';
import { productHref } from '@/components/marketplace/routes';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useMarketplaceSaved } from '@/context/marketplace-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { listingOffer, type MarketplaceListing } from '@/models/marketplace';
import { listingImageKey } from '@/models/marketplace-images';

type WishlistRowProps = {
  listing: MarketplaceListing;
};

/**
 * One saved listing on the wishlist screen.
 *
 * A saved listing is a decision made earlier, so this row is built to be acted
 * on rather than read: the heart comes off it, it can go straight into the cart,
 * and the whole row opens the listing again. Nothing about a row is a dead end.
 *
 * The layout is a thumbnail beside the text rather than the full card, because a
 * wishlist is long and a farmer scans it for the one thing they came back for.
 */
export function WishlistRow({ listing }: WishlistRowProps) {
  const colors = useAgriTheme();
  const { toggleWishlist } = useMarketplaceSaved();
  const offer = listingOffer(listing);

  return (
    <View
      testID={`wishlist-row-${listing.id}`}
      style={[
        styles.row,
        AgriShadows.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${listing.title}`}
        onPress={() => router.push(productHref(listing.id))}
        style={({ pressed }) => [styles.thumbnail, pressed && styles.pressed]}>
        <ListingImage
          image={listingImageKey(listing.id)}
          tone={listing.tone}
          height={86}
          badge={offer ?? undefined}
        />
      </Pressable>

      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {listing.title}
        </Text>

        <View style={styles.locationRow}>
          <Text style={[styles.pin, { color: colors.primary }]}>{'\u{1F4CD}'}</Text>
          <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
            {listing.location}
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.text }]} numberOfLines={1}>
          {listing.price}
        </Text>

        <View style={styles.actions}>
          <View style={styles.addToCart}>
            <AddToCartButton listingId={listing.id} />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${listing.title} from wishlist`}
            onPress={() => toggleWishlist(listing.id)}
            style={({ pressed }) => [
              styles.remove,
              { borderColor: colors.borderStrong },
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.removeText, { color: colors.textSecondary }]}>
              {'\u{1F5D1}'} Remove
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  thumbnail: {
    width: 96,
    borderRadius: AgriRadius.medium,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...AgriTypography.subtitle,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
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
    fontWeight: '400',
    flexShrink: 1,
  },
  price: {
    ...AgriTypography.subtitle,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  addToCart: {
    flex: 1,
  },
  remove: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
  },
  removeText: {
    ...AgriTypography.label,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.7,
  },
});
