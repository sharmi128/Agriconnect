import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { thankYouHref } from '@/components/marketplace/routes';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

/**
 * 🌾 "Thank You 🌾" — the way into the Thank You, Farmer page.
 *
 * The page itself is the app's one screen that asks the farmer for nothing, so
 * it cannot live behind a cart or a category. This card is where the Marketplace
 * points to it, and it is the only thing on the screen that is not a category,
 * which is what keeps the five categories reading as one group.
 *
 * It is drawn from the same parts as the category cards above it, so it does not
 * look bolted on: a white card on the cream page with a hairline border and the
 * app's soft shadow, a green icon tile on the left, near-black text, and a footer
 * line with a green arrow circle. Only two things are its own — the 🌾 mark in
 * harvest yellow, and the yellow dot on the footer line where the category cards
 * use fresh green. Green and warm yellow together say "from us" without needing a
 * second colour anywhere else on the screen.
 *
 * It is a full-width row rather than a tile because the line under the title is
 * a sentence, and a sentence fits across a phone but not down a narrow tile.
 */
export function ThankYouNavCard() {
  const colors = useAgriTheme();

  return (
    <Pressable
      testID="marketplace-thank-you-card"
      accessibilityRole="button"
      accessibilityLabel="Thank You. A short note of thanks from the AgriConnect team for everything you grow."
      accessibilityHint="Opens the Thank You, Farmer page"
      onPress={() => router.push(thankYouHref())}
      style={({ pressed }) => [
        styles.card,
        AgriShadows.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={styles.row}>
        {/* 🟩 The green tile, the same size and corner as a settings-row icon. */}
        <View
          style={[
            styles.icon,
            { backgroundColor: colors.primarySoft, borderColor: colors.surfaceGreen },
          ]}>
          <Text style={styles.iconEmoji}>{'\u{1F33E}'}</Text>
        </View>

        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.text }]}>
            {'Thank You \u{1F33E}'}
          </Text>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            A short note of thanks from the AgriConnect team, for everything you grow.
          </Text>
        </View>
      </View>

      {/* The hairline that keeps the footer reading as a link, not more copy. */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.footer}>
        <View style={[styles.dot, { backgroundColor: colors.harvest }]} />
        <Text style={[styles.footerText, { color: colors.primary }]}>Read the thank you note</Text>

        <View style={[styles.arrowCircle, { backgroundColor: colors.primary }]}>
          <Text style={styles.arrow}>{'\u2192'}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.88,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: AgriRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconEmoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...AgriTypography.subtitle,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
  },
  description: {
    ...AgriTypography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  footerText: {
    ...AgriTypography.label,
    fontSize: 13,
    flex: 1,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    // Nudges the glyph onto the optical centre, which sits right of the box.
    marginLeft: 2,
  },
});
