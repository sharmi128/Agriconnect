import { Image } from 'expo-image';
import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type GreenHeroProps = {
  /**
   * Drawn at the very top of the band, above the eyebrow. The Marketplace uses
   * it for the row of saved-list buttons, which has to be the first thing under
   * the status bar on every screen it appears on.
   */
  header?: ReactNode;
  /** Small line above the title, for the screen's name. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Anything that belongs inside the band: a search bar, a row of stats. */
  children?: ReactNode;
  /** Pads the top of the band by the safe-area inset plus this much. */
  topInset?: number;
  /** Rounds the foot of the band. Off for a band that runs to the screen edge. */
  rounded?: boolean;
  testID?: string;
};

/**
 * The green band at the top of a screen: a paddy field under a green wash, with
 * the screen's name on it.
 *
 * This is the app's hero. The photograph behind it is a local file — sunlight
 * across a paddy field — put under a green scrim at full strength, so it reads as
 * depth and weather while the white heading stays readable. There is no gradient:
 * a flat wash over the photo is all it takes, and it keeps the app free of a
 * gradient library.
 *
 * The foot of the band is rounded, so the cream page curves in under it rather
 * than the band ending in a hard line.
 */
export function GreenHero({
  header,
  eyebrow,
  title,
  subtitle,
  children,
  topInset = 0,
  rounded = true,
  testID,
}: GreenHeroProps) {
  const colors = useAgriTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.band,
        rounded && styles.bandRounded,
        { paddingTop: topInset + Spacing.three },
      ]}>
      <Image
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        source={require('@/assets/images/paddy-sunlight.jpg')}
        contentFit="cover"
        transition={0}
      />

      {/* The wash. Everything readable on this band sits on top of it. */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wash]} />

      {/*
        Three soft bands across the foot of the wash, standing in for paddy
        rows running off the edge of the field. They are part of the artwork
        cue rather than decoration, so they are the quietest thing on the band.
      */}
      <View pointerEvents="none" style={styles.rows}>
        <View style={styles.row} />
        <View style={styles.row} />
        <View style={styles.row} />
      </View>

      <View style={styles.content}>
        {header ? <View style={styles.header}>{header}</View> : null}

        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}

        <Text style={styles.title}>{title}</Text>

        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    overflow: 'hidden',
    backgroundColor: '#2E7D32',
  },
  bandRounded: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  /**
   * The green wash. It is a flat colour rather than a gradient over the photo,
   * which is what keeps the photograph from becoming the contrast on the band.
   */
  wash: {
    backgroundColor: 'rgba(27, 78, 32, 0.66)',
  },
  content: {
    gap: 6,
  },
  /** A bottom margin so the header row is not flush against the eyebrow. */
  header: {
    marginBottom: Spacing.three,
  },
  eyebrow: {
    ...AgriTypography.caption,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: 'rgba(255, 255, 255, 0.78)',
  },
  title: {
    ...AgriTypography.heroTitle,
    color: '#FFFFFF',
  },
  subtitle: {
    ...AgriTypography.body,
    color: 'rgba(255, 255, 255, 0.92)',
  },
  rows: {
    position: 'absolute',
    bottom: -18,
    right: -20,
    alignItems: 'flex-end',
    gap: 12,
    opacity: 0.1,
  },
  row: {
    height: 10,
    borderRadius: 5,
    width: 220,
    backgroundColor: '#FFFFFF',
  },
});
