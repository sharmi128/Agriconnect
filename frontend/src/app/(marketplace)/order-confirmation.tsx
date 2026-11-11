import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { DeliveryAddressCard } from '@/components/checkout/delivery-address-card';
import { OrderPlacedHero } from '@/components/checkout/order-placed-hero';
import { EmptyState } from '@/components/marketplace/empty-state';
import { orderHref } from '@/components/marketplace/routes';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCheckout } from '@/context/checkout-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatMarketplaceAmount } from '@/models/marketplace-cart';
import {
  deliveryEstimateLabel,
  deliveryOptionById,
  orderHeadline,
  placedOrderDeliveryLabel,
  type PlacedOrder,
} from '@/models/marketplace-delivery';

/**
 * ✅ The receipt: what was ordered, where it is going, and when it should land.
 *
 * This screen is reached by replacing the delivery form, so there is no back
 * arrow and nothing to go back to — the cart is empty now and the form that
 * filled it has done its job. The two buttons are the only way off the page, and
 * they are the two things a farmer would do next: read the order in full, or go
 * back to shopping.
 *
 * Everything here is read back from the placed order rather than from the cart
 * or the live listings, so the receipt says what was agreed to rather than what
 * the demo data happens to say now. The order id is the reason for that: it is
 * the one handle a farmer has on a delivery that has not arrived yet.
 *
 * This is not a payment receipt. No money moved, so no money is claimed, and the
 * note at the foot says so plainly.
 */
export default function OrderConfirmationScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { orderById } = useCheckout();
  const params = useLocalSearchParams<{ id?: string }>();
  const order = params.id ? orderById(params.id) : null;

  return (
    <PaddyBackground intensity="page">
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
          <View style={styles.inner}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              {'\u{1F33E} AgriConnect Marketplace'}
            </Text>
          </View>
        </View>

        <ScrollView
          testID="order-confirmation-screen"
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + Spacing.five },
          ]}>
          <View style={styles.inner}>
            {order ? <Confirmation order={order} /> : <MissingOrder />}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}

/** Everything on the page once the order has been found. */
function Confirmation({ order }: { order: PlacedOrder }) {
  const colors = useAgriTheme();
  const option = deliveryOptionById(order.deliveryOptionId);

  return (
    <>
      <OrderPlacedHero orderId={order.id} headline={orderHeadline(order)} />

      <SectionCard
        title={'\u{1F4E5} Order Details'}
        subtitle="What you ordered, and when it should arrive"
        testID="order-confirmation-details">
        <DetailRow
          label="Products"
          value={order.lines.map((line) => line.name).join(', ')}
        />

        <DetailRow label="Delivery" value={option.title} />

        <DetailRow
          label="Estimated delivery"
          value={placedOrderDeliveryLabel(order)}
          testID="order-confirmation-eta"
        />

        <DetailRow label="Takes" value={deliveryEstimateLabel(option)} />

        <DetailRow
          label="Total amount"
          value={formatMarketplaceAmount(order.grandTotal)}
          emphasis
          testID="order-confirmation-total"
        />
      </SectionCard>

      <DeliveryAddressCard address={order.address} testID="order-confirmation-address" />

      <View style={styles.actions}>
        <Button
          label={'\u{1F4CB}  View Order'}
          onPress={() => router.push(orderHref(order.id))}
          testID="order-confirmation-view-order"
        />

        <Button
          label={'\u{1F6D2}  Continue Shopping'}
          variant="secondary"
          onPress={() => router.replace('/(tabs)/marketplace')}
          testID="order-confirmation-continue"
        />
      </View>

      <Text style={[styles.note, { color: colors.textSecondary }]}>
        Demo order saved on this device. No payment was taken, and no card, UPI or bank
        detail was asked for.
      </Text>
    </>
  );
}

/** One line of the summary: a label on the left, the answer on the right. */
function DetailRow({
  label,
  value,
  emphasis = false,
  testID,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  testID?: string;
}) {
  const colors = useAgriTheme();

  return (
    <View style={styles.detailRow} testID={testID}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text
        style={[
          emphasis ? styles.detailValueLarge : styles.detailValue,
          { color: colors.text },
        ]}>
        {value}
      </Text>
    </View>
  );
}

/** Shown when the order id in the URL is not one this device knows. */
function MissingOrder() {
  const colors = useAgriTheme();

  return (
    <View style={styles.missing}>
      <EmptyState
        emoji={'\u{1F4CE}\uFE0F'}
        title="Order not found"
        body="This order is not saved on this device any more. Place a new order from the Marketplace and the receipt will appear here."
        actionLabel="Browse the Marketplace"
        onAction={() => router.replace('/(tabs)/marketplace')}
        testID="order-confirmation-missing"
      />

      <Text style={[styles.missingNote, { color: colors.textSecondary }]}>
        Orders are kept on the device they were placed on, so clearing this app&apos;s data
        removes them.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  eyebrow: {
    ...AgriTypography.label,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  detailLabel: {
    ...AgriTypography.body,
  },
  detailValue: {
    ...AgriTypography.body,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  detailValueLarge: {
    ...AgriTypography.subtitle,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'right',
  },
  actions: {
    gap: Spacing.two,
  },
  note: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
  missing: {
    gap: Spacing.three,
  },
  missingNote: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
});
