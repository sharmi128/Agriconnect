import { WelcomeScreen } from '@/components/auth/welcome-screen';

/**
 * The app's entry point: `src/app/index.tsx` is the screen Expo Router resolves
 * the root URL `/` to, so this is what a farmer sees when the app is opened.
 *
 * It is deliberately the ONLY route in the app with the path `/`. The Home
 * dashboard used to live at `/` as `(tabs)/index` as well, and two routes
 * sharing one path is ambiguous: Expo Router breaks that tie on an internal
 * sort, and it picked the tabs group, so the app started inside `(tabs)` and the
 * Welcome screen was never reached — the tab layout's own guard bounced the
 * farmer straight to the Profile Setup form instead. Home now lives at `/home`
 * (see `src/app/(tabs)/home.tsx`), which leaves `/` belonging to this screen
 * alone and makes the first-launch flow deterministic.
 *
 * The screen itself is shared with `src/app/(auth)/welcome.tsx`, so `/welcome`
 * still opens the same thing. It reads the saved `profileCompleted` flag:
 *
 *   - flag still being read — nothing is rendered yet, and the start-up splash
 *     is still on top, so the Welcome screen never flashes on the way to Home.
 *   - `profileCompleted === true` — a returning farmer goes straight to the Home
 *     dashboard (the redirect lives in `WelcomeScreen`).
 *   - no flag, or `false` — the farmer sees the Welcome screen, taps Get Started
 *     and is taken to the Farmer Profile Setup form.
 */
export default function AppEntry() {
  return <WelcomeScreen />;
}
