import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthMaxContentWidth } from '@/constants/agri-theme';
// Reuse the spacing scale from the starter template so spacing matches the rest of the app.
import { Spacing } from '@/constants/theme';

type AuthScreenProps = {
  children: React.ReactNode;
  /** `centered` for Welcome, `top` for the forms so the keyboard does not shift them. */
  layout?: 'centered' | 'top';
  testID?: string;
};

/**
 * Shared wrapper for the form screens: the auth flow and Edit Profile.
 *
 * It handles the four things those screens all need: the paddy page, safe-area
 * padding, keeping the keyboard from covering the inputs, and capping the width
 * so the form stays readable on tablets and on the web.
 *
 * A sign-in screen is the one place in the app that is mostly typing, so the
 * artwork behind it is washed a little further out than on a card list: the
 * inputs stay the brightest thing on screen.
 */
export function AuthScreen({ children, layout = 'top', testID }: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <PaddyBackground intensity="page">
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          testID={testID}
          style={styles.flex}
          // Let the user scroll past the last field even when the keyboard is open.
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[
            styles.content,
            layout === 'centered' ? styles.contentCentered : styles.contentTop,
            {
              paddingTop: insets.top + Spacing.four,
              paddingBottom: insets.bottom + Spacing.four,
            },
          ]}>
          <View style={styles.inner}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaddyBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  contentCentered: {
    justifyContent: 'center',
  },
  contentTop: {
    justifyContent: 'flex-start',
  },
  inner: {
    width: '100%',
    maxWidth: AuthMaxContentWidth,
  },
});
