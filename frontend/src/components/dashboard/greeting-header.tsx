import { StyleSheet, Text, View } from 'react-native';

import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type GreetingHeaderProps = {
  /** "Good morning", "Good afternoon" or "Good evening". */
  greeting: string;
  /** The farmer's name, from the profile. */
  name: string;
  /** Today's date, for example "Monday, 12 May". */
  date: string;
};

/**
 * The greeting at the very top of the Home dashboard, for example
 * "Good morning, Amina".
 */
export function GreetingHeader({ greeting, name, date }: GreetingHeaderProps) {
  const colors = useAgriTheme();

  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]} numberOfLines={1}>
          {greeting}
        </Text>

        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
      </View>

      <View
        accessibilityRole="image"
        accessibilityLabel="Farmer avatar"
        style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.avatarEmoji}>{'\u{1F468}\u200D\u{1F33E}'}</Text>
      </View>

      <Text style={[styles.date, { color: colors.textSecondary }]} numberOfLines={1}>
        {date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  text: {
    gap: 2,
    // Leaves room for the avatar, which sits in the top-right corner.
    paddingRight: 64,
  },
  greeting: {
    ...AgriTypography.body,
  },
  name: {
    ...AgriTypography.title,
  },
  avatar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  date: {
    ...AgriTypography.caption,
  },
});
