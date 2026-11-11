/**
 * Holds the farmer profile for the whole app.
 *
 * The Profile screen and the Edit Profile screen are two different routes, so
 * they need one shared place to read from and write to. React Context does that
 * without any extra package, and the provider lives in the root layout, so the
 * profile survives navigating between screens and switching tabs.
 *
 * The profile also survives an app restart. On start-up it reads the same
 * AsyncStorage record the first-run Farmer Profile Setup wrote, so the Profile
 * tab shows the details the farmer actually gave rather than the demo
 * placeholders. That is still frontend-only: the record lives on the device and
 * the Spring Boot backend is not involved.
 *
 * When the backend is ready, replace the read below with a call to the API and
 * replace `updateProfile` with a save to the server.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_FARMER_PROFILE, type FarmerProfile } from '@/models/farmer-profile';
import { loadOnboarding } from '@/services/onboarding-storage';

type FarmerProfileContextValue = {
  profile: FarmerProfile;
  /** Called by the Farmer Profile Setup and by Edit Profile when the user saves. */
  updateProfile: (nextProfile: FarmerProfile) => void;
};

const FarmerProfileContext = createContext<FarmerProfileContextValue | null>(null);

export function FarmerProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_FARMER_PROFILE);

  // Restore the profile saved during setup. The demo defaults render first and
  // are replaced a moment later, which happens behind the start-up splash and
  // the onboarding guard, so the farmer never sees the placeholders.
  useEffect(() => {
    let isActive = true;

    loadOnboarding().then((stored) => {
      if (isActive && stored.profileCompleted) {
        setProfile(stored.profile);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const updateProfile = useCallback((nextProfile: FarmerProfile) => {
    setProfile(nextProfile);
  }, []);

  // Memoised so the screens only re-render when the profile itself changes.
  const value = useMemo(
    () => ({ profile, updateProfile }),
    [profile, updateProfile]
  );

  return <FarmerProfileContext.Provider value={value}>{children}</FarmerProfileContext.Provider>;
}

/** Reads the shared profile. Throws if used outside the provider. */
export function useFarmerProfile(): FarmerProfileContextValue {
  const value = useContext(FarmerProfileContext);

  if (!value) {
    throw new Error('useFarmerProfile must be used inside a <FarmerProfileProvider />.');
  }

  return value;
}
