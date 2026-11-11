import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListingImage } from '@/components/marketplace/listing-image';
import { productHref } from '@/components/marketplace/routes';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  cartLineTotal,
  formatMarketplaceAmount,
  listingPricePeriod,
  MAX_CART_QUANTITY,
} from '@/models/marketplace-cart';
import type { MarketplaceListing } from '@/models/marketplace';
import { listingImageKey } from '@/models/marketplace-images';

type CartRowProps = {
  listing: MarketplaceListing;
  quantity: number;
  onChangeQuantity: (listingId: string, quantity: number) => void;
  onRemove: (listingId: string) => void;
};

/**
 * One line in the cart: the listing, how many, what that comes to, and the
 * three ways a farmer changes it.
 *
 * The quantity stepper is the reason a line carries a number at all. A cart of
 * one tractor is the same as a cart of six, so the number is what makes the
 * total mean something, and taking a line to zero removes it rather than
 * leaving a line at nothing.
 *
 * Rented things are totalled per day or per month, and the period is repeated
 * beside the line total, because "₹10,800" next to a per-day tractor is a
 * number a farmer cannot price on its own.
 */
export function CartRow({ listing, quantity, onChangeQuantity, onRemove }: CartRowProps) {
  const colors = useAgriTheme();
  const period = listingPricePeriod(listing);
  const lineTotal = cartLineTotal(listing, quantity);
  const isAtCap = quantity >= MAX_CART_QUANTITY;

  return (
    <View
      testID={`cart-row-${listing.id}`}
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
        <ListingImage image={listingImageKey(listing.id)} tone={listing.tone} height={86} />
      </Pressable>

      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {listing.title}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${listing.title} from cart`}
            hitSlop={8}
            onPress={() => onRemove(listing.id)}
            style={({ pressed }) => [styles.removeIcon, pressed && styles.pressed]}>
            <Text style={[styles.removeIconText, { color: colors.textSecondary }]}>
              {'\u{1F5D1}'}
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.unitPrice, { color: colors.textSecondary }]} numberOfLines={1}>
          {`${listing.price} each`}
        </Text>

        <View style={styles.footer}>
          <View
            style={[styles.stepper, { borderColor: colors.borderStrong }]}
            accessibilityLabel={`Quantity for ${listing.title}`}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
              hitSlop={6}
              onPress={() => onChangeQuantity(listing.id, quantity - 1)}
              style={({ pressed }) => [styles.step, pressed && styles.pressed]}>
              <Text style={[styles.stepText, { color: colors.primary }]}>
                {'\u2212'}
              </Text>
            </Pressable>

            <Text style={[styles.quantity, { color: colors.text }]}>{quantity}</Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
              accessibilityState={{ disabled: isAtCap }}
              hitSlop={6}
              disabled={isAtCap}
              onPress={() => onChangeQuantity(listing.id, quantity + 1)}
              style={({ pressed }) => [
                styles.step,
                isAtCap && styles.stepDisabled,
                pressed && !isAtCap && styles.pressed,
              ]}>
              <Text style={[styles.stepText, { color: colors.primary }]}>+</Text>
            </Pressable>
          </View>

          <Text style={[styles.lineTotal, { color: colors.text }]} numberOfLines={1}>
            {period
              ? `${formatMarketplaceAmount(lineTotal)} ${period}`
              : formatMarketplaceAmount(lineTotal)}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  name: {
    ...AgriTypography.subtitle,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    flexShrink: 1,
  },
  removeIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AgriRadius.pill,
  },
  removeIconText: {
    fontSize: 15,
    lineHeight: 20,
  },
  unitPrice: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
    overflow: 'hidden',
  },
  step: {
    width: 38,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: {
    opacity: 0.35,
  },
  stepText: {
    ...AgriTypography.subtitle,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  quantity: {
    ...AgriTypography.subtitle,
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  lineTotal: {
    ...AgriTypography.subtitle,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  pressed: {
    opacity: 0.7,
  },
});
