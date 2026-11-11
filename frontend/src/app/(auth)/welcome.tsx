import { WelcomeScreen } from '@/components/auth/welcome-screen';

/**
 * `/welcome`, the short link to the Welcome screen.
 *
 * The screen the app actually opens on is `src/app/index.tsx`, because that is
 * the route Expo Router resolves `/` to. This file exists so `/welcome` keeps
 * working as a deep link, and it renders the very same component — there is only
 * one Welcome screen, not two copies of it.
 */
export default function WelcomeRoute() {
  return <WelcomeScreen />;
}
