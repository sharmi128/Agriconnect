/**
 * The starter template's small set of theme colors.
 *
 * These back `ThemedText`, `ThemedView`, `Collapsible` and the web tab bar. The
 * app draws itself from `AgriColors` in `src/constants/agri-theme.ts`, so these
 * are the same paddy-field values rather than a second, greyer palette — that
 * way nothing can come out grey next to the rest of a screen.
 *
 * There is no dark entry: the app is light only.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  text: '#1F1F1F',
  background: '#FFFBEA',
  backgroundElement: '#E8F3E4',
  backgroundSelected: '#D6EACF',
  textSecondary: '#5C5A50',
} as const;

/** The keys available to a themed view or text. */
export type ThemeColor = keyof typeof Colors;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
