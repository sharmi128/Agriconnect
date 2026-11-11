import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { useOnboarding } from '@/context/onboarding-context';

/**
 * Tab navigator for the signed-in part of the app.
 *
 * The tab bar itself lives in `src/components/app-tabs.tsx` (native tabs) and
 * `src/components/app-tabs.web.tsx` (web), so this layout only wires that
 * component up as a route group. The routes below this group keep their
 * original URLs (`/home`, `/guide` and so on) because route groups are not part
 * of the URL.
 *
 * The redirect is the half of the "finish your profile first" rule that belongs
 * here. Home, My Farm, Farming Guide, Marketplace and Profile only open once the
 * Farmer Profile Setup form has been saved, so a farmer who is still setting up
 * is sent back to the start of the onboarding flow — the Welcome screen at `/`,
 * which is the app's real entry point — instead of a half-empty dashboard. It
 * sits here rather than in the root layout's `Stack.Protected` on purpose: Login
 * and Register navigate here when they are submitted, and this group has to stay
 * in the navigator for those to land somewhere real.
 */
export default function TabsLayout() {
  const { status, isProfileComplete } = useOnboarding();

  // Still reading the saved flag. The start-up splash covers this, so nothing is
  // rendered rather than sending the farmer to the Welcome screen on every launch.
  if (status === 'loading') {
    return null;
  }

  if (!isProfileComplete) {
    return <Redirect href="/" />;
  }

  return <AppTabs />;
}
