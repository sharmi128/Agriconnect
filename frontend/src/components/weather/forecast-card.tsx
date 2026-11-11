import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { DailyForecast } from '@/models/weather';

type ForecastCardProps = {
  forecast: DailyForecast[];
};

/**
 * The five day forecast, as a row of equal columns.
 *
 * Each column is `flex: 1` rather than a fixed width, so the row fits any screen
 * without overflowing or leaving a gap on the right.
 */
export function ForecastCard({ forecast }: ForecastCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      accessibilityLabel={`Five day forecast. ${forecast.length} days`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {forecast.map((day) => (
        <View key={day.day} style={styles.day}>
          <Text style={[styles.dayName, { color: colors.text }]} numberOfLines={1}>
            {day.day}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]} numberOfLines={1}>
            {day.date}
          </Text>

          <Text style={styles.emoji}>{day.emoji}</Text>

          <Text style={[styles.condition, { color: colors.textSecondary }]} numberOfLines={1}>
            {day.condition}
          </Text>

          <View style={styles.tempRow}>
            <Text style={[styles.high, { color: colors.text }]}>{day.high}</Text>
            <Text style={[styles.low, { color: colors.textSecondary }]}>{day.low}</Text>
          </View>

          <Text style={[styles.rain, { color: colors.water }]} numberOfLines={1}>
            {'\u{1F327}\uFE0F'} {day.rainChance}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  dayName: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  date: {
    ...AgriTypography.caption,
    fontSize: 11,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
    marginVertical: 2,
  },
  condition: {
    ...AgriTypography.caption,
    fontSize: 11,
  },
  tempRow: {
    flexDirection: 'row',
    gap: 4,
  },
  high: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  low: {
    ...AgriTypography.caption,
    fontSize: 13,
  },
  rain: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
});
