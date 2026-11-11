import { Image } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useAgriTheme } from '@/hooks/use-agri-theme';

type PaddyBackgroundProps = {
  children?: React.ReactNode;
  /** Applied to the filling view, so a screen can still position itself. */
  style?: ViewStyle;
  /**
   * How far the artwork is washed towards the cream page. The default is the
   * quiet one meant for scrolling lists of cards; `page` is slightly stronger
   * for a screen whose own content is mostly text.
   */
  intensity?: 'subtle' | 'page';
};

/**
 * The page every screen is drawn on: soft cream with the paddy-field artwork
 * washed almost out of it.
 *
 * This is the app's answer to "bright agriculture, not black". The artwork is
 * deliberately close to invisible — it is there so a farmer scrolling a long
 * list can feel the green and the harvest light at the edge of the page, not so
 * they have to read a form against a photograph. The cream wash is what
 * guarantees that: cards stay the brightest thing on screen and text on the
 * cream keeps its contrast.
 *
 * The image sits outside the scroll view, absolutely positioned, so scrolling
 * a list never re-decodes or re-lays it out.
 */
export function PaddyBackground({ children, style, intensity = 'subtle' }: PaddyBackgroundProps) {
  const colors = useAgriTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }, style]}>
      <Image
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        source={require('@/assets/images/paddy-field-soft.png')}
        contentFit="cover"
        transition={0}
      />

      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: intensity === 'page' ? colors.pageScrimStrong : colors.pageScrim },
        ]}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
