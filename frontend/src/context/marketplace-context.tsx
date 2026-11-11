/**
 * Holds the farmer's wishlist and cart for the whole app.
 *
 * The same listing can be wished for, in the cart, and open on the details page
 * at once, so the state lives above the screens: the Marketplace tab, a category
 * page, the details page, the wishlist and the cart all read and write the same
 * two lists, and a heart tapped on a card is already filled in when the details
 * page opens. React Context does that without any extra package, and the
 * provider lives in the root layout, so a saved listing survives navigating
 * between screens and switching tabs.
 *
 * Both lists also survive an app restart. On start-up the provider reads the
 * AsyncStorage record the farmer's own taps wrote, and every change is written
 * straight back. That is still frontend-only: the record lives on the device and
 * the Spring Boot backend is not involved.
 *
 * When the backend is ready, replace the read below with a call to the API and
 * replace the `addToCart` and `toggleWishlist` writes with calls to it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DEMO_MARKETPLACE_LISTINGS,
  type MarketplaceListing,
} from '@/models/marketplace';
import {
  addCartLine,
  cartItemCount,
  cartQuantity,
  changeCartQuantity,
  isWishlisted,
  removeCartLine,
  resolveCartLines,
  resolveWishlist,
  toggleWishlisted,
  type CartLine,
  type ResolvedCartLine,
} from '@/models/marketplace-cart';
import {
  loadSavedMarketplaceState,
  saveSavedMarketplaceState,
} from '@/services/marketplace-storage';

type MarketplaceContextValue = {
  /** Listing ids on the wishlist, most recently saved first. */
  wishlist: string[];
  /** How many listings are saved, for the header badge. */
  wishlistCount: number;
  /** The saved listings, joined to the demo data and ready to draw. */
  wishlistListings: MarketplaceListing[];
  /** One line per listing in the cart, in the order it was added. */
  cart: CartLine[];
  /** How many things are in the cart across all lines, for the badge. */
  cartItemCount: number;
  /** The cart joined to its listings, ready to draw. */
  cartLines: ResolvedCartLine[];
  /** False until the saved state has been read back from the device. */
  isHydrated: boolean;
  isWishlisted: (listingId: string) => boolean;
  toggleWishlist: (listingId: string) => void;
  addToCart: (listingId: string) => void;
  setCartQuantity: (listingId: string, quantity: number) => void;
  removeFromCart: (listingId: string) => void;
  cartQuantityOf: (listingId: string) => number;
  clearCart: () => void;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read the saved state once on start-up. The effect is not allowed to set
  // state synchronously, so the load is wrapped in a promise and cancelled on
  // unmount. The empty state renders first and is filled in a moment later, which
  // happens behind the start-up splash.
  useEffect(() => {
    let isActive = true;

    loadSavedMarketplaceState().then((saved) => {
      if (!isActive) return;

      setWishlist(saved.wishlist);
      setCart(saved.cart);
      setIsHydrated(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  // Write the state back after every change, but not before the read has
  // finished: writing the empty state over the saved one during the first tick
  // would undo everything the farmer marked on a previous run.
  useEffect(() => {
    if (!isHydrated) return;

    void saveSavedMarketplaceState({ wishlist, cart });
  }, [wishlist, cart, isHydrated]);

  const toggleWishlist = useCallback((listingId: string) => {
    setWishlist((current) => toggleWishlisted(current, listingId));
  }, []);

  const addToCart = useCallback((listingId: string) => {
    setCart((current) => addCartLine(current, listingId));
  }, []);

  const setCartQuantity = useCallback((listingId: string, quantity: number) => {
    setCart((current) => changeCartQuantity(current, listingId, quantity));
  }, []);

  const removeFromCart = useCallback((listingId: string) => {
    setCart((current) => removeCartLine(current, listingId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const isWishlistedFor = useCallback(
    (listingId: string) => isWishlisted(wishlist, listingId),
    [wishlist]
  );

  const cartQuantityOf = useCallback(
    (listingId: string) => cartQuantity(cart, listingId),
    [cart]
  );

  // Joined lists are derived rather than stored, so a listing whose demo data
  // changes is never shown with a stale price. The cart holds a handful of
  // lines, so looking each one up is cheaper than keeping a second copy.
  const wishlistListings = useMemo(
    () => resolveWishlist(wishlist, DEMO_MARKETPLACE_LISTINGS),
    [wishlist]
  );

  const cartLines = useMemo(
    () => resolveCartLines(cart, DEMO_MARKETPLACE_LISTINGS),
    [cart]
  );

  const value = useMemo(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      wishlistListings,
      cart,
      cartItemCount: cartItemCount(cart),
      cartLines,
      isHydrated,
      isWishlisted: isWishlistedFor,
      toggleWishlist,
      addToCart,
      setCartQuantity,
      removeFromCart,
      cartQuantityOf,
      clearCart,
    }),
    [
      wishlist,
      wishlistListings,
      cart,
      cartLines,
      isHydrated,
      isWishlistedFor,
      toggleWishlist,
      addToCart,
      setCartQuantity,
      removeFromCart,
      cartQuantityOf,
      clearCart,
    ]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

/** Reads the shared wishlist and cart. Throws if used outside the provider. */
export function useMarketplaceSaved(): MarketplaceContextValue {
  const value = useContext(MarketplaceContext);

  if (!value) {
    throw new Error('useMarketplaceSaved must be used inside a <MarketplaceProvider />.');
  }

  return value;
}
