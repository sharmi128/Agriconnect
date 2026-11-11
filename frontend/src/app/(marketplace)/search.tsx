import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { ScreenHeader } from '@/components/agri/screen-header';
import { EmptyState } from '@/components/marketplace/empty-state';
import { ProductCard } from '@/components/marketplace/product-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  DEMO_MARKETPLACE_LISTINGS,
  searchMarketplaceListings,
} from '@/models/marketplace';

/**
 * Search across every listing, whichever category it belongs to.
 *
 * The Marketplace home deliberately has no listings on it, so its search bar
 * opens this screen instead. That keeps the home answering one question — which
 * category — while still letting a farmer who already knows what they want type
 * "tractor" or "urea" once and see it, rather than knowing which of the five
 * categories it must have been filed under.
 *
 * A category page still searches only its own category, because a farmer already
 * looking at Machinery does not want a bag of seed for a "paddy" search. This
 * screen is the deliberate opposite: the whole marketplace, with a note saying
 * so.
 *
 * The search box sits inside the green band rather than below it, so it is the
 * first thing under the heading and the farmer can start typing without
 * scrolling.
 */
export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(typeof params.q === 'string' ? params.q : '');

  const trimmed = query.trim();
  const matches = searchMarketplaceListings(DEMO_MARKETPLACE_LISTINGS, query);

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={styles.header}>
          <View style={styles.inner}>
            <ScreenHeader
              eyebrow="MARKETPLACE"
              title="Search"
              subtitle="Every listing, whatever category it is in"
              topInset={insets.top + Spacing.two}
              testID="marketplace-search-header">
              <View style={styles.searchRow}>
                <SearchField
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search land, machines, seeds, fertilizer"
                  accessibilityLabel="Search all marketplace listings"
                  testID="marketplace-global-search"
                />
              </View>
            </ScreenHeader>
          </View>
        </View>

        <ScrollView
          testID="marketplace-search-screen"
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {matches.length === 0 ? (
              <EmptyState
                emoji={'\u{1F50D}'}
                title="No matches found"
                body="Try a shorter word, a place name, or a seller. Search here looks through every category at once."
                actionLabel={trimmed === '' ? undefined : 'Clear search'}
                onAction={trimmed === '' ? undefined : () => setQuery('')}
                testID="marketplace-search-empty"
              />
            ) : (
              <>
                <Text style={styles.resultCount}>{buildResultLabel(trimmed, matches.length)}</Text>

                {matches.map((listing) => (
                  <ProductCard key={listing.id} listing={listing} />
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}

/**
 * The line above the results. A blank search says what it is showing rather
 * than reporting nothing, because an empty box above a full list looks broken.
 */
function buildResultLabel(query: string, count: number): string {
  const noun = count === 1 ? 'listing' : 'listings';

  if (query === '') {
    return `All ${count} ${noun} across every category`;
  }

  return `${count} ${noun} for "${query}"`;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  searchRow: {
    marginTop: Spacing.two,
  },
  resultCount: {
    ...AgriTypography.caption,
    color: '#5C5A50',
    marginBottom: Spacing.two,
  },
});
