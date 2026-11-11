import Constants from 'expo-constants';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { ABOUT_AGRICONNECT } from '@/models/app-settings';

/** The two ways out of the app, shown as buttons at the bottom of the card. */
const LINKS = [
  {
    emoji: '\u{1F310}',
    label: 'Visit the website',
    url: ABOUT_AGRICONNECT.website,
    testID: 'about-website',
  },
  {
    emoji: '\u2709\uFE0F',
    label: 'Email support',
    url: `mailto:${ABOUT_AGRICONNECT.supportEmail}`,
    testID: 'about-support',
  },
] as const;

/** Shown when the Expo config is not embedded, which happens in some Expo Go setups. */
const FALLBACK_VERSION = '1.0.0';

/**
 * ℹ️ About AgriConnect.
 *
 * The app version comes from `app.json` through `expo-constants`, so the number
 * here can never drift away from what was actually shipped.
 */
export function AboutAgriConnectCard() {
  const colors = useAgriTheme();
  const version = Constants.expoConfig?.version;

  return (
    <SectionCard
      title="\u2139\uFE0F About AgriConnect"
      subtitle={ABOUT_AGRICONNECT.tagline}
      testID="about-agriconnect-card">
      <View style={styles.body}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {ABOUT_AGRICONNECT.description}
        </Text>

        <View style={styles.highlights}>
          {ABOUT_AGRICONNECT.highlights.map((highlight) => (
            <View key={highlight} style={styles.highlightRow}>
              <Text style={[styles.bullet, { color: colors.primary }]}>{'\u2022'}</Text>
              <Text style={[styles.highlightText, { color: colors.text }]}>{highlight}</Text>
            </View>
          ))}
        </View>

        <View style={styles.links}>
          {LINKS.map((link) => (
            <Pressable
              key={link.url}
              testID={link.testID}
              accessibilityRole="link"
              accessibilityLabel={link.label}
              onPress={() => {
                // `Linking` is used rather than an in-app browser so the same code
                // path works for `mailto:` as well as `https:`. A phone with no
                // mail app set up simply does nothing, which is better than an
                // error the farmer cannot act on.
                Linking.openURL(link.url).catch(() => undefined);
              }}
              style={({ pressed }) => [
                styles.link,
                { borderColor: colors.border },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.linkLabel, { color: colors.primary }]}>
                {`${link.emoji}  ${link.label}`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.version, { color: colors.textSecondary }]}>
          {`Version ${version ?? FALLBACK_VERSION}`}
          {'  \u00B7  '}
          {ABOUT_AGRICONNECT.copyright}
        </Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  description: {
    ...AgriTypography.body,
  },
  highlights: {
    gap: Spacing.two,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  bullet: {
    ...AgriTypography.body,
  },
  highlightText: {
    ...AgriTypography.body,
    flex: 1,
  },
  links: {
    gap: Spacing.two,
  },
  link: {
    minHeight: 48,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  linkLabel: {
    ...AgriTypography.label,
  },
  version: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
});
