/**
 * The starter template's theme hook.
 *
 * It returns the light colors from `src/constants/theme.ts`, which are the
 * app's own paddy-field values. It deliberately does not ask the device for a
 * colour scheme: the app is bright everywhere.
 */

import { Colors } from '@/constants/theme';

export function useTheme() {
  return Colors;
}
