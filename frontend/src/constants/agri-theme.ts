/**
 * AgriConnect design tokens.
 *
 * The visual language is a South Indian paddy field in harvest light: paddy
 * green for anything the farmer acts on, a fresher leaf green as the second
 * accent, warm harvest yellow for highlights, a soft cream page, white cards
 * and near-black text so reading is never work.
 *
 * There is one palette and it is the light one. The app deliberately follows
 * the phone's dark setting nowhere: the farming screens are read outdoors, in
 * daylight, often with the sun behind the phone, and a dark theme is the wrong
 * answer to that. `useAgriTheme` returns this object on every device.
 *
 * Every screen reads its colors from here, which means the whole app can be
 * re-skinned by changing this one file.
 */

import { Platform, type ViewStyle } from 'react-native';

/**
 * The single AgriConnect palette.
 *
 * The names say where a color is meant to be used rather than what it looks
 * like, so a screen never has to guess.
 */
export const AgriColors = {
  /** 🌾 Paddy green. Primary buttons, active tabs, links, selected chips. */
  primary: '#2E7D32',
  /** The darker green behind `primary` when something is pressed. */
  primaryDark: '#1B5E20',
  /** Pale green for icon tiles, soft highlights and tag backgrounds. */
  primarySoft: '#E8F3E4',
  /**
   * A brighter, fresher green for the second accent — the one that carries
   * "growing" and "harvested" on its own, so a card can be green and yellow at
   * the same time without the yellow turning into a warning.
   */
  fresh: '#66A61E',
  /** The pressed state of `fresh`. */
  freshDark: '#4E8316',
  /** Pale leaf green, for the tiles that sit behind `fresh`. */
  freshSoft: '#EDF6DC',

  /** 🌾 Warm harvest yellow. Badges, highlights, the price on a card. */
  harvest: '#F4C542',
  /** A readable amber for text sitting on `harvestSoft`. */
  harvestDark: '#7A5200',
  /** Pale yellow for chips, icon circles and soft highlights. */
  harvestSoft: '#FDF3D2',

  /** Soft cream. The page every screen is drawn on. */
  background: '#FFFBEA',
  /** Cards and inputs sit on white so they lift off the cream. */
  surface: '#FFFFFF',
  /**
   * A hair off white, for the quiet inner panels inside a card where a block
   * of white on white would have no edges.
   */
  surfaceMuted: '#F7F3E3',
  /** The soft green wash used behind a green hero band. */
  surfaceGreen: '#EEF6E9',

  /** Main text. Near-black, so it is readable on cream and on white. */
  text: '#1F1F1F',
  /** Supporting text: still dark enough to pass contrast on the cream page. */
  textSecondary: '#5C5A50',
  /** Quiet hairlines that separate rows without drawing attention. */
  border: '#E9E3D0',
  /** Stronger border for inputs and selected rows. */
  borderStrong: '#D3CBB2',

  /** Errors and destructive actions. */
  danger: '#B3261E',
  dangerSoft: '#FBEAE7',
  /** A crop warning that is not yet urgent. */
  warning: '#8A5A00',
  warningSoft: '#FAF0D8',
  /** Earthy brown, for soil and land. */
  earth: '#7A5230',
  earthSoft: '#F4EDE3',
  /** Water blue, for irrigation and rain. */
  water: '#1E6F8E',
  waterSoft: '#E4F0F5',

  /** Text and icons on `primary`. */
  onPrimary: '#FFFFFF',
  /** Text and icons on `harvest`. */
  onHarvest: '#4A3600',
  /** Text and icons on `fresh`. */
  onFresh: '#FFFFFF',

  /**
   * The wash laid over the paddy artwork.
   *
   * The photo is bright, so a hero heading needs a scrim before it sits on top
   * of it. This is a plain dark green rather than a gradient, which keeps the
   * band one flat block of colour without needing a gradient library.
   */
  heroScrim: 'rgba(20, 62, 24, 0.55)',
  /** The wash laid over the soft page artwork, light enough to stay subtle. */
  pageScrim: 'rgba(255, 251, 234, 0.82)',
  /** A stronger wash, for screens that are mostly text rather than cards. */
  pageScrimStrong: 'rgba(255, 251, 234, 0.92)',
} as const;

/**
 * The colors available to a component.
 *
 * Kept as an alias rather than removed, because screens annotate their palette
 * with it and that is what makes the re-skin above a one-file change.
 */
export type AgriPalette = typeof AgriColors;

/**
 * Reuses the spacing scale from the starter template so spacing stays
 * consistent with the rest of the app.
 */
export const AgriRadius = {
  small: 8,
  medium: 12,
  /** Cards: rounded, but not so round they read as pills. */
  large: 16,
  /** Hero bands and the large category cards. */
  xlarge: 24,
  pill: 999,
} as const;

/**
 * Font sizes for the app. Line heights are included so text stays readable when
 * the user increases the system font size, and the larger sizes carry a little
 * negative tracking so headings look set rather than stretched.
 */
export const AgriTypography = {
  heroTitle: { fontSize: 34, lineHeight: 42, fontWeight: '700', letterSpacing: -0.6 },
  title: { fontSize: 26, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
  subtitle: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
} as const;

/**
 * Soft, low-contrast shadows.
 *
 * Cards carry a hairline border as well, so the elevation is only a hint of
 * depth. The old theme leaned on shadow to separate surfaces; this one leans on
 * the border, which is what keeps a long list of white cards on cream calm
 * rather than heavy.
 *
 * Android takes `elevation`; everything else, including web, takes the
 * `shadow*` props, which react-native-web maps to `box-shadow`.
 */
export const AgriShadows = {
  /** Resting elevation for cards and panels. */
  card: Platform.select({
    android: { elevation: 1 },
    default: {
      shadowColor: '#2E7D32',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
  }) as ViewStyle,
  /** Slightly stronger, for controls a finger is meant to press. */
  raised: Platform.select({
    android: { elevation: 3 },
    default: {
      shadowColor: '#2E7D32',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
    },
  }) as ViewStyle,
} as const;

/** Form screens are centered on tablets and on the web. */
export const AuthMaxContentWidth = 480;
