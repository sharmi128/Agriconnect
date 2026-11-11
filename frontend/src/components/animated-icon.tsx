import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AgriColors, AgriRadius, AgriTypography } from '@/constants/agri-theme';

const DURATION = 600;

/**
 * The launch screen.
 *
 * It used to be a solid Expo blue. It is now the app's own cream with the
 * paddy-field artwork behind the mark, so the first thing a farmer sees is the
 * same green and gold they see on every screen. The overlay fades rather than
 * slides, and it unmounts itself once the animation finishes so nothing is left
 * over the navigator.
 */
export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  const content = (
    <>
      {/*
        The artwork is cropped to the middle of the frame and sits under a
        cream wash, so it reads as a field behind the mark rather than as a
        photograph competing with the text on it.
      */}
      <Image
        style={styles.artwork}
        source={require('@/assets/images/paddy-field-hero.png')}
        contentFit="cover"
        transition={0}
      />
      <View style={styles.wash} />

      <View style={styles.mark}>
        <View style={[styles.markCard, { borderColor: AgriColors.harvest }]}>
          <Image
            style={styles.markImage}
            source={require('@/assets/images/splash-icon.png')}
            contentFit="contain"
            transition={0}
          />
        </View>

        <Text style={styles.name}>AgriConnect</Text>
        <Text style={styles.tagline}>🌾 Your farming companion</Text>
      </View>
    </>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      {content}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: AgriColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  artwork: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  wash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 251, 234, 0.82)',
  },
  mark: {
    alignItems: 'center',
    gap: 4,
  },
  markCard: {
    padding: 10,
    borderRadius: AgriRadius.large,
    borderWidth: 2,
    backgroundColor: AgriColors.surface,
  },
  markImage: {
    width: 96,
    height: 96,
  },
  name: {
    ...AgriTypography.title,
    color: AgriColors.primaryDark,
    marginTop: 14,
  },
  tagline: {
    ...AgriTypography.body,
    color: AgriColors.textSecondary,
  },
});
