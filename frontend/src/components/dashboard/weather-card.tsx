import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { WeatherSummary } from '@/models/dashboard';

type WeatherCardProps = {
  weather: WeatherSummary;
  /**
   * When provided, the whole card becomes one tap target that opens the full
   * Weather screen. Left out, the card is a read-only summary.
   */
  onPress?: () => void;
};

/**
 * The weather summary at the top of the Home dashboard.
 *
 * It is the only card painted in solid brand green, which makes it the visual
 * anchor of the screen. Every colour comes from the theme, so the card also
 * stays readable in dark mode without any extra work.
 */
export function WeatherCard({ weather, onPress }: WeatherCardProps) {
  const colors = useAgriTheme();
  const textColor = colors.onPrimary;

  const content = (
    <>
      <View style={styles.topRow}>
        <View style={styles.current}>
          <Text style={styles.emoji}>{'\u{1F324}\uFE0F'}</Text>

          <View style={styles.currentText}>
            <Text style={[styles.temperature, { color: textColor }]}>{weather.temperature}</Text>
            <Text style={[styles.condition, { color: textColor }]}>{weather.condition}</Text>
            <Text style={[styles.feelsLike, { color: textColor }]}>
              Feels like {weather.feelsLike}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.statsRow, { borderTopColor: withAlpha(textColor) }]}>
        <Stat
          label="Humidity"
          value={weather.humidity}
          emoji={'\u{1F4A7}'}
          textColor={textColor}
        />
        <Stat
          label="Wind"
          value={weather.wind}
          emoji={'\u{1F32C}\uFE0F'}
          textColor={textColor}
        />
        <Stat
          label="Rain"
          value={weather.rainChance}
          emoji={'\u{1F327}\uFE0F'}
          textColor={textColor}
        />
      </View>

      <View style={[styles.forecastRow, { borderTopColor: withAlpha(textColor) }]}>
        {weather.forecast.map((day) => (
          <View key={day.day} style={styles.forecastDay}>
            <Text style={[styles.forecastLabel, { color: textColor }]}>{day.day}</Text>
            <Text style={styles.forecastEmoji}>{day.icon}</Text>
            <Text style={[styles.forecastTemp, { color: textColor }]}>
              {day.high}
              <Text style={[styles.forecastLow, { color: textColor }]}>{`  ${day.low}`}</Text>
            </Text>
          </View>
        ))}
      </View>
    </>
  );

  // Without `onPress` the card stays a plain summary, exactly as before.
  if (!onPress) {
    return (
      <View
        accessibilityRole="summary"
        accessibilityLabel={`Weather. ${weather.condition}, ${weather.temperature}`}
        style={[styles.card, { backgroundColor: colors.primary }]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Weather. ${weather.condition}, ${weather.temperature}. See full forecast`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.primary },
        pressed && styles.pressed,
      ]}>
      {content}
    </Pressable>
  );
}

type StatProps = {
  label: string;
  value: string;
  emoji: string;
  textColor: string;
};

/** One small reading in the weather card, such as humidity. */
function Stat({ label, value, emoji, textColor }: StatProps) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValue, { color: textColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/**
 * Same colour as the text, but see-through, so the divider lines on the green
 * card stay subtle. React Native cannot apply an alpha to a single element, so
 * a hex value gets a low alpha appended instead. This assumes the theme colour
 * is a six digit hex, which is what `AgriColors` uses.
 */
function withAlpha(hexColor: string): string {
  return `${hexColor}33`;
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: AgriRadius.large,
  },
  pressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flexShrink: 1,
  },
  emoji: {
    fontSize: 44,
    lineHeight: 52,
  },
  currentText: {
    flexShrink: 1,
  },
  temperature: {
    ...AgriTypography.heroTitle,
  },
  condition: {
    ...AgriTypography.subtitle,
  },
  feelsLike: {
    ...AgriTypography.caption,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: {
    fontSize: 16,
  },
  statValue: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  statLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  forecastRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.three,
  },
  forecastDay: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  forecastLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  forecastEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  forecastTemp: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  forecastLow: {
    fontWeight: '400',
  },
});
