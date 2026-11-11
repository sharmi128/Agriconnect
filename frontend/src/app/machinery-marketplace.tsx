import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { FilterTabs } from '@/components/machinery-marketplace/filter-tabs';
import { MachineListingCard } from '@/components/machinery-marketplace/machine-listing-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_MACHINE_LISTINGS,
  filterMachineListings,
  searchMachineListings,
  type MachineFilter,
} from '@/models/machinery-marketplace';

/**
 * 🚜 Machinery Marketplace, opened from the Machinery section of the
 * Marketplace tab.
 *
 * Machinery near the farm, rent or buy, with the facts a farmer compares by —
 * distance, type, price and availability — and a 📞 row that calls the owner
 * straight from the card.
 *
 * Search looks across the machine type, title, place, owner and note, and the
 * All / Rent / Buy pills narrow the same list on top of it, so the two always
 * agree about how many machines are shown.
 *
 * Numbers and phone numbers are local demo data. Nothing is sent anywhere, and
 * the listing shape is what a machinery endpoint is expected to return later.
 */
export default function MachineryMarketplaceScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MachineFilter>('all');

  const searched = searchMachineListings(DEMO_MACHINE_LISTINGS, query);
  const visible = filterMachineListings(searched, filter);

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Machinery Marketplace"
              subtitle={`${DEMO_MACHINE_LISTINGS.length} machines near the farm · ${visible.length} shown`}
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="machinery-marketplace-screen"
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder="Search machines, types or owners"
              accessibilityLabel="Search machinery marketplace"
              testID="machinery-marketplace-search"
            />

            <FilterTabs value={filter} onChange={setFilter} />

            {visible.length === 0 ? (
              <View style={[styles.empty, { borderColor: colors.border }]}>
                <Text style={styles.emptyEmoji}>{'\u{1F69C}'}</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No machinery to show</Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  Try a different search, or switch the rent / buy filter.
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                  {visible.length === 1
                    ? `1 machine for ${filter === 'all' ? 'rent or buy' : filter.toLowerCase()}`
                    : `${visible.length} machines for ${
                        filter === 'all' ? 'rent or buy' : filter.toLowerCase()
                      }`}
                </Text>

                {visible.map((listing) => (
                  <MachineListingCard key={listing.id} listing={listing} />
                ))}

                <Text style={[styles.demoNote, { color: colors.textSecondary }]}>
                  All machines and phone numbers are demo data for now.
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