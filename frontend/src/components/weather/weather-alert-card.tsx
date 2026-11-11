import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography, type AgriPalette } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { WeatherAlert, WeatherSeverity } from '@/models/weather';

type WeatherAlertCardProps = {
  alert: WeatherAlert;
};

/**
 * One weather alert.
 *
 * Alerts are ordered by severity on the screen, and each one is tinted so a
 * glance down the list shows which need attention now. The severity word is
 * written out as well, so the colour is never the only signal.
 */
export function WeatherAlertCard({ alert }: WeatherAlertCardProps) {
  const colors = useAgriTheme();
  const { background, text, border } = getSeverityColors(alert.severity, colors);

  return (
    <View
      accessibilityLabel={`${alert.severity} alert. ${alert.title}. ${alert.detail}`}
      style={[
        styles.card,
        { backgroundColor: background, borderColor: border },
      ]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{alert.emoji}</Text>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: text }]}>{alert.title}</Text>
          <Text style={[styles.validFor, { color: text }]} numberOfLines={1}>
            {alert.validFor}
          </Text>
        </View>

        <View style={[styles.severityBadge, { borderColor: border }]}>
          <Text style={[styles.severityText, { color: text }]} numberOfLines={1}>
            {alert.severity}
          </Text>
        </View>
      </View>

      <Text style={[styles.detail, { color: text }]}>{alert.detail}</Text>
    </View>
  );
}

/** Maps an alert severity to its background, text and border colours. */
function getSeverityColors(
  severity: WeatherSeverity,
  colors: AgriPalette
): { background: string; text: string; border: string } {
  if (severity === 'severe') {
    return {
      background: colors.dangerSoft,
      text: colors.danger,
      border: colors.danger,
    };
  }

  if (severity === 'warning') {
    return {
      background: colors.warningSoft,
      text: colors.warning,
      border: colors.warning,
    };
  }

  return {
    background: colors.primarySoft,
    text: colors.primaryDark,
    border: colors.border,
  };
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  validFor: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  severityText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  detail: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});
