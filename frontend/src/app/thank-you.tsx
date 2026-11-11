import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

/**
 * A soft cream veil laid over the paddy-field photo so the dark title reads
 * clearly on top of it. It is warm and light on purpose — the brief for this
 * page is a bright, peaceful, sunlit thank-you, never a dark one, so the overlay
 * washes the photograph toward the cream page rather than darkening it.
 */
const HERO_OVERLAY = 'rgba(255, 251, 234, 0.55)';

/**
 * 🌾 "Thank You, Farmer" — a quiet, heartfelt closing screen.
 *
 * This is the one screen in the app that is not asking the farmer to do anything.
 * Everywhere else is a task: a field to add, a crop to log, a machine to book.
 * This page steps out of that entirely and simply says thank you, over a
 * paddy-field photo in warm sunlight, with the words a farmer rarely gets to
 * hear. It is deliberately uncluttered — one image, one message, one way home.
 *
 * The design leans on the app's own light agriculture language rather than
 * inventing a new one: the cream page, the harvest yellow accent, the natural
 * green gratitude card, and near-black text so the writing is effortless to
 * read. Nothing here is dark, because the feeling this page is meant to carry
 * is a field in sunlight, not a screen in shadow.
 *
 * The image is the existing local `farmer-paddy-field.jpg`, required at build
 * time. There is no remote URL, no generated artwork and no network call, so it
 * draws the same on a phone in a field as it does on a laptop.
 */
export default function ThankYouScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      testID="thank-you-screen"
      style={[styles.root, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.five },
      ]}>
      <View style={styles.inner}>
        {/*
          The hero. The photo runs edge to edge and up behind the status bar, with
          the cream veil over it and the title centred in the lower half — so the
          field fills the top of the screen and the words sit in the calm of it.
        */}
        <View style={styles.hero}>
          <Image
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
            source={require('@/assets/images/farmer-paddy-field.jpg')}
            contentFit="cover"
            transition={0}
          />

          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.heroOverlay]} />

          <View style={[styles.heroContent, { paddingTop: insets.top + Spacing.six }]}>
            <Text style={[styles.title, { color: colors.text }]}>{'Thank You, Farmer \u{1F33E}'}</Text>

            {/* A short harvest-yellow rule: the one warm accent on the page. */}
            <View style={[styles.rule, { backgroundColor: colors.harvest }]} />
          </View>
        </View>

        {/* The message, on the cream page below the field. */}
        <View style={styles.body}>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {'Every seed you plant, every field you care for,\nand every harvest you bring to our tables matters.'}
          </Text>

          <Text style={[styles.paragraph, { color: colors.text }]}>
            AgriConnect is here to support you throughout your farming journey — with
            information, guidance, marketplace support, and useful tools.
          </Text>

          <Text style={[styles.paragraph, { color: colors.text }]}>
            {'Your hard work feeds the world. \u2764\uFE0F'}
          </Text>

          <Text style={[styles.paragraph, { color: colors.text }]}>
            Thank you for being the heart of agriculture.
          </Text>

          {/*
            The gratitude note, in the natural green of the app, set apart as the
            sign-off rather than another paragraph of body copy.
          */}
          <View
            style={[
              styles.gratitude,
              AgriShadows.card,
              { backgroundColor: colors.primarySoft, borderColor: colors.border },
            ]}>
            <Text style={[styles.gratitudeLead, { color: colors.textSecondary }]}>
              With gratitude,
            </Text>
            <Text style={[styles.gratitudeSign, { color: colors.primaryDark }]}>
              {'Team AgriConnect \u{1F331}'}
            </Text>
          </View>

          <Button
            label="Back to Home"
            onPress={() => router.replace('/home')}
            style={styles.backButton}
            testID="thank-you-back-home"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  hero: {
    width: '100%',
    // Tall enough to feel like a hero band, short enough to leave the message
    // and the button above a phone's fold on a small screen.
    height: 340,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // Rounded feet, so the field curves down into the cream page rather than
    // ending on a hard line — the same shape as the app's green hero bands.
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroOverlay: {
    backgroundColor: HERO_OVERLAY,
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  title: {
    ...AgriTypography.heroTitle,
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 251, 234, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  rule: {
    width: 56,
    height: 4,
    borderRadius: 2,
  },
  body: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.four,
  },
  paragraph: {
    ...AgriTypography.body,
    fontSize: 16,
    lineHeight: 26,
  },
  gratitude: {
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.two,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    width: '100%',
  },
  gratitudeLead: {
    ...AgriTypography.body,
    fontStyle: 'italic',
  },
  gratitudeSign: {
    ...AgriTypography.subtitle,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
  },
  backButton: {
    marginTop: Spacing.two,
  },
});
