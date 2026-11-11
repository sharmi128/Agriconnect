import { StyleSheet } from 'react-native';

/**
 * The web build has no native splash screen to cover, so the overlay is a no-op
 * here. The native version in `animated-icon.tsx` carries the paddy artwork.
 */
export function AnimatedSplashOverlay() {
  return null;
}

export const splashStyles = StyleSheet.create({});
