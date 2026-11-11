import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { FilterTabs } from '@/components/agri-store/filter-tabs';
import { ProductCard } from '@/components/agri-store/product-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_AGRI_PRODUCTS,
  filterProducts,
  searchProducts,
  type ProductFilter,
} from '@/models/agri-store';

/**
 * 🛒 Agri Store, opened from the Agri Store card on the Home dashboard.
 *
 * Seeds, fertilizers and tools the farmer can buy, with the facts they compare
 * by — pack size, price and one line about the product — and a 📞 row that
 * calls the seller straight from the card.
 *
 * Search looks across the name, category, pack size, detail and seller, and the
 * All / Seeds / Fertilizers / Tools pills narrow the same list on top of it, so
 * the two always agree about how many products are shown.
 *
 * The 🛒 Add to Cart buttons push products into a cart that lives only on this
 * screen, so the farmer can try the flow before any real checkout exists. The
 * prices and phone numbers are local demo data, and nothing is sent anywhere.
 */
export default function AgriStoreScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ProductFilter>('all');
  const [cart, setCart] = useState<Record<string, number>>({});

  const searched = searchProducts(DEMO_AGRI_PRODUCTS, query);
  const visible = filterProducts(searched, filter);

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  /** Adds one more of a product to the cart. No persistence yet. */
  function handleAddToCart(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  }

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Agri Store"
              subtitle={`${DEMO_AGRI_PRODUCTS.length} products · ${visible.length} shown`}
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="agri-store-screen"
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder="Search seeds, fertilizers or tools"
              accessibilityLabel="Search agri store"
              testID="agri-store-search"
            />

            <FilterTabs value={filter} onChange={setFilter} />

            {cartCount > 0 ? (
              <View
                testID="cart-summary"
                style={[styles.cart, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}
                accessibilityLabel={`Cart with ${cartCount} items`}>
                <Text style={styles.cartEmoji}>{'\u{1F6D2}'}</Text>
                <Text style={[styles.cartText, { color: colors.primaryDark }]}>
                  {cartCount === 1 ? '1 item in your cart' : `${cartCount} items in your cart`}
                </Text>
                <Pressable
                  testID="clear-cart"
                  accessibilityRole="button"
                  accessibilityLabel="Clear cart"
                  hitSlop={8}
                  onPress={() => setCart({})}>
                  <Text style={[styles.cartClear, { color: colors.primary }]}>Clear</Text>
                </Pressable>
              </View>
            ) : null}

            {visible.length === 0 ? (
              <View style={[styles.empty, { borderColor: colors.border }]}>
                <Text style={styles.emptyEmoji}>{'\u{1F6D2}'}</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No products to show</Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  Try a different search, or switch the category filter.
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                  {visible.length === 1
                    ? '1 product'
                    : `${visible.length} products`}
                </Text>

                {visible.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartCount={cart[product.id] ?? 0}
                    onAddToCart={() => handleAddToCart(product.id)}
                  />
                ))}

                <Text style={[styles.demoNote, { color: colors.textSecondary }]}>
                  Products, prices and phone numbers are demo data for now. Your cart
                  stays on this screen only.
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  resultCount: {
    ...AgriTypography.caption,
  },
  cart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    padding: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  cartEmoji: {
    fontSize: 16,
    lineHeight: 22,
  },
  cartText: {
    ...AgriTypography.label,
    fontWeight: '600',
    flex: 1,
  },
  cartClear: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  emptyEmoji: {
    fontSize: 28,
    lineHeight: 36,
  },
  emptyTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  emptyBody: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
  demoNote: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
});