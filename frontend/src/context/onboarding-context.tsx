/**
 * Decides which half of the app a farmer is allowed to see.
 *
 * A new farmer gets the Welcome screen and then the Farmer Profile Setup, and
 * must finish that form before the Home dashboard, My Farm, Marketplace and
 * every other screen opens. Once it is finished the app behaves normally for
 * good, because the flag lives in AsyncStorage.
 *
 * There are three states, and the screens branch on `status`:
 *
 *   - `loading`   — the saved flag is being read. The route guards render
 *                   nothing yet, so the farmer never sees a flash of the Welcome
 *                   screen on the way to Home.
 *   - `onboarding` — no profile yet, or the form was never finished. The Welcome
 *                   and Profile Setup screens are open.
 *   - `complete`  — the profile is saved, so the normal navigation works.
 *
 * The provider also hands the saved profile to `FarmerProfileProvider`, so the
 * Profile tab shows the answers the farmer gave during setup instead of the demo
 * placeholders. The two providers stay separate on purpose: this one owns the
 * "is setup done" question, the other owns the profile the app reads and writes.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DEFAULT_FARMER_PROFILE, type FarmerProfile } from '@/models/farmer-profile';
import { clearOnboarding, loadOnboarding, saveOnboarding } from '@/services/onboarding-storage';

export type OnboardingStatus = 'loading' | 'onboarding' | 'complete';

type OnboardingContextValue = {
  status: OnboardingStatus;
  /** True once the farmer has saved a complete profile on this device. */
  isProfileComplete: boolean;
  /** The profile saved during setup, or the demo defaults before it is saved. */
  savedProfile: FarmerProfile;
  /**
   * Called by Save & Continue on the setup form. Saves the profile, marks setup
   * as done and moves the app onto the Home dashboard.
   */
  completeProfileSetup: (profile: FarmerProfile) => void;
  /**
   * Puts the app back to a first-launch state. Used by Logout, so signing out
   * on a device with no real account starts the next farmer at the Welcome
   * screen.
   */
  resetOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<OnboardingStatus>('loading');
  const [savedProfile, setSavedProfile] = useState<FarmerProfile>(DEFAULT_FARMER_PROFILE);

  // Read the saved flag once on start-up. The effect is not allowed to set state
  // synchronously, so the load is wrapped in a promise and cancelled on unmount.
  useEffect(() => {
    let isActive = true;

    loadOnboarding().then((stored) => {
      if (!isActive) return;

      setSavedProfile(stored.profile);
      setStatus(stored.profileCompleted ? 'complete' : 'onboarding');
    });

    return () => {
      isActive = false;
    };
  }, []);

  const completeProfileSetup = useCallback((profile: FarmerProfile) => {
    // The context is updated straight away so the guard lets the farmer through
    // without waiting for the write, and `saveOnboarding` only has to persist it.
    setSavedProfile(profile);
    setStatus('complete');
    void saveOnboarding(profile);
  }, []);

  const resetOnboarding = useCallback(() => {
    setSavedProfile(DEFAULT_FARMER_PROFILE);
    setStatus('onboarding');
    void clearOnboarding();
  }, []);

  // Memoised so screens only re-render when the onboarding state itself changes.
  const value = useMemo(
    () => ({
      status,
      isProfileComplete: status === 'complete',
      savedProfile,
      completeProfileSetup,
      resetOnboarding,
    }),
    [status, savedProfile, completeProfileSetup, resetOnboarding]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

/** Reads the onboarding state. Throws if used outside the provider. */
export function useOnboarding(): OnboardingContextValue {
  const value = useContext(OnboardingContext);

  if (!value) {
    throw new Error('useOnboarding must be used inside an <OnboardingProvider />.');
  }

  return value;
}
