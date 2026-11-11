import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { FeatureCard } from '@/components/dashboard/feature-card';
import { GreetingHeader } from '@/components/dashboard/greeting-header';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { AgriTypography } from '@/constants/agri-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useExpenses } from '@/context/expense-context';
import { useFarm } from '@/context/farm-context';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  buildDashboardFeatures,
  chunk,
  DEMO_WEATHER,
  formatToday,
  getGreeting,
  type DashboardFeature,
} from '@/models/dashboard';
import { monthExpenseCount, monthTotalExpenses } from '@/models/expenses';
import { summarizeFarm } from '@/models/farm';
import { GUIDE_ARTICLES } from '@/models/guide';

/** Number of cards per row. Two fits comfortably on a phone. */
const CARDS_PER_ROW = 2;

/**
 * Home Dashboard, the first tab of the app, at `/home`.
 *
 * It used to be `(tabs)/index`, which put the Home dashboard on the root URL `/`.
 * That made two routes claim the same path — this one and the app's entry point —
 * and Expo Router resolved the tie inside the tabs group, so the app opened on
 * Home and the Welcome screen was never shown on a first launch. Home keeps the
 * same screen and the same first position in the tab bar; only its URL changed,
 * which leaves `/` to `src/app/index.tsx` on its own.
 *
 * It greets the farmer, shows a weather summary, and then the feature cards. The
 * farmer's name and main crop are read from the shared profile, and the My Farm
 * and Expenses cards are worked out from the farmer's own saved fields and
 * entries, so recording a field or an expense updates this screen too.
 */
export default function HomeScreen() {
  const colors = useAgriTheme();
  const { profile } = useFarmerProfile();
  const { farm } = useFarm();
  const { expenses } = useExpenses();
  const insets = useSafeAreaInsets();

  // Recomputed only when the fields or the entries change, not on every render.
  const records = useMemo(
    () => ({
      farmCrops: summarizeFarm(farm.fields).crops,
      monthSpend: monthTotalExpenses(expenses),
      monthEntryCount: monthExpenseCount(expenses),
    }),
    [farm.fields, expenses]
  );

  const features = buildDashboardFeatures(
    profile.mainCrop,
    GUIDE_ARTICLES.length,
    records
  );

  /**
   * Called when a feature card is tapped.
   *
   * Weather gets its own card above this grid, and every card here opens its real
   * screen: My Farm and the Farming Guide are tabs, so pushing their hrefs
   * switches to those tabs, and the rest push their pages.
   */
  function handleFeaturePress(feature: DashboardFeature) {
    if (feature.id === 'guide') {
      router.push('/guide');
      return;
    }

    if (feature.id === 'currentCrop') {
      router.push('/farm');
      return;
    }

    if (feature.id === 'expenses') {
      router.push('/expenses');
      return;
    }

    if (feature.id === 'machinery') {
      router.push('/machinery-marketplace');
      return;
    }

    if (feature.id === 'nearbyLand') {
      router.push('/nearby-land');
      return;
    }

    if (feature.id === 'store') {
      router.push('/agri-store');
      return;
    }

    if (feature.id === 'alerts') {
      router.push('/notifications');
      return;
    }

    if (feature.id === 'water') {
      router.push('/water');
      return;
    }

    if (feature.id === 'buyerConnection') {
      router.push('/buyer-connection');
      return;
    }

    if (feature.id === 'harvest') {
      router.push('/harvest');
    }
  }

  return (
    <PaddyBackground>
      <ScrollView
        testID="home-dashboard"
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          },
        ]}>
        <View style={styles.inner}>
          <GreetingHeader
            greeting={`${getGreeting()},`}
            name={profile.name || 'Farmer'}
            date={formatToday()}
          />

          <WeatherCard weather={DEMO_WEATHER} onPress={() => router.push('/weather')} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Farm Today</Text>

          {/* Two cards per row, so the grid stays fluid on any screen width. */}
          {chunk(features, CARDS_PER_ROW).map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.cardRow}>
              {row.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  emoji={feature.emoji}
                  title={feature.title}
                  value={feature.value}
                  caption={feature.caption}
                  onPress={() => handleFeaturePress(feature)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </PaddyBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  sectionTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
});
