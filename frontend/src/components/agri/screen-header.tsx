import { router } from 'expo-router';
import { Image } from 'expo-image';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';

type ScreenHeaderProps = {
  title: string;
  /** One line under the title. Kept short; the body carries the detail. */
  subtitle?: string;
  /** Small line above the title, for the feature's name. */
  eyebrow?: string;
  /** Defaults to popping the current screen. */
  onBack?: () => void;
  /** Pads the top of the band by the safe-area inset plus this much. */
  topInset?: number;
  /** Buttons or a search field drawn under the title, inside the band. */
  children?: ReactNode;
  testID?: string;
};

/**
 * The green band at the top of every screen pushed on top of the tabs.
 *
 * All of them used to be a bare title on cream, which left a farmer's
 * weather screen looking exactly like their expenses screen. This gives each one
 * the same green band, the paddy artwork under a flat wash, and a white title,
 * so the app reads as one thing however deep the farmer has navigated — and so
 * the back button is always in the same place under the thumb.
 *
 * The band is deliberately plain. The artwork is behind a wash heavy enough that
 * the title never has to fight it, because these screens are mostly forms and
 * long lists and the photograph is there for warmth, not for information.
 */
export function ScreenHeader({
  title,
  subtitle,
  eyebrow,
  onBack,
  topInset = 0,
  children,
  testID,
}: ScreenHeaderProps) {
  function goBack() {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  }

  return (
    <View
      testID={testID}
      style={[styles.band, { paddingTop: topInset + Spacing.two }]}>
      {/*
        The same paddy artwork as the hero bands, under a heavier wash. This band
        is short and it sits above a form, so the photo is pushed further back
        here than it is on a full hero.
      */}
      <Image
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        source={require('@/assets/images/paddy-field-hero.png')}
        contentFit="cover"
        transition={0}
      />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wash]} />

      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={goBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Text style={styles.backChevron}>{'\u2039'}</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: 2,
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  wash: {
    backgroundColor: 'rgba(24, 66, 28, 0.72)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingRight: Spacing.two,
  },
  pressed: {
    opacity: 0.6,
  },
  backChevron: {
    fontSize: 26,
    lineHeight: 28,
    marginTop: -4,
    color: '#FFFFFF',
  },
  backLabel: {
    ...AgriTypography.label,
    color: '#FFFFFF',
  },
  eyebrow: {
    ...AgriTypography.caption,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  title: {
    ...AgriTypography.title,
    fontSize: 24,
    lineHeight: 32,
    color: '#FFFFFF',
  },
  subtitle: {
    ...AgriTypography.body,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
