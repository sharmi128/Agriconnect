import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { CropConditionCard } from '@/components/weather/crop-condition-card';
import { CurrentWeatherCard } from '@/components/weather/current-weather-card';
import { ForecastCard } from '@/components/weather/forecast-card';
import { MetricCard } from '@/components/weather/metric-card';
import { WeatherAdviceCard } from '@/components/weather/weather-advice-card';
import { WeatherAlertCard } from '@/components/weather/weather-alert-card';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { getWeatherReport, type WeatherSeverity } from '@/models/weather';

/** Most urgent first, so the farmer reads the top of the list. */
const SEVERITY_ORDER: Record<WeatherSeverity, number> = {
  severe: 0,
  warning: 1,
  info: 2,
};

/**
 * Weather and Crop Condition, opened from the weather card on the Home
 * dashboard.
 *
 * Every section reads from a single `getWeatherReport()` call in the model, so
 * the demo data can be swapped for a real weather API without touching this
 * screen or any of the cards.
 */
export default function WeatherScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const report = getWeatherReport();

  const alerts = [...report.alerts].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Weather & Crop"
              subtitle="How the weather is affecting your farm"
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="weather-screen"
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {/* 🌤️ Current weather */}
            <CurrentWeatherCard current={report.current} />

            {/* 🌡️ Temperature, 💧 Humidity, 🌧️ Rain chance */}
            <View style={styles.metricRow}>
              {report.current.metrics.map((metric) => (
                <MetricCard key={metric.key} metric={metric} />
              ))}
            </View>

            <WeatherAdviceCard metrics={report.current.metrics} />

            {/* 🌱 Crop condition */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Crop Condition</Text>

            {report.crops.map((condition) => (
              <CropConditionCard key={condition.id} condition={condition} />
            ))}

            {/* ⚠️ Weather alerts */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Weather Alerts</Text>

            {alerts.map((alert) => (
              <WeatherAlertCard key={alert.id} alert={alert} />
            ))}

            {/* 📅 5 day forecast */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>5-Day Forecast</Text>

            <ForecastCard forecast={report.forecast} />
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  sectionTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
});
