import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/auth-header';
import { PaddyBackground } from '@/components/agri/paddy-background';
import { CategoryHero } from '@/components/marketplace/category-hero';
import { EmptyState } from '@/components/marketplace/empty-state';
import { FilterMenu } from '@/components/marketplace/filter-menu';
import { ProductCard } from '@/components/marketplace/product-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  ALL_FILTERS,
  DEMO_MARKETPLACE_LISTINGS,
  filterMarketplaceListings,
  listingCountLabel,
  listingsForCategory,
  marketplaceCategory,
  parseMarketplaceCategory,
  searchMarketplaceListings,
  type MarketplaceFilter,
} from '@/models/marketplace';

/**
 * One category's page: the title, a search bar, a filter, and that category's
 * listings and nothing else.
 *
 * The same screen serves all five categories. Land, machinery, tools, products
 * and fertilizers differ in what their cards show and what the filter offers,
 * not in how the page is built, so the category key in the URL decides all of
 * it and there is no fifth copy of this file to keep in step.
 *
 * Search runs over this category alone, so typing "paddy" on Machinery cannot
 * turn up a bag of seed. The filter narrows the same list on top of the search,
 * which is why the two are applied in that order and counted together.
 *
 * All of it is local demo data. Nothing is sent anywhere.
 */
export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MarketplaceFilter>(ALL_FILTERS);

  const categoryKey = parseMarketplaceCategory(params.category);
  const category = categoryKey ? marketplaceCategory(categoryKey) : null;

  /**
   * This category's listings, once search and filter have both been applied.
   *
   * Deliberately not memoised: a category holds a handful of demo listings, so
   * filtering them again on each render is cheaper than the bookkeeping.
   */
  const visible = categoryKey
    ? filterMarketplaceListings(
        searchMarketplaceListings(
          listingsForCategory(DEMO_MARKETPLACE_LISTINGS, categoryKey),
          query
        ),
        filter
      )
    : [];

  if (!category) {
    return <UnknownCategory />;
  }

  const isSearching = query.trim() !== '';
  const isFiltered = filter !== ALL_FILTERS;
  const isNarrowed = isSearching || isFiltered;

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <CategoryHero
              category={category}
              topInset={0}
              onBack={() => router.back()}
              subtitle={buildResultLabel({
                count: visible.length,
                query,
                filter,
                isFiltered,
              })}
            />
          </View>
        </View>

        <ScrollView
          testID={`marketplace-category-screen-${category.key}`}
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            <View style={styles.searchRow}>
              <View style={styles.searchField}>
                <SearchField
                  value={query}
                  onChangeText={setQuery}
                  placeholder={`Search ${category.title.toLowerCase()}`}
                  accessibilityLabel={`Search ${category.title}`}
                  testID="marketplace-search"
                />
              </View>

              <FilterMenu
                options={category.filters}
                value={filter}
                onChange={setFilter}
                testID="marketplace-filter-button"
              />
            </View>

            {visible.length === 0 ? (
              <EmptyState
                emoji={category.emoji}
                title={isSearching ? 'No matches found' : `No ${category.title.toLowerCase()} to show`}
                body={isNarrowed ? category.emptyHint : 'Nothing has been listed here yet.'}
                actionLabel={isNarrowed ? 'Clear search and filter' : undefined}
                onAction={isNarrowed ? clearNarrowing : undefined}
                testID="marketplace-empty"
              />
            ) : (
              <>
                {visible.map((listing) => (
                  <ProductCard key={listing.id} listing={listing} />
                ))}

                <Text style={styles.demoNote}>
                  {`${listingCountLabel(visible.length)} shown. Prices, places and phone
                  numbers are demo data for now.`}
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );

  /** Puts the farmer back to the full category from an empty result. */
  function clearNarrowing() {
    setQuery('');
    setFilter(ALL_FILTERS);
  }
}

/**
 * The line above the cards. It names the filter when one is applied, because
 * "4 listings" alone does not tell a farmer whether they are looking at rent or
 * buy, and getting that wrong is expensive.
 */
function buildResultLabel({
  count,
  query,
  filter,
  isFiltered,
}: {
  count: number;
  query: string;
  filter: MarketplaceFilter;
  isFiltered: boolean;
}): string {
  const noun = count === 1 ? 'listing' : 'listings';
  const needle = query.trim();

  if (needle !== '') {
    return isFiltered
      ? `${count} ${noun} for "${needle}" · ${filter}`
      : `${count} ${noun} for "${needle}"`;
  }


  if (isFiltered) {
    return `${count} ${noun} for ${filter.toLowerCase()}`;
  }

  return listingCountLabel(count);
}

/** Shown when the URL names a category that does not exist. */
function UnknownCategory() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader title="Category" onBack={() => router.back()} />
          </View>
        </View>

        <View style={styles.unknownBody}>
          <EmptyState
            emoji="\u{1F3D5}\uFE0F"
            title="Category not found"
            body="This category is not part of the marketplace. Head back and pick one of the five."
            actionLabel="Back to Marketplace"
            onAction={() => router.replace('/(tabs)/marketplace')}
            testID="marketplace-unknown-category"
          />
        </View>
      </View>
    </PaddyBackground>
  );
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  /** Lets the search field take the width the filter button does not. */
  searchField: {
    flex: 1,
  },
  unknownBody: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },
  demoNote: {
    ...AgriTypography.caption,
    fontSize: 12,
    color: '#5C5A50',
    textAlign: 'center',
    marginTop: Spacing.three,
  },
});
