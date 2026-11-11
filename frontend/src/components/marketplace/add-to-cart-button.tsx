import { Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useMarketplaceSaved } from '@/context/marketplace-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { MAX_CART_QUANTITY } from '@/models/marketplace-cart';

type AddToCartButtonProps = {
  listingId: string;
  /** `compact` fits on a card next to View Details, `full` is a details-page row. */
  variant?: 'compact' | 'full';
  testID?: string;
};

/**
 * Adds a listing to the cart, and says so once it is there.
 *
 * Tapping again raises the quantity rather than adding a second line, so a
 * farmer who taps twice gets "2" and not two identical rows. Once the line
 * reaches the cap the button stops saying it can add more, which keeps the
 * number on the cart badge from quietly turning into a bulk order.
 *
 * The label is the feedback: a listing that is in the cart says "In cart · 2"
 * rather than anything transient, so the state is still readable a moment later
 * without a toast over the card.
 */
export function AddToCartButton({
  listingId,
  variant = 'compact',
  testID,
}: AddToCartButtonProps) {
  const colors = useAgriTheme();
  const { addToCart, cartQuantityOf } = useMarketplaceSaved();
  const quantity = cartQuantityOf(listingId);
  const isInCart = quantity > 0;
  const isFull = quantity >= MAX_CART_QUANTITY;
  const isFullVariant = variant === 'full';

  function onPress(event: GestureResponderEvent) {
    // The card itself is also a button, so the tap is stopped here to keep
    // adding a listing from opening its details page.
    event.stopPropagation();

    if (!isFull) {
      addToCart(listingId);
    }
  }

  const backgroundColor = isInCart ? colors.primarySoft : 'transparent';
  const textColor = isInCart ? colors.primaryDark : colors.primary;
  const borderColor = isInCart ? colors.primary : colors.borderStrong;

  return (
    <Pressable
      testID={testID ?? `marketplace-add-to-cart-${listingId}`}
      accessibilityRole="button"
      accessibilityLabel={
        isFull
          ? `Cart limit reached for ${quantity}`
          : isInCart
            ? `Add another, ${quantity} in cart`
            : 'Add to cart'
      }
      accessibilityState={{ disabled: isFull }}
      disabled={isFull}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isFullVariant ? styles.full : styles.compact,
        { backgroundColor, borderColor },
        pressed && !isFull && styles.pressed,
        isFull && styles.inactive,
      ]}>
      <Text style={[isFullVariant ? styles.labelFull : styles.labelCompact, { color: textColor }]}>
        {isFull ? 'Cart limit reached' : isInCart ? `In cart \u00B7 ${quantity}` : 'Add to cart'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
  },
  compact: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
  },
  full: {
    minHeight: 52,
    paddingHorizontal: Spacing.four,
  },
  labelCompact: {
    ...AgriTypography.label,
    fontSize: 13,
  },
  labelFull: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  inactive: {
    opacity: 0.5,
  },
});
