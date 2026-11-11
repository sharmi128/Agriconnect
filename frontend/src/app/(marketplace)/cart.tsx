import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { Button } from '@/components/ui/button';
import { CartRow } from '@/components/marketplace/cart-row';
import { EmptyState } from '@/components/marketplace/empty-state';
import { MarketplaceHeaderBar } from '@/components/marketplace/marketplace-header-bar';
import { deliveryHref } from '@/components/marketplace/routes';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMarketplaceSaved } from '@/context/marketplace-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  cartSubtotal,
  formatMarketplaceAmount,
} from '@/models/marketplace-cart';
import { DEMO_MARKETPLACE_LISTINGS } from '@/models/marketplace';

/**
 * 🛒 The farmer's cart: a quantity on each listing and a total at the foot.
 *
 * Proceed to Delivery hands the cart to the delivery page, which is where an
 * address, a delivery speed and Place Order live. Nothing is charged along the
 * way: this is still a demo flow, and the note under the button says so rather
 * than leaving a farmer to wonder whether a payment screen is coming.
 *
 * The total is read from the live listings rather than from what was in the cart
 * when it was added, so a line can never show yesterday's price. Rented things
 * are totalled the same way, and the per-day or per-month period is said out
 * loud under the total, because a sum of mixed daily and monthly hire rates is a
 * number a farmer needs qualified before it means anything.
 */
export default function CartScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { cart, cartLines, cartItemCount: itemCount, setCartQuantity, removeFromCart } =
    useMarketplaceSaved();
  const subtotal = cartSubtotal(cart, DEMO_MARKETPLACE_LISTINGS);
  const hasRented = cartLines.some(({ listing }) =>
    ['land', 'machinery'].includes(listing.category)
  );

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <MarketplaceHeaderBar
              title="Cart"
              subtitle={buildSubtitle(itemCount)}
              onBack={() => router.back()}
              testID="marketplace-cart-header"
            />
          </View>
        </View>

        <ScrollView

          testID="marketplace-cart-screen"
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {cartLines.length === 0 ? (
              <EmptyState
                emoji={'\u{1F6D2}'}
                title="Your cart is empty"
                body="Add a listing from any card, and it will wait here while you keep looking. Nothing is charged."
                actionLabel="Browse the Marketplace"
                onAction={() => router.replace('/(tabs)/marketplace')}
                testID="marketplace-cart-empty"
              />
            ) : (
              <>
                {cartLines.map(({ listing, line }) => (
                  <CartRow
                    key={listing.id}
                    listing={listing}
                    quantity={line.quantity}
                    onChangeQuantity={setCartQuantity}
                    onRemove={removeFromCart}
                  />
                ))}

                <View
                  style={[
                    styles.summary,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                      Items
                    </Text>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>
                      {itemCount}
                    </Text>
                  </View>

                  <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

                  <View style={styles.summaryRow}>
                    <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                    <Text style={[styles.totalValue, { color: colors.text }]}>{`${formatMarketplaceAmount(
                      subtotal
                    )}${hasRented ? '+' : ''}`}</Text>
                  </View>

                  {hasRented ? (
                    <Text style={[styles.periodNote, { color: colors.textSecondary }]}>
                      Rented land and machinery are priced per day or per month, so this is
                      the total for one unit of each. Check each line before you ask about
                      it.
                    </Text>
                  ) : null}
                </View>

                <Button
                  label={'\u{1F4E6}  Proceed to Delivery'}
                  onPress={() => router.push(deliveryHref())}
                  testID="marketplace-cart-continue"
                />

                <Text style={[styles.note, { color: colors.textSecondary }]}>
                  This is a demo checkout. No payment is taken and no card, UPI or bank detail
                  is asked for — delivery details are the last step, and the order is saved on
                  your device.
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}

/** "Nothing in the cart" or "3 items in the cart", so the count is never bare. */

function buildSubtitle(count: number): string {
  if (count === 0) {
    return 'Nothing in the cart';
  }

  return count === 1 ? '1 item in the cart' : `${count} items in the cart`;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  summary: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: Spacing.two,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  summaryLabel: {
    ...AgriTypography.body,
    fontWeight: '400',
  },
  summaryValue: {
    ...AgriTypography.body,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
  },
  totalLabel: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  totalValue: {
    ...AgriTypography.title,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
  },
  periodNote: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  note: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
});
