import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { EmptyState } from '@/components/marketplace/empty-state';
import { MarketplaceHeaderBar } from '@/components/marketplace/marketplace-header-bar';
import { WishlistRow } from '@/components/marketplace/wishlist-row';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMarketplaceSaved } from '@/context/marketplace-context';

/**
 * 🩷 The farmer's saved listings.
 *
 * Everything a farmer has marked on a card, a category page or the details
 * page, in the order they saved it. The list is read from the shared state, so
 * removing something here is the same act as un-tapping a heart on a card, and
 * the heart in the header stays in step with the count.
 *
 * A saved listing is a decision, not a bookmark, so every row can be put
 * straight into the cart from here. That is the next step for almost anything a
 * farmer keeps, and it saves going back to the category to find it again.
 */
export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { wishlistListings, wishlistCount } = useMarketplaceSaved();

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={styles.header}>
          <View style={styles.inner}>
            <MarketplaceHeaderBar
              title="Wishlist"
              subtitle={buildSubtitle(wishlistCount)}
              onBack={() => router.back()}
              testID="marketplace-wishlist-header"
            />
          </View>
        </View>

        <ScrollView
          testID="marketplace-wishlist-screen"
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {wishlistListings.length === 0 ? (
              <EmptyState
                emoji={'\u{1F49B}'}
                title="Nothing saved yet"
                body="Tap the heart on any listing to keep it here, so you can come back and decide between a few of them later."
                actionLabel="Browse the Marketplace"
                onAction={() => router.replace('/(tabs)/marketplace')}
                testID="marketplace-wishlist-empty"
              />
            ) : (
              <>
                {wishlistListings.map((listing) => (
                  <WishlistRow key={listing.id} listing={listing} />
                ))}

                <Text style={styles.note}>
                  Saved on this device. Listings and prices are demo data.
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}

/** "1 listing saved" or "4 listings saved", so the count is never bare. */
function buildSubtitle(count: number): string {
  if (count === 0) {
    return 'Nothing saved yet';
  }

  return count === 1 ? '1 listing saved' : `${count} listings saved`;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  note: {
    ...AgriTypography.caption,
    fontSize: 12,
    color: '#5C5A50',
    textAlign: 'center',
    marginTop: Spacing.two,
  },
});
