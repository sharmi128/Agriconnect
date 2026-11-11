import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { WeatherMetric } from '@/models/weather';

type WeatherAdviceCardProps = {
  metrics: WeatherMetric[];
};

/**
 * Turns the numbers above into things a farmer can act on.
 *
 * A humidity reading of 65% means nothing on its own. This card spells out what
 * it means for the crops, which is the part that actually changes decisions.
 */
export function WeatherAdviceCard({ metrics }: WeatherAdviceCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.primaryDark }]}>What this means</Text>

      {metrics.map((metric) => (
        <View key={metric.key} style={styles.row}>
          <Text style={styles.emoji}>{metric.emoji}</Text>
          <Text style={[styles.note, { color: colors.text }]}>{metric.note}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 14,
    lineHeight: 22,
  },
  note: {
    ...AgriTypography.caption,
    fontWeight: '400',
    flex: 1,
  },
});
