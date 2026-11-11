/**
 * Holds the delivery address and the placed demo orders for the whole app.
 *
 * The delivery form, the confirmation screen and the View Order screen are three
 * different routes that all need the same two things: the address the farmer
 * saved, and the order they just placed. React Context does that without any
 * extra package, and the provider lives in the root layout, so the confirmation
 * can read the order it was pushed with rather than passing it through the URL.
 *
 * Both survive an app restart. On start-up the provider reads the AsyncStorage
 * record the farmer's own taps wrote, and every change is written straight back.
 * That is still frontend-only: the record lives on the device and the Spring Boot
 * backend is not involved.
 *
 * Nothing here is a payment. Placing an order asks for an address and a
 * delivery speed, records it on the device and shows a receipt. No card, UPI id
 * or bank detail is requested, transmitted or stored, because there is nothing
 * to charge yet.
 *
 * When the backend is ready, replace the read below with a call to the API and
 * replace `saveAddress` and `placeOrder` with calls to it.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  buildPlacedOrder,
  buildDemoOrderId,
  EMPTY_DELIVERY_ADDRESS,
  type DeliveryAddress,
  type OrderDraft,
  type PlacedOrder,
} from '@/models/marketplace-delivery';
import {
  loadSavedCheckoutState,
  MAX_SAVED_ORDERS,
  saveSavedCheckoutState,
} from '@/services/checkout-storage';

type CheckoutContextValue = {
  /** The address the farmer last saved, so the form is not typed twice. */
  address: DeliveryAddress;
  /** Placed demo orders, newest first. */
  orders: PlacedOrder[];
  /** The most recent order, which is what the confirmation screen shows. */
  latestOrder: PlacedOrder | null;
  /** False until the saved state has been read back from the device. */
  isHydrated: boolean;
  /** Remembers an address so the next checkout starts filled in. */
  saveAddress: (address: DeliveryAddress) => void;
  /**
   * Stamps a draft with a demo id and a time, keeps it, and returns it so the
   * screen can navigate straight to the confirmation for that order.
   */
  placeOrder: (draft: OrderDraft) => PlacedOrder;
  /** One saved order by its id, for the View Order screen. */
  orderById: (id: string) => PlacedOrder | null;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<DeliveryAddress>({
    ...EMPTY_DELIVERY_ADDRESS,
  });
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read the saved record once on start-up. The effect is not allowed to set
  // state synchronously, so the load is wrapped in a promise and cancelled on
  // unmount. The empty state renders first and is filled in a moment later, which
  // happens behind the start-up splash.
  useEffect(() => {
    let isActive = true;

    loadSavedCheckoutState().then((saved) => {
      if (!isActive) return;

      setAddress(saved.address);
      setOrders(saved.orders);
      setIsHydrated(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  // Write the state back after every change, but not before the read has
  // finished: writing the empty state over the saved one during the first tick
  // would undo the address and the orders the farmer saved on a previous run.
  useEffect(() => {
    if (!isHydrated) return;

    void saveSavedCheckoutState({ address, orders });
  }, [address, orders, isHydrated]);

  const saveAddress = useCallback((nextAddress: DeliveryAddress) => {
    setAddress(nextAddress);
  }, []);

  const placeOrder = useCallback((draft: OrderDraft) => {
    // The id is drawn per order rather than per session, so two orders placed
    // minutes apart do not end up with the same number. It is demo data either
    // way: no courier or seller ever sees it.
    const order = buildPlacedOrder(draft, new Date(), buildDemoOrderId());

    setOrders((current) => [order, ...current].slice(0, MAX_SAVED_ORDERS));

    // The address is remembered as well, because the address a farmer just
    // delivered to is nearly always the one they will want next time.
    setAddress(draft.address);

    return order;
  }, []);

  const orderById = useCallback(
    (id: string) => orders.find((order) => order.id === id) ?? null,
    [orders]
  );

  const latestOrder = useMemo(() => orders[0] ?? null, [orders]);

  const value = useMemo(
    () => ({
      address,
      orders,
      latestOrder,
      isHydrated,
      saveAddress,
      placeOrder,
      orderById,
    }),
    [address, orders, latestOrder, isHydrated, saveAddress, placeOrder, orderById]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

/** Reads the shared address and placed orders. Throws if used outside the provider. */
export function useCheckout(): CheckoutContextValue {
  const value = useContext(CheckoutContext);

  if (!value) {
    throw new Error('useCheckout must be used inside a <CheckoutProvider />.');
  }

  return value;
}
