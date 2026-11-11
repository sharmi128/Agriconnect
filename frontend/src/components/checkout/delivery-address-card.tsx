import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { DeliveryAddress } from '@/models/marketplace-delivery';

type DeliveryAddressCardProps = {
  address: DeliveryAddress;
  testID?: string;
};

/**
 * 📍 The address an order is going to, read back in full.
 *
 * Shown word for word as the farmer typed it, because this is the one thing on
 * a receipt worth checking carefully: a parcel that reaches a wrong village
 * because a street name was misread is the failure nobody forgives. The
 * house number leads, then the street, then the place and the PIN code, which
 * is the order a delivery agent reads them in.
 *
 * The phone number sits on its own line at the foot, because it is the number
 * the agent will call, and it is the field most often typed with a space or a
 * leading zero that a farmer would rather see than have quietly tidied away.
 */
export function DeliveryAddressCard({ address, testID }: DeliveryAddressCardProps) {
  const colors = useAgriTheme();
  const lines = [address.houseNumber, address.street, address.city, address.district, address.state]
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  return (
    <SectionCard
      title={'\u{1F4CD} Delivery Address'}
      subtitle="Where this order is going"
      testID={testID ?? 'checkout-delivery-address'}>
      <Text style={[styles.name, { color: colors.text }]}>{address.fullName}</Text>

      {lines.map((line, index) => (
        <Text
          key={`${line}-${index}`}
          style={[styles.line, { color: index === 0 ? colors.text : colors.textSecondary }]}>
          {line}
        </Text>
      ))}

      <Text style={[styles.pin, { color: colors.text }]}>
        {`PIN ${address.pinCode.trim()}`}
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.phoneRow}>
        <Text style={[styles.phoneLabel, { color: colors.textSecondary }]}>Phone</Text>
        <Text style={[styles.phone, { color: colors.text }]}>{address.phone.trim()}</Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  name: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  line: {
    ...AgriTypography.body,
  },
  pin: {
    ...AgriTypography.label,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.three,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  phoneLabel: {
    ...AgriTypography.body,
  },
  phone: {
    ...AgriTypography.body,
    fontWeight: '700',
  },
});
