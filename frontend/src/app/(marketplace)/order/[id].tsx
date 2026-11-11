import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { DeliveryAddressCard } from '@/components/checkout/delivery-address-card';
import { OrderItemsCard } from '@/components/checkout/order-items-card';
import { OrderTotalsCard } from '@/components/checkout/order-totals-card';
import { EmptyState } from '@/components/marketplace/empty-state';
import { cartHref } from '@/components/marketplace/routes';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCheckout } from '@/context/checkout-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  deliveryEstimateLabel,
  deliveryOptionById,
  placedOrderDeliveryLabel,
  placedOrderPlacedLabel,
  type PlacedOrder,
} from '@/models/marketplace-delivery';

/**
 * 📋 View Order: the full breakdown behind the receipt.
 *
 * The confirmation screen answers "did it go through?" in a few lines. This one
 * answers the question that comes next — "what exactly did I order, for how
 * much, and where is it going?" — with the same items and totals cards the
 * delivery page used, so the numbers here can be checked line by line against
 * the ones that were agreed to.
 *
 * Every figure comes from the placed order, which keeps a copy of the listing
 * name, quantity and price as they were when it was placed. A listing whose demo
 * data is edited later cannot quietly change what this page says was ordered.
 */
export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const { orderById } = useCheckout();
  const params = useLocalSearchParams<{ id?: string }>();
  const order = params.id ? orderById(params.id) : null;

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <OrderTitle order={order} />
          </View>
        </View>

        <ScrollView
          testID="order-screen"
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}>
          <View style={styles.inner}>
            {order ? <OrderBody order={order} /> : <MissingOrder />}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}

/**
 * The header: the back arrow, the order id, and when it was placed.
 *
 * The id sits where the screen title normally sits, because on this page the id
 * *is* the identity — there is no name, and an order a farmer cannot quote is an
 * order they will ring the seller about twice.
 */
function OrderTitle({ order }: { order: PlacedOrder | null }) {
  return (
    <AuthHeader
      title={order ? order.id : 'View Order'}
      subtitle={order ? placedOrderPlacedLabel(order) : undefined}
      onBack={() => router.back()}
    />
  );
}

/** The breakdown itself, once the order has been found. */
function OrderBody({ order }: { order: PlacedOrder }) {
  const colors = useAgriTheme();
  const option = deliveryOptionById(order.deliveryOptionId);

  return (
    <>
      <SectionCard
        title={'\u{1F4CC} Delivery Status'}
        subtitle="Where this order is in the journey"
        testID="order-status-card">
        <StatusStep
          emoji={'\u2705'}
          title="Order placed"
          detail={placedOrderPlacedLabel(order)}
          isDone
        />

        <StatusStep
          emoji={option.emoji}
          title={option.title}
          detail={`${deliveryEstimateLabel(option)} · arrives by ${placedOrderDeliveryLabel(order)}`}
        />
      </SectionCard>

      <OrderItemsCard
        lines={order.lines}
        itemsTotal={order.itemsTotal}
        testID="order-items-card"
      />

      <DeliveryAddressCard address={order.address} testID="order-address-card" />

      <OrderTotalsCard
        itemsTotal={order.itemsTotal}
        deliveryOptionId={order.deliveryOptionId}
        deliveryCharge={order.deliveryCharge}
        testID="order-totals-card"
      />

      <Button
        label={'\u{1F6D2}  Continue Shopping'}
        onPress={() => router.replace('/(tabs)/marketplace')}
        testID="order-continue"
      />

      <Text style={[styles.note, { color: colors.textSecondary }]}>
        This is a demo order kept on this device. Nothing was paid for it, and no card, UPI
        or bank detail was asked for.
      </Text>
    </>
  );
}

/** One line of the journey: a tile, what happened, and when. */
function StatusStep({
  emoji,
  title,
  detail,
  isDone = false,
}: {
  emoji: string;
  title: string;
  detail: string;
  isDone?: boolean;
}) {
  const colors = useAgriTheme();

  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepTile,
          { backgroundColor: isDone ? colors.primarySoft : colors.surfaceMuted },
        ]}>
        <Text style={styles.stepEmoji}>{emoji}</Text>
      </View>

      <View style={styles.stepBody}>
        <Text style={[styles.stepTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.stepDetail, { color: colors.textSecondary }]}>{detail}</Text>
      </View>
    </View>
  );
}

/** Shown when the order id in the URL is not one this device knows. */
function MissingOrder() {
  return (
    <View style={styles.missing}>
      <EmptyState
        emoji={'\u{1F4CE}\uFE0F'}
        title="Order not found"
        body="This order is not saved on this device any more, so its details cannot be shown. Place a new order from the Marketplace."
        actionLabel="Back to the Cart"
        onAction={() => router.replace(cartHref())}
        testID="order-missing"
      />
    </View>
  );
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
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  stepTile: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  stepEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  stepBody: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    ...AgriTypography.subtitle,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  stepDetail: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '400',
  },
  note: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
  missing: {
    paddingTop: Spacing.four,
  },
});
