/**
 * Returns the AgriConnect color palette.
 *
 * There is one palette, and it is the bright one: the farming screens are read
 * outdoors in daylight, so the app follows the phone's dark setting nowhere.
 * Every screen calls this and gets the paddy-field colors from
 * `src/constants/agri-theme.ts`.
 */

import { AgriColors, type AgriPalette } from '@/constants/agri-theme';

export function useAgriTheme(): AgriPalette {
  return AgriColors;
}
