import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { DeliveryAddressForm } from '@/components/checkout/delivery-address-form';
import { DeliveryOptionRow } from '@/components/checkout/delivery-option-row';
import { OrderItemsCard } from '@/components/checkout/order-items-card';
import { OrderTotalsCard } from '@/components/checkout/order-totals-card';
import { MarketplaceHeaderBar } from '@/components/marketplace/marketplace-header-bar';
import { orderConfirmationHref } from '@/components/marketplace/routes';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCheckout } from '@/context/checkout-context';
import { useMarketplaceSaved } from '@/context/marketplace-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { cartSubtotal } from '@/models/marketplace-cart';
import { DEMO_MARKETPLACE_LISTINGS } from '@/models/marketplace';
import {
  buildOrderDraft,
  DEFAULT_DELIVERY_OPTION,
  DELIVERY_OPTIONS,
  EMPTY_DELIVERY_ADDRESS,
  orderLinesFrom,
  orderTotals,
  validateDeliveryAddress,
  type DeliveryAddress,
  type DeliveryOptionId,
} from '@/models/marketplace-delivery';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * 📦 Delivery Details: the last screen before an order exists.
 *
 * It holds the three things a farmer has to settle on the way to a receipt, in
 * the order they are asked about: what is coming, where it is going, and how
 * fast. The totals sit at the foot right above Place Order, so the number being
 * agreed to and the button that commits to it are what a thumb is looking at
 * together.
 *
 * Nothing is charged here, and nothing is asked for that could be used to charge
 * anyone. There is no card field, no UPI id and no bank detail anywhere in this
 * flow, because a demo order has nothing to pay. Place Order writes a record to
 * the device, empties the cart and moves to the receipt, which is the honest end
 * of what this screen can honestly do.
 *
 * The form starts from the last address the farmer saved, so a second order in
 * the same season is one tap from being placed rather than eight fields away.
 * Save Address remembers whatever is on screen without ordering anything.
 */
export default function DeliveryScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { address: savedAddress, saveAddress, placeOrder } = useCheckout();
  const { cart, cartItemCount: itemCount, clearCart } = useMarketplaceSaved();

  // The lazy initialiser reads the saved address once per mount, so the form
  // starts filled in without resetting anything the farmer then types.
  const [values, setValues] = useState<DeliveryAddress>(() => ({
    ...EMPTY_DELIVERY_ADDRESS,
    ...savedAddress,
  }));
  const [errors, setErrors] = useState<FieldErrors<DeliveryAddress>>({});
  const [deliveryOptionId, setDeliveryOptionId] = useState<DeliveryOptionId>(
    DEFAULT_DELIVERY_OPTION
  );
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // The same lines and the same total the cart screen draws, so what is promised
  // on the cart is exactly what is delivered — and what the order records.
  const lines = orderLinesFrom(cart, DEMO_MARKETPLACE_LISTINGS);
  const totals = orderTotals(cartSubtotal(cart, DEMO_MARKETPLACE_LISTINGS), deliveryOptionId);

  /** Updates one field and clears its error as soon as the farmer types. */
  function handleChange(field: keyof DeliveryAddress, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsAddressSaved(false);
  }

  /** Validates the form and, if it passes, remembers the address. */
  function handleSaveAddress() {
    const nextErrors = validateDeliveryAddress(values);

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setHasSubmitted(true);
      setIsAddressSaved(false);
      return;
    }

    saveAddress(trimAddress(values));
    setIsAddressSaved(true);
  }

  /**
   * Places the order: validates first, then records it and empties the cart.
   *
   * The cart is cleared only once the order exists, so a farmer who is stopped
   * by a validation error comes back to the same items they were looking at.
   */
  function handlePlaceOrder() {
    const nextErrors = validateDeliveryAddress(values);

    setErrors(nextErrors);
    setHasSubmitted(true);

    if (hasErrors(nextErrors) || lines.length === 0) {
      return;
    }

    const address = trimAddress(values);
    const draft = buildOrderDraft(cart, DEMO_MARKETPLACE_LISTINGS, address, deliveryOptionId);
    const order = placeOrder(draft);

    saveAddress(address);
    clearCart();

    // Replaced rather than pushed, so a back gesture from the receipt does not
    // return to a delivery form for a cart that no longer has anything in it.
    router.replace(orderConfirmationHref(order.id));
  }

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <MarketplaceHeaderBar
              title="Delivery Details"
              subtitle={buildSubtitle(itemCount)}
              onBack={() => router.back()}
              testID="delivery-header"
            />
          </View>
        </View>

        <ScrollView
          testID="delivery-screen"
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            {lines.length === 0 ? (
              <SectionCard title="Nothing to deliver yet" testID="delivery-cart-empty">
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  Your cart is empty, so there is nothing to deliver. Add a listing from the
                  Marketplace and come back here to finish the order.
                </Text>

                <View style={styles.emptyAction}>
                  <Button
                    label="Browse the Marketplace"
                    onPress={() => router.replace('/(tabs)/marketplace')}
                    testID="delivery-empty-marketplace"
                  />
                </View>
              </SectionCard>
            ) : (
              <>
                <OrderItemsCard lines={lines} itemsTotal={totals.itemsTotal} />

                <DeliveryAddressForm
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                  onSave={handleSaveAddress}
                  isSaved={isAddressSaved}
                  showErrorSummary={hasSubmitted && hasErrors(errors)}
                />

                <SectionCard
                  title={'\u{1F69A} Delivery Options'}
                  subtitle="Choose how fast this should reach you"
                  testID="delivery-options-card">
                  <View style={styles.options}>
                    {DELIVERY_OPTIONS.map((option) => (
                      <DeliveryOptionRow
                        key={option.id}
                        option={option}
                        isSelected={option.id === deliveryOptionId}
                        onSelect={(chosen) => setDeliveryOptionId(chosen.id)}
                      />
                    ))}
                  </View>
                </SectionCard>

                <OrderTotalsCard
                  itemsTotal={totals.itemsTotal}
                  deliveryOptionId={deliveryOptionId}
                />

                <Button
                  label="\u{1F4E6}  Place Order"
                  onPress={handlePlaceOrder}
                  testID="delivery-place-order"
                />

                <Text style={[styles.note, { color: colors.textSecondary }]}>
                  This is a demo checkout. No payment is taken, and no card, UPI or bank detail
                  is asked for or stored — the order is saved on this device only.
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}

/** "Nothing in the cart" or "3 items ready to send", so the count is never bare. */
function buildSubtitle(count: number): string {
  if (count === 0) {
    return 'Nothing in the cart';
  }

  return count === 1 ? '1 item ready to send' : `${count} items ready to send`;
}

/** Trims every field, so a saved address has no leading or trailing spaces. */
function trimAddress(values: DeliveryAddress): DeliveryAddress {
  return {
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    houseNumber: values.houseNumber.trim(),
    street: values.street.trim(),
    city: values.city.trim(),
    district: values.district.trim(),
    state: values.state.trim(),
    pinCode: values.pinCode.trim(),
  };
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
  options: {
    gap: Spacing.two,
  },
  emptyBody: {
    ...AgriTypography.body,
  },
  emptyAction: {
    marginTop: Spacing.three,
  },
  note: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
});
