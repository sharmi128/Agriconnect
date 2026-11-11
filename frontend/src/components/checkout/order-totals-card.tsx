import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatMarketplaceAmount } from '@/models/marketplace-cart';
import {
  deliveryChargeLabel,
  deliveryEstimateLabel,
  deliveryOptionById,
  type DeliveryOptionId,
} from '@/models/marketplace-delivery';

type OrderTotalsCardProps = {
  itemsTotal: number;
  deliveryOptionId: DeliveryOptionId;
  /** Defaults to the standard charge, so the card is usable on its own. */
  deliveryCharge?: number;
  testID?: string;
};

/**
 * 🧮 The three numbers a farmer has to agree to before an order is placed: the
 * items, the delivery, and what it comes to in total.
 *
 * The delivery charge is worked out from the chosen option rather than passed
 * in, so the figure on the option and the figure in the sum cannot drift apart.
 * A `deliveryCharge` is still accepted, because an order that has already been
 * placed must show the charge it was actually charged.
 *
 * The grand total sits in the pale green wash and at the size of a page title,
 * because that is the one number being decided on. Everything above it is
 * working out.
 */
export function OrderTotalsCard({
  itemsTotal,
  deliveryOptionId,
  deliveryCharge,
  testID,
}: OrderTotalsCardProps) {
  const colors = useAgriTheme();
  const option = deliveryOptionById(deliveryOptionId);
  const charge = deliveryCharge ?? option.charge;
  const grandTotal = Math.max(0, itemsTotal) + charge;

  return (
    <SectionCard
      title={'\u{1F9EE} Order Summary'}
      subtitle="What you will pay when the order is confirmed"
      testID={testID ?? 'checkout-order-totals'}>
      <TotalRow label="Items total" value={formatMarketplaceAmount(itemsTotal)} />

      <TotalRow
        label={`Delivery charge · ${deliveryEstimateLabel(option)}`}
        value={deliveryChargeLabel(charge)}
      />

      <View style={[styles.grandRow, { backgroundColor: colors.primarySoft }]}>
        <Text style={[styles.grandLabel, { color: colors.primaryDark }]}>Grand Total</Text>
        <Text style={[styles.grandValue, { color: colors.primaryDark }]}>
          {formatMarketplaceAmount(grandTotal)}
        </Text>
      </View>
    </SectionCard>
  );
}

/** One line of the sum: a label on the left, the figure on the right. */
function TotalRow({ label, value }: { label: string; value: string }) {
  const colors = useAgriTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  label: {
    ...AgriTypography.body,
    flexShrink: 1,
  },
  value: {
    ...AgriTypography.body,
    fontWeight: '700',
  },
  grandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
  },
  grandLabel: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  grandValue: {
    ...AgriTypography.title,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
});
