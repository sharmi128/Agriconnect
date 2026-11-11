import { StyleSheet, Text, View } from 'react-native';

import { useAgriTheme } from '@/hooks/use-agri-theme';


type AgriLogoProps = {
  /** Diameter of the round badge in points. Defaults to the Welcome screen size. */
  size?: number;
  /** The emoji shown inside the badge. Defaults to a sheaf of wheat. */
  emoji?: string;
};

/**
 * AgriConnect logo.
 *
 * A wheat emoji on a soft green circle keeps the app asset-free, so there is no
 * image file to maintain and it scales to any screen size.
 */
export function AgriLogo({ size = 128, emoji = '\u{1F33E}' }: AgriLogoProps) {
  const colors = useAgriTheme();

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="AgriConnect logo"
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primarySoft,
          borderColor: colors.border,
        },
      ]}>
      <Text style={[styles.emoji, { fontSize: size * 0.45 }]}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emoji: {
    // Keeps the glyph centred on both platforms.
    textAlign: 'center',
  },
});
