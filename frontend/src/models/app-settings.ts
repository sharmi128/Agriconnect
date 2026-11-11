/**
 * App settings model, plus the demo content behind the Profile screen.
 *
 * The Profile tab has three settings groups — 🔔 Notification Settings, 🌐 Language
 * and ⚙️ App Settings — and this file holds everything they need to render, the
 * same way `models/notifications.ts` holds the alerts list. The screen and the
 * components below never build their own data, so replacing this with a call to
 * the Spring Boot backend is a change to this file only.
 *
 * Nothing here is stored anywhere yet. The values live in React state
 * (`context/app-settings-context.tsx`), so they reset when the app restarts. When
 * the backend is ready, `getAppSettings()` becomes a fetch and the same shape is
 * filled from the server.
 */

import type { SelectOption } from '@/models/farmer-profile';

/** The keys of the notification switches, one per kind of alert. */
export type NotificationKey =
  | 'weather'
  | 'irrigation'
  | 'marketPrices'
  | 'harvestReminders'
  | 'appUpdates';

/** One notification switch. */
export type NotificationPreference = {
  key: NotificationKey;
  /** Shown to the left of the label. */
  emoji: string;
  label: string;
  /** One line explaining what turning this on actually does. */
  description: string;
};

/** The keys of the on/off switches in App Settings. */
export type AppPreferenceKey = 'dataSaver' | 'autoRefresh' | 'haptics' | 'showLocation';

/** One on/off switch in App Settings. */
export type AppPreference = {
  key: AppPreferenceKey;
  emoji: string;
  label: string;
  description: string;
};

/** Every switch the farmer can change, in the order they are shown. */
export const NOTIFICATION_PREFERENCES: readonly NotificationPreference[] = [
  {
    key: 'weather',
    emoji: '\u{1F327}\uFE0F',
    label: 'Weather alerts',
    description: 'Rain, storm and heat warnings for your fields.',
  },
  {
    key: 'irrigation',
    emoji: '\u{1F4A7}',
    label: 'Irrigation reminders',
    description: 'A nudge when a field is due for water.',
  },
  {
    key: 'marketPrices',
    emoji: '\u{1F4C8}',
    label: 'Market price updates',
    description: 'Daily price changes for the crops you grow.',
  },
  {
    key: 'harvestReminders',
    emoji: '\u{1F33E}',
    label: 'Harvest reminders',
    description: 'Reminders as a crop approaches its harvest date.',
  },
  {
    key: 'appUpdates',
    emoji: '\u{1F4E2}',
    label: 'AgriConnect updates',
    description: 'News about new features and improvements.',
  },
];

/**
 * App Settings switches.
 *
 * 🌙 Appearance is deliberately not one of them: the app has a single bright
 * paddy-field theme, so there is nothing to switch between. The Profile tab
 * shows it as a read-only row instead of a control.
 */
export const APP_PREFERENCES: readonly AppPreference[] = [
  {
    key: 'dataSaver',
    emoji: '\u{1F4F6}',
    label: 'Data saver',
    description: 'Load smaller images and refresh less often.',
  },
  {
    key: 'autoRefresh',
    emoji: '\u{1F504}',
    label: 'Auto refresh',
    description: 'Refresh weather and market prices when you open a screen.',
  },
  {
    key: 'haptics',
    emoji: '\u{1F44C}',
    label: 'Haptic feedback',
    description: 'Vibrate gently when you tap a button or an alert arrives.',
  },
  {
    key: 'showLocation',
    emoji: '\u{1F4CD}',
    label: 'Show my location',
    description: 'Show where you are on the farm map and in the marketplace.',
  },
];

/** The 🌐 Language picker. English is first because the app starts in English. */
export const LANGUAGE_OPTIONS: SelectOption[] = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी (Hindi)', value: 'hi' },
  { label: 'தமிழ் (Tamil)', value: 'ta' },
  { label: 'മലയാളം (Malayalam)', value: 'ml' },
  { label: 'ಕನ್ನಡ (Kannada)', value: 'kn' },
  { label: 'తెలుగు (Telugu)', value: 'te' },
  { label: 'বাংলা (Bengali)', value: 'bn' },
  { label: 'मराठी (Marathi)', value: 'mr' },
];

/**
 * Which appearance `useAgriTheme` should return.
 *
 * `system` and `light` both mean the same thing: the app has a single, bright
 * paddy-field theme and follows the phone's dark setting nowhere. The two
 * values are kept so the settings shape and the reset flow stay exactly as they
 * were; there is deliberately no `dark`.
 */
export type ThemeOption = 'system' | 'light';

/** The 🌙 Appearance picker. Both entries are the daylight theme. */
export const THEME_OPTIONS: SelectOption[] = [
  { label: 'Daylight (recommended)', value: 'system' },
  { label: 'Daylight', value: 'light' },
];

/** How the land size is written on screen. The profile still stores acres. */
export type LandAreaUnit = 'acres' | 'hectares';

/** The 📐 Land area unit picker. */
export const LAND_AREA_UNIT_OPTIONS: SelectOption[] = [
  { label: 'Acres', value: 'acres' },
  { label: 'Hectares', value: 'hectares' },
];

/** Everything the settings sections read and write. */
export type AppSettings = {
  language: string;
  theme: ThemeOption;
  landAreaUnit: LandAreaUnit;
  /** One boolean per entry in `NOTIFICATION_PREFERENCES`. */
  notifications: Record<NotificationKey, boolean>;
  /** One boolean per entry in `APP_PREFERENCES`. */
  app: Record<AppPreferenceKey, boolean>;
};

/**
 * The values the app starts with.
 *
 * Weather, irrigation and harvest alerts are on because a farmer opening a fresh
 * install should not miss a storm. Market prices and app news are off so the
 * first notification the farmer gets is one that matters in the field.
 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  language: 'en',
  theme: 'system',
  landAreaUnit: 'acres',
  notifications: {
    weather: true,
    irrigation: true,
    marketPrices: false,
    harvestReminders: true,
    appUpdates: false,
  },
  app: {
    dataSaver: false,
    autoRefresh: true,
    haptics: true,
    showLocation: true,
  },
};

/** What the ℹ️ About AgriConnect card shows. */
export const ABOUT_AGRICONNECT = {
  tagline: 'A simple farming companion for the whole season.',
  description:
    'AgriConnect brings your farm, the weather, your crop journal and the buyers around you into one place, so a farmer can decide the day\u2019s work without leaving the field.',
  /** The three things the app is built around, shown as a short list. */
  highlights: [
    'Weather and crop advice for your own fields',
    'Crop journal with photos and harvest records',
    'Marketplace that connects you to local buyers',
  ],
  website: 'https://agriconnect.app',
  supportEmail: 'support@agriconnect.app',
  copyright: 'AgriConnect. Made for farmers.',
} as const;

/**
 * The settings to show when the app opens.
 *
 * This is the seam for a real settings endpoint. Today it returns
 * `DEFAULT_APP_SETTINGS`; when the backend is ready, replace the body with a call
 * to a service such as `fetchAppSettings()` and return its response, which is
 * expected to match the `AppSettings` type above.
 */
export function getAppSettings(): AppSettings {
  return DEFAULT_APP_SETTINGS;
}

/** How many of the notification switches are currently on. */
export function countEnabledNotifications(settings: AppSettings): number {
  return NOTIFICATION_PREFERENCES.filter(
    (preference) => settings.notifications[preference.key]
  ).length;
}

/** The line shown under the 🔔 Notification Settings heading. */
export function notificationSummary(settings: AppSettings): string {
  const enabled = countEnabledNotifications(settings);

  return `${enabled} of ${NOTIFICATION_PREFERENCES.length} alerts turned on`;
}
