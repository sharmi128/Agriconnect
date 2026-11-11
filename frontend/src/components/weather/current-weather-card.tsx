import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { CurrentWeather } from '@/models/weather';

type CurrentWeatherCardProps = {
  current: CurrentWeather;
};

/**
 * The hero card at the top of the Weather screen.
 *
 * It is painted in solid brand green so it reads as the headline of the page,
 * matching the weather card on the Home dashboard.
 */
export function CurrentWeatherCard({ current }: CurrentWeatherCardProps) {
  const colors = useAgriTheme();
  const textColor = colors.onPrimary;

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`Current weather. ${current.condition}, ${current.temperature}`}
      style={[styles.card, { backgroundColor: colors.primary }]}>
      <View style={styles.topRow}>
        <Text style={styles.emoji}>{current.emoji}</Text>

        <View style={styles.currentText}>
          <Text style={[styles.temperature, { color: textColor }]}>
            {current.temperature}
          </Text>
          <Text style={[styles.condition, { color: textColor }]}>{current.condition}</Text>
          <Text style={[styles.location, { color: textColor }]} numberOfLines={1}>
            {'\u{1F4CD}'} {current.location}
          </Text>
        </View>
      </View>

      <View style={[styles.rangeRow, { borderTopColor: `${textColor}33` }]}>
        <Reading label="Feels like" value={current.feelsLike} textColor={textColor} />
        <Reading label="High" value={current.high} textColor={textColor} />
        <Reading label="Low" value={current.low} textColor={textColor} />
      </View>

      <Text style={[styles.updated, { color: textColor }]}>{current.updatedAt}</Text>
    </View>
  );
}

type ReadingProps = {
  label: string;
  value: string;
  textColor: string;
};

/** One small reading in the hero card. */
function Reading({ label, value, textColor }: ReadingProps) {
  return (
    <View style={styles.reading}>
      <Text style={[styles.readingValue, { color: textColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[styles.readingLabel, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: AgriRadius.large,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  emoji: {
    fontSize: 52,
    lineHeight: 62,
  },
  currentText: {
    flex: 1,
    gap: 2,
  },
  temperature: {
    ...AgriTypography.heroTitle,
  },
  condition: {
    ...AgriTypography.subtitle,
  },
  location: {
    ...AgriTypography.caption,
    marginTop: 2,
  },
  rangeRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  reading: {
    flex: 1,
    gap: 2,
  },
  readingValue: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  readingLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  updated: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
});
