import { router } from 'expo-router';
import { useState } from 'react';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SectionCard } from '@/components/ui/section-card';
import { SettingsLinkRow } from '@/components/profile/settings-link-row';
import { useOnboarding } from '@/context/onboarding-context';

/**
 * 🚪 Logout.
 *
 * Signing out is easy to tap by accident on a list of settings, so the row only
 * asks for a tap and the shared confirm dialog does the asking.
 *
 * Because the app has no real account yet, the farmer's identity is the profile
 * saved on the device, so logging out has to clear it. `resetOnboarding` does
 * that in memory and in local storage, which puts the app back into the
 * onboarding flow: the app is left on a first-launch state, so the next person
 * to open it gets the Welcome screen and the Farmer Profile Setup form, and this
 * screen goes to `/` — that same Welcome screen — rather than straight to the
 * dashboard.
 */
export function LogoutCard() {
  const [isConfirming, setIsConfirming] = useState(false);
  const { resetOnboarding } = useOnboarding();

  function handleLogout() {
    setIsConfirming(false);

    // TODO: clear the stored token once the backend issues one.
    resetOnboarding();
    router.replace('/');
  }

  return (
    <SectionCard title="Session" testID="session-card">
      <SettingsLinkRow
        emoji={'\u{1F6AA}'}
        label="Logout"
        description="Sign out of AgriConnect on this device"
        tone="danger"
        onPress={() => setIsConfirming(true)}
        testID="logout-button"
      />

      <ConfirmDialog
        visible={isConfirming}
        title="Logout of AgriConnect?"
        message="Your saved farm profile will be cleared from this device, and the app will return to the Welcome screen. Fields and your crop journal are kept."
        confirmLabel="Logout"
        tone="danger"
        onConfirm={handleLogout}
        onCancel={() => setIsConfirming(false)}
        testID="confirm-logout"
      />
    </SectionCard>
  );
}
