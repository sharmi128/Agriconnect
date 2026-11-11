/**
 * Holds the app settings for the whole app.
 *
 * The switches on the Profile tab are read by more than one place: `useAgriTheme`
 * needs the 🌙 theme choice to pick a palette, and the 📐 land size is formatted
 * with the unit the farmer picked. React Context gives every screen one shared
 * copy, and the provider sits in the root layout, so the choices survive moving
 * between tabs and pushing the Edit Profile screen.
 *
 * For now the data lives in memory only, so it is lost when the app restarts.
 * When the Spring Boot backend is ready, replace the setters with calls to the
 * API and load the saved settings on start-up. The nested objects are copied on
 * every write rather than mutated, which is what makes the change re-render.
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  getAppSettings,
  type AppPreferenceKey,
  type AppSettings,
  type LandAreaUnit,
  type NotificationKey,
  type ThemeOption,
} from '@/models/app-settings';

type AppSettingsContextValue = {
  settings: AppSettings;
  setLanguage: (language: string) => void;
  setTheme: (theme: ThemeOption) => void;
  setLandAreaUnit: (unit: LandAreaUnit) => void;
  toggleNotification: (key: NotificationKey) => void;
  toggleAppPreference: (key: AppPreferenceKey) => void;
  /** Puts every switch back to how the app shipped. */
  resetSettings: () => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  // `getAppSettings()` is the seam for the backend. Until then it hands back the
  // demo defaults, and the factory below keeps the shared constant immutable.
  const [settings, setSettings] = useState<AppSettings>(() => createInitialSettings());

  const setLanguage = useCallback((language: string) => {
    setSettings((current) => ({ ...current, language }));
  }, []);

  const setTheme = useCallback((theme: ThemeOption) => {
    setSettings((current) => ({ ...current, theme }));
  }, []);

  const setLandAreaUnit = useCallback((landAreaUnit: LandAreaUnit) => {
    setSettings((current) => ({ ...current, landAreaUnit }));
  }, []);

  const toggleNotification = useCallback((key: NotificationKey) => {
    setSettings((current) => ({
      ...current,
      notifications: { ...current.notifications, [key]: !current.notifications[key] },
    }));
  }, []);

  const toggleAppPreference = useCallback((key: AppPreferenceKey) => {
    setSettings((current) => ({
      ...current,
      app: { ...current.app, [key]: !current.app[key] },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(createInitialSettings());
  }, []);

  // Memoised so screens only re-render when the settings themselves change.
  const value = useMemo(
    () => ({
      settings,
      setLanguage,
      setTheme,
      setLandAreaUnit,
      toggleNotification,
      toggleAppPreference,
      resetSettings,
    }),
    [
      settings,
      setLanguage,
      setTheme,
      setLandAreaUnit,
      toggleNotification,
      toggleAppPreference,
      resetSettings,
    ]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

/** A private copy of the shipped defaults, so nothing can write to the constant. */
function createInitialSettings(): AppSettings {
  const defaults = getAppSettings();

  return {
    ...defaults,
    notifications: { ...defaults.notifications },
    app: { ...defaults.app },
  };
}

/** Reads the shared settings. Throws if used outside the provider. */
export function useAppSettings(): AppSettingsContextValue {
  const value = useContext(AppSettingsContext);

  if (!value) {
    throw new Error('useAppSettings must be used inside an <AppSettingsProvider />.');
  }

  return value;
}
