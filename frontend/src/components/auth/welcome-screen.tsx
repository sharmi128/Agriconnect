import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/auth/auth-screen';
import { AuthSwitchLink } from '@/components/auth/auth-switch-link';
import { Button } from '@/components/ui/button';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useOnboarding } from '@/context/onboarding-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';

/**
 * The Welcome screen itself.
 *
 * It lives here rather than inside a single route file because the app opens on
 * it two ways: `src/app/index.tsx` is the entry point the router resolves `/` to
 * on every launch, and `src/app/(auth)/welcome.tsx` keeps the `/welcome` link
 * working. Both render this one component, so there is a single copy of the
 * screen and a single place where the "already set up, go to Home" rule lives.
 *
 * The screen is shown once, on the very first launch. "Get Started" goes to the
 * Farmer Profile Setup form, and nothing else in the app opens until that form
 * is saved. The saved flag lives in AsyncStorage, so a farmer who has already
 * finished setup never sees this screen again: the redirect below sends them
 * straight to the Home dashboard.
 *
 * The screen stays centred and scrolls, so the same layout works on a small
 * phone and on a tablet.
 *
 * The mark above the message is the app's own icon, `@/assets/images/icon.png` —
 * the same file `app.json` points `icon` at — shown large and centred. The
 * farmer recognises it from the home screen of their phone, and it is the first
 * thing in the app that is not a form, so it is given the room to read.
 */
export function WelcomeScreen() {
  const colors = useAgriTheme();
  const { status, isProfileComplete } = useOnboarding();

  // Still reading the saved flag. The start-up splash is on top of this, so
  // rendering nothing here stops the Welcome screen flashing on the way to Home.
  if (status === 'loading') {
    return null;
  }

  // A saved profile means the farmer has been here before, so the launch lands
  // them on the Home dashboard instead of showing this screen a second time.
  if (isProfileComplete) {
    return <Redirect href="/home" />;
  }

  return (
    <AuthScreen layout="centered" testID="welcome-screen">
      <View style={styles.container}>
        <View style={styles.hero}>
          <View
            style={[
              styles.mark,
              {
                backgroundColor: colors.surface,
                borderColor: colors.harvest,
              },
            ]}>
            <Image
              accessible
              accessibilityRole="image"
              accessibilityLabel="AgriConnect logo"
              style={styles.markImage}
              source={require('@/assets/images/icon.png')}
              contentFit="contain"
              transition={0}
            />
          </View>

          <Text style={[styles.title, { color: colors.primaryDark }]}>
            Welcome to AgriConnect {'\u{1F331}'}
          </Text>

          <View
            style={[
              styles.messageCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={[styles.message, { color: colors.text }]}>
              Your farming journey matters to us.
            </Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              Here, you can find the guidance, information, and support you need for your farm.
            </Text>
            <Text style={[styles.message, { color: colors.text }]}>
              We warmly welcome you to AgriConnect. {'❤️'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label="Get Started"
            onPress={() => router.push('/profile-setup')}
            testID="get-started-button"
          />

          <AuthSwitchLink
            prompt="Already have an account?"
            actionLabel="Login"
            onPress={() => router.push('/login')}
          />
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.five,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.four,
  },
  mark: {
    // The logo is framed rather than dropped straight on the page: a white
    // rounded card lifts it off the cream and gives the mark somewhere to sit,
    // and the harvest-yellow edge ties it to the button and the artwork.
    ...AgriShadows.raised,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.two,
    borderRadius: AgriRadius.xlarge,
    borderWidth: 2,
  },
  markImage: {
    // The icon is the first thing the farmer sees, so it is given the room to
    // read as the app's mark rather than a thumbnail. It is square, so equal
    // sides keep it undistorted, and `contain` leaves any transparent margin in
    // the file alone instead of stretching it.
    width: 180,
    height: 180,
    borderRadius: AgriRadius.large,
    overflow: 'hidden',
  },
  title: {
    ...AgriTypography.title,
    textAlign: 'center',
  },
  messageCard: {
    // The message sits on a card rather than straight on the background, so the
    // invitation reads as something being given to the farmer.
    width: '100%',
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  message: {
    ...AgriTypography.body,
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.two,
  },
});
