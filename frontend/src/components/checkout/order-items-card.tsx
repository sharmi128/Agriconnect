import { StyleSheet, Text, View } from 'react-native';

import { ListingImage } from '@/components/marketplace/listing-image';
import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatMarketplaceAmount, pricePeriod } from '@/models/marketplace-cart';
import type { OrderLine } from '@/models/marketplace-delivery';

type OrderItemsCardProps = {
  lines: OrderLine[];
  /** The items total, drawn at the foot of the card under a hairline. */
  itemsTotal: number;
  testID?: string;
};

/**
 * 📦 What is being sent: the listing, how many, what each one is, and what the
 * lot comes to.
 *
 * The same card is used on the delivery page and on the order the farmer opens
 * afterwards, because both are answering the same question — what did I just
 * order — and a farmer should not have to learn two different layouts to read
 * either one.
 *
 * Each line carries its own image, its own unit price and its own total, rather
 * than one lump sum for the order. That is what makes a rent-a-tractor line
 * ("₹1,800 / day") readable next to a bag of seed, and it is the only way a
 * farmer can check one line against the card they added from.
 */
export function OrderItemsCard({ lines, itemsTotal, testID }: OrderItemsCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title={'\u{1F4E6} Order Summary'}
      subtitle="What is coming to your address"
      testID={testID ?? 'checkout-order-summary'}>
      {lines.map((line, index) => (
        <View
          key={line.listingId || `line-${index}`}
          style={[
            styles.line,
            // Only the rows below the first are separated, so a single-item
            // order is not wrapped in a divider on both sides.
            index === 0 ? styles.firstLine : { borderTopColor: colors.border },
          ]}>
          <View style={styles.thumbnail}>
            <ListingImage image={line.image} tone={line.tone} height={72} />
          </View>

          <View style={styles.body}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
              {line.name}
            </Text>

            <Text style={[styles.unitPrice, { color: colors.textSecondary }]} numberOfLines={1}>
              {`${line.unitPrice} each`}
            </Text>

            <Text style={[styles.quantity, { color: colors.textSecondary }]}>
              {`Quantity: ${line.quantity}`}
            </Text>
          </View>

          <Text style={[styles.lineTotal, { color: colors.text }]} numberOfLines={1}>
            {lineTotalLabel(line)}
          </Text>
        </View>
      ))}

      <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total amount</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          {formatMarketplaceAmount(itemsTotal)}
        </Text>
      </View>
    </SectionCard>
  );
}

/** A line total, with the hire period repeated when the price has one. */
function lineTotalLabel(line: OrderLine): string {
  const period = pricePeriod(line.unitPrice);

  return period
    ? `${formatMarketplaceAmount(line.lineTotal)} ${period}`
    : formatMarketplaceAmount(line.lineTotal);
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
  },
  firstLine: {
    borderTopWidth: 0,
  },
  thumbnail: {
    width: 72,
    borderRadius: 12,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...AgriTypography.subtitle,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  unitPrice: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '400',
  },
  quantity: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  lineTotal: {
    ...AgriTypography.subtitle,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    marginTop: Spacing.two,
    borderTopWidth: 1,
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
});
