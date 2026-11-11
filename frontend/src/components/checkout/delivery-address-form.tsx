import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { TextField } from '@/components/ui/text-field';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { DeliveryAddress } from '@/models/marketplace-delivery';
import type { FieldErrors } from '@/utils/validation';

type DeliveryAddressFormProps = {
  values: DeliveryAddress;
  errors: FieldErrors<DeliveryAddress>;
  onChange: (field: keyof DeliveryAddress, value: string) => void;
  onSave: () => void;
  /** True once a save has succeeded, so the button and the note can say so. */
  isSaved: boolean;
  /** True after a failed Place Order, which asks the farmer to look here. */
  showErrorSummary: boolean;
  testID?: string;
};

/**
 * 📍 The eight fields a parcel needs to find a door, and a button to remember
 * them.
 *
 * The order of the fields is the order a delivery agent reads an address in:
 * who it is for, how to ring them, the door, the street, then the place down to
 * the PIN code.
 *
 * House and door number get their own field rather than sharing the street one,
 * because in a village the number is often the only part of the address written
 * down anywhere, and an agent looking for "the blue house" is really looking for
 * 12/4B. Street and village share a field for the same reason: many addresses
 * have one or the other, rarely both, and forcing a farmer to invent a street
 * name for a village that does not have one is how a wrong address gets typed.
 *
 * Save Address sits under the form rather than at the foot of the screen next
 * to Place Order, because the two are different decisions: saving keeps the
 * address for next time without ordering anything, and placing the order is the
 * only thing on the page that cannot be undone.
 */
export function DeliveryAddressForm({
  values,
  errors,
  onChange,
  onSave,
  isSaved,
  showErrorSummary,
  testID,
}: DeliveryAddressFormProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title={'\u{1F4CD} Delivery Address'}
      subtitle="Where the parcel should be delivered"
      testID={testID ?? 'delivery-address-card'}>
      {showErrorSummary ? (
        <Text style={[styles.errorSummary, { color: colors.danger }]}>
          Check the highlighted fields below before placing the order.
        </Text>
      ) : null}

      <View style={styles.fields}>
        <TextField
          label="Full Name"
          placeholder="e.g. Murugan Selvam"
          value={values.fullName}
          onChangeText={(value) => onChange('fullName', value)}
          error={errors.fullName}
          autoCapitalize="words"
          returnKeyType="next"
          testID="delivery-input-full-name"
        />

        <TextField
          label="Phone Number"
          placeholder="e.g. 9876543210"
          value={values.phone}
          onChangeText={(value) => onChange('phone', value)}
          error={errors.phone}
          keyboardType="phone-pad"
          returnKeyType="next"
          testID="delivery-input-phone"
        />

        <TextField
          label="House / Door Number"
          placeholder="e.g. 12 / 4B"
          value={values.houseNumber}
          onChangeText={(value) => onChange('houseNumber', value)}
          error={errors.houseNumber}
          returnKeyType="next"
          testID="delivery-input-house"
        />

        <TextField
          label="Street / Village"
          placeholder="e.g. Gandhi Street, Thovalai"
          value={values.street}
          onChangeText={(value) => onChange('street', value)}
          error={errors.street}
          autoCapitalize="words"
          returnKeyType="next"
          testID="delivery-input-street"
        />

        <TextField
          label="City / Town"
          placeholder="e.g. Nagercoil"
          value={values.city}
          onChangeText={(value) => onChange('city', value)}
          error={errors.city}
          autoCapitalize="words"
          returnKeyType="next"
          testID="delivery-input-city"
        />

        <TextField
          label="District"
          placeholder="e.g. Kanyakumari"
          value={values.district}
          onChangeText={(value) => onChange('district', value)}
          error={errors.district}
          autoCapitalize="words"
          returnKeyType="next"
          testID="delivery-input-district"
        />

        <TextField
          label="State"
          placeholder="e.g. Tamil Nadu"
          value={values.state}
          onChangeText={(value) => onChange('state', value)}
          error={errors.state}
          autoCapitalize="words"
          returnKeyType="next"
          testID="delivery-input-state"
        />

        <TextField
          label="PIN Code"
          placeholder="e.g. 629101"
          value={values.pinCode}
          onChangeText={(value) => onChange('pinCode', value)}
          error={errors.pinCode}
          keyboardType="number-pad"
          returnKeyType="done"
          testID="delivery-input-pin"
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.saveNote, { color: colors.textSecondary }]}>
          {isSaved
            ? 'Address saved on this device. It will be filled in next time.'
            : 'Saving keeps this address for your next order. Nothing is ordered yet.'}
        </Text>

        <Button
          label={isSaved ? '\u2713 Address Saved' : '\u{1F4E6} Save Address'}
          variant="secondary"
          onPress={onSave}
          testID="delivery-save-address"
        />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: Spacing.three,
  },
  errorSummary: {
    ...AgriTypography.caption,
    marginBottom: Spacing.three,
  },
  footer: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  saveNote: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
});
