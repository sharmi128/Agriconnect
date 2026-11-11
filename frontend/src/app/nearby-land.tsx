import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { FilterTabs } from '@/components/nearby-land/filter-tabs';
import { LandListingCard } from '@/components/nearby-land/land-listing-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_LAND_LISTINGS,
  filterLandListings,
  searchLandListings,
  type LandFilter,
} from '@/models/nearby-land';

/**
 * 🏞️ Nearby Land, opened from the Land section of the Marketplace tab.
 *
 * Land near the farm, rent or buy, with the facts a farmer compares plots by —
 * distance, size, price and the crop it suits — and a 📞 row that calls the
 * owner straight from the card.
 *
 * Search looks across the plot title, place, crop, owner and note, and the All /
 * Rent / Buy pills narrow the same list on top of it, so the two always agree
 * about how many plots are shown.
 *
 * Numbers and phone numbers are local demo data. Nothing is sent anywhere, and
 * the listing shape is what a nearby-land endpoint is expected to return later.
 */
export default function NearbyLandScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LandFilter>('all');

  const searched = searchLandListings(DEMO_LAND_LISTINGS, query);
  const visible = filterLandListings(searched, filter);

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Nearby Land"
              subtitle={`${DEMO_LAND_LISTINGS.length} plots near the farm · ${visible.length} shown`}
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="nearby-land-screen"
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder="Search plots, crops or owners"
              accessibilityLabel="Search nearby land"
              testID="nearby-land-search"
            />

            <FilterTabs value={filter} onChange={setFilter} />

            {visible.length === 0 ? (
              <View style={[styles.empty, { borderColor: colors.border }]}>
                <Text style={styles.emptyEmoji}>{'\u{1F3DE}\uFE0F'}</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No land to show</Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  Try a different search, or switch the rent / buy filter.
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                  {visible.length === 1
                    ? `1 plot for ${filter === 'all' ? 'rent or buy' : filter.toLowerCase()}`
                    : `${visible.length} plots for ${
                        filter === 'all' ? 'rent or buy' : filter.toLowerCase()
                      }`}
                </Text>

                {visible.map((listing) => (
                  <LandListingCard key={listing.id} listing={listing} />
                ))}

                <Text style={[styles.demoNote, { color: colors.textSecondary }]}>
                  All plots and phone numbers are demo data for now.
                </Text>
              </>
            )}
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
  resultCount: {
    ...AgriTypography.caption,
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  emptyEmoji: {
    fontSize: 28,
    lineHeight: 36,
  },
  emptyTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  emptyBody: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
  demoNote: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
});