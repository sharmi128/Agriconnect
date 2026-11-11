import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { WeatherMetric } from '@/models/weather';

type MetricCardProps = {
  metric: WeatherMetric;
};

/**
 * One compact reading: temperature, humidity or rain chance.
 *
 * These sit three across in a row, so the tile is deliberately small. The
 * plain-language meaning of each reading lives in `WeatherAdviceCard` underneath,
 * where there is room to read it properly.
 */
export function MetricCard({ metric }: MetricCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      accessibilityLabel={`${metric.label}, ${metric.value}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.emoji}>{metric.emoji}</Text>
      </View>

      <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>
        {metric.value}
      </Text>

      <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
        {metric.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 17,
    lineHeight: 22,
  },
  value: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  label: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
});
