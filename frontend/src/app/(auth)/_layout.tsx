import { Stack } from 'expo-router';

/**
 * Stack navigator for the authentication flow.
 *
 * Headers are hidden because every auth screen draws its own title, subtitle
 * and back button, which keeps the branding consistent across screens.
 */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
