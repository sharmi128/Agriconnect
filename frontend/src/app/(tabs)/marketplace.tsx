import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GreenHero } from '@/components/agri/green-hero';
import { PaddyBackground } from '@/components/agri/paddy-background';
import { CategoryCard } from '@/components/marketplace/category-card';
import { MarketplaceHeaderBar } from '@/components/marketplace/marketplace-header-bar';
import { searchHref } from '@/components/marketplace/routes';
import { ThankYouNavCard } from '@/components/marketplace/thank-you-nav-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriTypography } from '@/constants/agri-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_MARKETPLACE_LISTINGS,
  MARKETPLACE_CATEGORIES,
  categoryCount,
  listingCountLabel,
} from '@/models/marketplace';

/**
 * 🛒 Marketplace home: the five categories, and one card that is not a category.
 *
 * There are no products on this screen. That is the whole design. The old
 * version put a scrolling strip of category tabs above a mixed list, so the
 * farmer saw a plot of land, a tractor and a bag of fertilizer competing for
 * the same space, and a plot they cared about could be below the fold while a
 * transplanter was not.
 *
 * Now the question a farmer arrives with — "do I need land, or a machine, or
 * seed?" — is answered by picking a card. Everything else is one tap further
 * in, on a screen that only has that one kind of thing on it.
 *
 * The green hero across the top holds the title, the farmer's wishlist and cart
 * so both saved lists are one tap away from anywhere in the marketplace, and
 * the search bar. The bar does not filter this screen — there is nothing on it
 * to filter — it opens a search across every listing, so the five categories
 * stay the only things on the home screen.
 *
 * Below the categories, after the category group has closed, the "Thank You 🌾"
 * card opens the Thank You, Farmer page. It is there because that page is part
 * of how the marketplace talks to the farmer, not because it is something to
 * buy, which is also why it gets its own space instead of a sixth category slot.
 *
 * All of it is local demo data. There is no API call behind these cards yet.
 */
export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();

  return (
    <PaddyBackground>
      <ScrollView
        testID="marketplace-screen"
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
        ]}>
        <View style={styles.inner}>
          <GreenHero
            header={<MarketplaceHeaderBar tone="onPrimary" testID="marketplace-home-header" />}
            eyebrow="AGRICONNECT MARKETPLACE"
            title="What are you looking for?"
            subtitle="Pick a category and you will see only what is inside it."
            topInset={insets.top + Spacing.two}
            testID="marketplace-home-hero">
            <View style={styles.heroSearch}>
              <SearchField
                value=""
                onChangeText={() => undefined}
                onPress={() => router.push(searchHref())}
                placeholder="Search land, machines, seeds"
                accessibilityLabel="Search all marketplace listings"
                testID="marketplace-home-search"
              />
            </View>

            <View style={styles.heroStats}>
              <HeroStat value={`${MARKETPLACE_CATEGORIES.length}`} label="Categories" />
              <HeroStat
                value={`${DEMO_MARKETPLACE_LISTINGS.length}`}
                label="Listings"
                divided
              />
            </View>
          </GreenHero>

          <View style={styles.list}>
            <Text style={styles.listTitle}>Browse by category</Text>

            {MARKETPLACE_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.key}
                category={category}
                count={categoryCount(DEMO_MARKETPLACE_LISTINGS, category.key)}
              />
            ))}
          </View>

          {/*
            🌾 The Thank You, Farmer page is the one screen in the app that is not
            about buying anything, so it does not belong with the categories. It
            sits below them, after the category group has closed, and opens the
            page that is already in the app.
          */}
          <View style={styles.more}>
            <ThankYouNavCard />
          </View>

          <Text style={styles.demoNote}>
            {`Listings, prices and phone numbers are demo data. ${listingCountLabel(
              DEMO_MARKETPLACE_LISTINGS.length
            )} across five categories.`}
          </Text>
        </View>
      </ScrollView>
    </PaddyBackground>
  );
}

/**
 * One count in the hero band. The divider is passed in rather than drawn by the
 * parent so the two stats stay the same shape whatever else is on the line.
 */
function HeroStat({
  value,
  label,
  divided = false,
}: {
  value: string;
  label: string;
  divided?: boolean;
}) {
  const colors = useAgriTheme();

  return (
    <View style={[styles.stat, divided && styles.statDivided]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>

      {divided ? <View style={[styles.statRule, { backgroundColor: colors.onPrimary }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  heroSearch: {
    marginTop: Spacing.three,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  stat: {
    position: 'relative',
    paddingLeft: Spacing.two,
  },
  statDivided: {
    paddingLeft: 0,
    paddingRight: Spacing.three,
  },
  statValue: {
    ...AgriTypography.title,
    fontSize: 22,
    lineHeight: 28,
    color: '#F4C542',
  },
  statLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  /** Sits between the two stats, running the height of the taller one. */
  statRule: {
    position: 'absolute',
    left: 0,
    top: 2,
    bottom: 2,
    width: 1,
    opacity: 0.3,
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  listTitle: {
    ...AgriTypography.subtitle,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: Spacing.one,
  },
  more: {
    // The same horizontal inset as the category list, so the card lines up with
    // the five cards above it instead of breaking the column.
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  demoNote: {
    ...AgriTypography.caption,
    fontSize: 12,
    color: '#5C5A50',
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.four,
  },
});
