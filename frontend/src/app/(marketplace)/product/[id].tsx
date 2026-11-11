import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddToCartButton } from '@/components/marketplace/add-to-cart-button';
import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { EmptyState } from '@/components/marketplace/empty-state';
import { ListingImage } from '@/components/marketplace/listing-image';
import { SellerContactDialog } from '@/components/marketplace/seller-contact-dialog';
import { WishlistButton } from '@/components/marketplace/wishlist-button';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_MARKETPLACE_LISTINGS,
  listingBadge,
  listingById,
  listingDetailRows,
  listingOffer,
  marketplaceCategory,
} from '@/models/marketplace';
import { listingImageKey } from '@/models/marketplace-images';

/**
 * 🏷️ Product Details: everything about one listing, on its own screen.
 *
 * A farmer reaches this after comparing cards, so the layout answers the
 * questions in the order they are asked: what is it, what does it cost, where
 * is it, who is selling it, and how do I get hold of them. The description sits
 * under the price because it is the part that takes reading, and the contact
 * button sits at the bottom of the screen where a thumb can reach it once the
 * reading is done.
 *
 * The three decisions a farmer makes here are all on this screen rather than
 * only back on the card: save it, put it in the cart, or contact the seller.
 * They read the same shared state as the card did, so a listing saved or added
 * on the way in is already showing as saved or added.
 *
 * Contact opens a sheet with the seller's name, place and number. It does not
 * open a dialler: there is no backend behind the marketplace yet and the demo
 * numbers are not real lines, so the sheet says so instead of ringing a
 * stranger. That is the one thing on the screen that is deliberately inert.
 */
export default function ProductDetailsScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const listing = params.id
    ? listingById(DEMO_MARKETPLACE_LISTINGS, params.id)
    : undefined;

  if (!listing) {
    return <MissingProduct />;
  }

  const category = marketplaceCategory(listing.category);
  const offer = listingOffer(listing);

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title={category.title}
              subtitle={category.blurb}
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="marketplace-product-screen"
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + Spacing.five },
          ]}>
          <View style={styles.inner}>
            <View
              style={[
                styles.hero,
                AgriShadows.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <ListingImage
                image={listingImageKey(listing.id)}
                tone={listing.tone}
                height={208}
                badge={listingBadge(listing)}
                testID="marketplace-product-image"
              />

              {/* Over the image, matching the heart on the card it was opened from. */}
              <View style={styles.heroWishlist}>
                <WishlistButton listingId={listing.id} size="large" />
              </View>

              <View style={styles.heroBody}>
                <Text style={[styles.name, { color: colors.text }]}>{listing.title}</Text>

                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.text }]}>{listing.price}</Text>

                  {offer ? (
                    <View style={[styles.offer, { backgroundColor: colors.primarySoft }]}>
                      <Text style={[styles.offerText, { color: colors.primaryDark }]}>
                        {offer}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.locationRow}>
                  <Text style={[styles.pin, { color: colors.primary }]}>{'\u{1F4CD}'}</Text>
                  <Text style={[styles.location, { color: colors.textSecondary }]}>
                    {listing.location}
                  </Text>
                </View>
              </View>
            </View>

            <SectionCard
              title="Details"
              subtitle="What a farmer checks before calling"
              testID="marketplace-product-details-card">
              {listingDetailRows(listing).map((row, index) => (
                <View
                  key={row.label}
                  style={[
                    styles.detailRow,
                    // The card already draws a top edge, so only the rows below
                    // the first get a divider between them. A width of zero on
                    // the first keeps its border from falling back to the
                    // default colour, which would be a black line on a cream
                    // screen.
                    index === 0 ? styles.firstDetailRow : { borderTopColor: colors.border },
                  ]}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    {row.label}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{row.value}</Text>
                </View>
              ))}
            </SectionCard>

            <SectionCard
              title="About this listing"
              subtitle={`From ${listing.postedBy}`}
              testID="marketplace-product-description-card">
              <Text style={[styles.description, { color: colors.text }]}>
                {listing.description}
              </Text>
            </SectionCard>

            <AddToCartButton listingId={listing.id} variant="full" />

            <View style={styles.actions}>
              <Button
                label={'\u{1F4DE}  Contact Seller'}
                onPress={() => setIsContactOpen(true)}
                testID="marketplace-contact-seller"
              />

              <Pressable
                testID="marketplace-seller-number"
                accessibilityRole="button"
                accessibilityLabel={`Contact details for ${listing.postedBy}`}
                onPress={() => setIsContactOpen(true)}
                style={({ pressed }) => [
                  styles.secondaryAction,
                  { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.secondaryActionText, { color: colors.text }]}>
                  {`Seller: ${listing.postedBy} \u00B7 ${listing.phone}`}
                </Text>
              </Pressable>
            </View>

            <Text style={[styles.demoNote, { color: colors.textSecondary }]}>
              This listing, its price and the phone number are demo data. Contacting the
              seller is not connected yet.
            </Text>
          </View>
        </ScrollView>

        <SellerContactDialog
          listing={listing}
          visible={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </View>
    </PaddyBackground>
  );
}

/** Shown when the URL names a listing that is not in the demo data. */
function MissingProduct() {
  const insets = useSafeAreaInsets();

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader title="Product Details" onBack={() => router.back()} />
          </View>
        </View>

        <View style={styles.missingBody}>
          <EmptyState
            emoji="\u{1F4D1}\uFE0F"
            title="Listing not found"
            body="This listing is no longer available. Go back to the category to see what is there now."
            actionLabel="Back to Marketplace"
            onAction={() => router.replace('/(tabs)/marketplace')}
            testID="marketplace-product-missing"
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
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  hero: {
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroBody: {
    padding: Spacing.three,
    gap: 8,
  },
  heroWishlist: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
  },
  name: {
    ...AgriTypography.title,
    fontSize: 22,
    lineHeight: 30,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  price: {
    ...AgriTypography.subtitle,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  offer: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: AgriRadius.pill,
  },
  offerText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pin: {
    fontSize: 13,
    lineHeight: 20,
  },
  location: {
    ...AgriTypography.caption,
    fontWeight: '400',
    flexShrink: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderTopWidth: 1,
  },
  firstDetailRow: {
    borderTopWidth: 0,
  },
  detailLabel: {
    ...AgriTypography.body,
    fontWeight: '400',
  },
  detailValue: {
    ...AgriTypography.body,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  description: {
    ...AgriTypography.body,
    lineHeight: 23,
  },
  actions: {
    gap: Spacing.two,
  },
  secondaryAction: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
  },
  secondaryActionText: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
  missingBody: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },
  demoNote: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
});
