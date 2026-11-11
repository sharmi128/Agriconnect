import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AgriColors } from '@/constants/agri-theme';
import { AppSettingsProvider } from '@/context/app-settings-context';
import { CheckoutProvider } from '@/context/checkout-context';
import { ExpenseProvider } from '@/context/expense-context';
import { FarmProvider } from '@/context/farm-context';
import { FarmerProfileProvider } from '@/context/farmer-profile-context';
import { MarketplaceProvider } from '@/context/marketplace-context';
import { OnboardingProvider, useOnboarding } from '@/context/onboarding-context';

SplashScreen.preventAutoHideAsync();

/**
 * The screen list, with the "is this farmer allowed in yet?" question attached.
 *
 * It is a component of its own so the guard below can read the saved onboarding
 * flag with `useOnboarding`. The navigator has to be rendered inside
 * `OnboardingProvider` for that hook to work, so it cannot live in the root
 * layout's own body.
 */
function AppNavigator() {
  const { isProfileComplete } = useOnboarding();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/*
        The entry point, and the first screen in the navigator, so opening the app
        lands on it. It is the Welcome screen, and the only route in the app on
        the path `/`: the Home dashboard used to be `(tabs)/index`, which put two
        routes on `/` and let the router pick the tabs one, so the app started on
        Home and the Welcome screen was never shown on a first launch. Home is
        `(tabs)/home` now, so `/` belongs to this screen alone.
      */}
      <Stack.Screen name="index" />

      {/*
        The rest of the onboarding flow — Profile Setup, Login, Register and the
        `/welcome` link — is always mounted. It has to be: the Welcome screen is
        where a new farmer starts, it is where a farmer is sent back to after
        logging out, and it is what decides at launch whether to show that screen
        or the dashboard.
      */}
      <Stack.Screen name="(auth)" />

      {/*
        `(tabs)` stays registered while the farmer is still setting up, because
        Login and Register hand the farmer here when they submit, and a route that
        is not in the navigator would swallow that navigation and leave them
        stuck. The guard that keeps them out lives in the group's own layout
        instead, which is where the redirect is reliable.
      */}
      <Stack.Screen name="(tabs)" />

      {/*
        The Thank You page is a standalone closing screen, not a feature behind
        the profile guard — it is something a farmer can be shown at any point,
        including straight after signing up, so it stays in the navigator
        unconditionally. Its only way off is Back to Home, which returns to the
        dashboard.
      */}
      <Stack.Screen name="thank-you" />

      {/*
        Every other feature page is pushed on top of the tabs, and all of them are
        locked until the Farmer Profile Setup form is saved. `Stack.Protected`
        removes them from the navigator while the guard is false, so none of them
        can be reached — not by tapping, and not by opening a deep link to one.
      */}
      {/*
        The marketplace sits behind the screens a farmer reaches from the
        Marketplace tab: a category page, a product details page, a search across
        every listing, the wishlist, the cart, and the checkout that follows it —
        delivery details, the order confirmation and the placed order itself.
        They are a group of their own so the tab keeps its short `/marketplace`
        URL while these get `/category/machinery`, `/product/mkt-mach-tractor`,
        `/search`, `/wishlist`, `/cart`, `/delivery`, `/order-confirmation` and
        `/order/AGRI-XXXXXX`, and they are guarded on the same finished-profile
        rule as every other feature page.
      */}
      <Stack.Protected guard={isProfileComplete}>
        <Stack.Screen name="(marketplace)" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="add-field" />
        <Stack.Screen name="edit-field" />
        <Stack.Screen name="field/[id]" />
        <Stack.Screen name="field/[id]/crop" />
        <Stack.Screen name="add-crop" />
        <Stack.Screen name="edit-crop" />
        <Stack.Screen name="expenses" />
        <Stack.Screen name="add-expense" />
        <Stack.Screen name="edit-expense" />
        <Stack.Screen name="weather" />
        <Stack.Screen name="water" />
        <Stack.Screen name="loan-support" />
        <Stack.Screen name="expert-consultation" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="harvest" />
        <Stack.Screen name="buyer-connection" />
        <Stack.Screen name="buyers" />
        <Stack.Screen name="fertilizer-guide" />
        <Stack.Screen name="crop-health-guide" />
      </Stack.Protected>
    </Stack>
  );
}

/**
 * Root layout for the whole app.
 *
 * It is a Stack, and the order matters: `index` is listed first, so `/` — the
 * route the app is opened at — is the Welcome screen, and it decides on its own
 * whether the farmer continues into the setup flow or goes to the dashboard.
 * `(auth)` holds the rest of the onboarding flow and `(tabs)` holds the
 * signed-in screens, including the Home dashboard at `/home` and the Farming
 * Guide tab. `(marketplace)`, `edit-profile`, `add-field`, `edit-field`,
 * `field/[id]`, `field/[id]/crop`, `add-crop`, `edit-crop`, `expenses`,
 * `add-expense`, `edit-expense`, `weather`, `water`, `loan-support`,
 * `expert-consultation`, `notifications`, `harvest`, `buyer-connection`,
 * `buyers`, `fertilizer-guide` and `crop-health-guide` are pushed on top of
 * those so they open without the tab bar underneath them.
 *
 * `OnboardingProvider` wraps everything, because it owns the saved "has this
 * farmer finished the profile setup" flag that `AppNavigator` guards on. It sits
 * under `AppSettingsProvider` only because both have to be above the navigator,
 * and neither reads the other. `FarmerProfileProvider` is inside it, so the
 * profile the Profile tab reads is the same one Profile Setup and Edit Profile
 * write to. `FarmProvider` does the same job for the fields and crops that My
 * Farm lists, Add Field creates and Edit Crop updates. `ExpenseProvider` does the
 * same for the entries the Expenses screen totals and its Add and Edit forms
 * write. `MarketplaceProvider` does the same for the wishlist and the cart, which
 * the Marketplace tab, a category page, the product details page and the two
 * saved-list screens all read and write. `CheckoutProvider` does the same for the
 * saved delivery address and the placed demo orders, which the Delivery Details,
 * Order Confirmation and View Order screens read. All three save to the device,
 * so their records outlive a restart.
 * `AppSettingsProvider` does the same job for the 🔔 notification, 🌐 language
 * and ⚙️ app settings on that tab.
 *
 * The navigator is given one theme, the light one, and the phone's own dark
 * setting is ignored: these screens are read outdoors in daylight, so the app
 * paints itself the same paddy-field colors on every device. The root view
 * behind the navigator is set to the cream page color as well, so no white or
 * black flash shows behind a screen while it mounts.
 */
export default function RootLayout() {
  useEffect(() => {
    // The cream behind the navigator, and on Android the colour behind the
    // system bars. Both are set to the same value the screens use.
    SystemUI.setBackgroundColorAsync(AgriColors.background).catch(() => undefined);

    // Safety net: the custom splash overlay hides the native splash screen from
    // its own `onLayout`, but the app must never be left on the native launch
    // screen if that callback does not run. Calling `hideAsync()` here — after
    // the root layout has mounted, with the overlay already painted on top of it
    // — guarantees the farmer always moves past the splash on a native build.
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: AgriColors.primary,
      background: AgriColors.background,
      card: AgriColors.surface,
      text: AgriColors.text,
      border: AgriColors.border,
    },
  };

  return (
    <AppSettingsProvider>
      <OnboardingProvider>
        <FarmerProfileProvider>
          <FarmProvider>
            <ExpenseProvider>
              <MarketplaceProvider>
                <CheckoutProvider>
                  <ThemeProvider value={navigationTheme}>
                    <StatusBar style="dark" />
                    <AnimatedSplashOverlay />
                    <AppNavigator />
                  </ThemeProvider>
                </CheckoutProvider>
              </MarketplaceProvider>
            </ExpenseProvider>
          </FarmProvider>
        </FarmerProfileProvider>
      </OnboardingProvider>
    </AppSettingsProvider>
  );
}
