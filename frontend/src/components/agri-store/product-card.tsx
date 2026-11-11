import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import type { AgriPalette } from '@/constants/agri-theme';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  PRODUCT_CATEGORY_LABELS,
  sellerPhoneUrl,
  type AgriProduct,
} from '@/models/agri-store';
import type { ListingTone } from '@/models/marketplace';

type ProductCardProps = {
  product: AgriProduct;
  /** How many of this product are already in the local cart. */
  cartCount: number;
  onAddToCart: () => void;
};

/**
 * 🛒 One product in the Agri Store.
 *
 * Mirrors the marketplace listing card so the whole store feels like the same
 * marketplace: a themed block stands in for a photo, with the stock tag on it.
 * Below sit the details the farmer compares — pack size, price and one line
 * about the product — alongside a 📞 row that calls the seller straight from
 * the card. The 🛒 button adds the product to a cart that lives on the screen
 * only; nothing is sent anywhere yet.
 */
export function ProductCard({ product, cartCount, onAddToCart }: ProductCardProps) {
  const colors = useAgriTheme();
  const tone = getToneColors(product.tone, colors);

  return (
    <View
      testID={`product-${product.id}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.image, { backgroundColor: tone.background }]}>
        <Text style={styles.imageEmoji}>{product.emoji}</Text>

        <View style={[styles.badge, { backgroundColor: tone.background }]}>
          <Text style={[styles.badgeText, { color: tone.text }]} numberOfLines={1}>
            {product.tag}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaEmoji}>{'\u{1F4E6}'}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
            {`${product.packSize} · ${PRODUCT_CATEGORY_LABELS[product.category]}`}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceEmoji}>{'\u{1F4B0}'}</Text>
          <Text style={[styles.price, { color: tone.text }]} numberOfLines={1}>
            {product.price}
          </Text>
        </View>

        <Text style={[styles.detail, { color: colors.textSecondary }]} numberOfLines={2}>
          {product.detail}
        </Text>

        <Pressable
          testID={`contact-seller-${product.id}`}
          accessibilityRole="link"
          accessibilityLabel={`Call ${product.seller} at ${product.phone}`}
          onPress={() => {
            Linking.openURL(sellerPhoneUrl(product.phone)).catch(() => undefined);
          }}
          style={({ pressed }) => [
            styles.contact,
            { backgroundColor: colors.background, borderColor: colors.border },
            pressed && styles.contactPressed,
          ]}>
          <Text style={styles.contactEmoji}>{'\u{1F4DE}'}</Text>

          <View style={styles.contactCopy}>
            <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>
              Seller contact
            </Text>
            <Text style={[styles.contactValue, { color: colors.primary }]} numberOfLines={1}>
              {`${product.seller} · ${product.phone}`}
            </Text>
          </View>

          <Text style={[styles.chevron, { color: colors.primary }]}>{'\u203A'}</Text>
        </Pressable>

        <Button
          label={cartCount > 0 ? `In Cart · ${cartCount}` : 'Add to Cart'}
          variant={cartCount > 0 ? 'secondary' : 'primary'}
          onPress={onAddToCart}
          testID={`add-to-cart-${product.id}`}
        />
      </View>
    </View>
  );
}

/** Maps a product tone to the card accent colours, the same way the marketplace does. */
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
  name: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaEmoji: {
    fontSize: 12,
    lineHeight: 18,
  },
  meta: {
    ...AgriTypography.caption,
    flex: 1,
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
    fontSize: 17,
  },
  detail: {
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