import { Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';

import { AgriRadius } from '@/constants/agri-theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { useMarketplaceSaved } from '@/context/marketplace-context';

type WishlistButtonProps = {
  listingId: string;
  /** `small` sits over a card image, `large` sits on the details page. */
  size?: 'small' | 'large';
  testID?: string;
};

/**
 * The heart that saves a listing, drawn as a filled heart once it is saved.
 *
 * It is the same button on a card and on the product details page, and both read
 * the same shared state, so a heart tapped on a category page is already filled
 * in when the details page opens behind it.
 *
 * Filled and outline are drawn as two characters rather than an icon font, which
 * is how the rest of the app draws its glyphs, and the state is also in the
 * accessibility label so a screen reader says which one a farmer is looking at.
 */
export function WishlistButton({
  listingId,
  size = 'small',
  testID,
}: WishlistButtonProps) {
  const colors = useAgriTheme();
  const { isWishlisted, toggleWishlist } = useMarketplaceSaved();
  const saved = isWishlisted(listingId);
  const isLarge = size === 'large';

  function onPress(event: GestureResponderEvent) {
    // The card itself is also a button, so the tap is stopped here to keep
    // saving a listing from opening its details page.
    event.stopPropagation();

    toggleWishlist(listingId);
  }

  return (
    <Pressable
      testID={testID ?? `marketplace-wishlist-${listingId}`}
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isLarge ? styles.large : styles.small,
        {
          backgroundColor: saved ? colors.primary : colors.surface,
          borderColor: saved ? colors.primary : colors.border,
        },
        pressed && styles.pressed,
      ]}>
      <Text
        style={[
          isLarge ? styles.heartLarge : styles.heartSmall,
          { color: saved ? colors.onPrimary : colors.primary },
        ]}>
        {saved ? '\u2764' : '\u2661'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  small: {
    width: 38,
    height: 38,
  },
  large: {
    width: 52,
    height: 52,
  },
  heartSmall: {
    fontSize: 19,
    lineHeight: 24,
  },
  heartLarge: {
    fontSize: 24,
    lineHeight: 30,
  },
  pressed: {
    opacity: 0.7,
  },
});
