import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { BuyerCard } from '@/components/buyers/buyer-card';
import { ContactBuyerSheet } from '@/components/buyers/contact-buyer-sheet';
import { CropDemandCard } from '@/components/buyers/crop-demand-card';
import { CropFilterRow } from '@/components/buyers/crop-filter-row';
import { DistanceFilterRow } from '@/components/buyers/distance-filter-row';
import { FormAlert } from '@/components/ui/form-alert';
import { SearchField } from '@/components/ui/search-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_BUYERS,
  DEMO_HARVEST_LOTS,
  contactTargetFor,
  createSaleRequest,
  distanceFilterLabel,
  formatQuintals,
  type Buyer,
  type ContactChannel,
  type ContactTarget,
  type DistanceFilter,
} from '@/models/buyer-connection';
import {
  cropDemand,
  DEMO_BUYER_CROPS,
  describeBuyerResults,
  filterBuyers,
} from '@/models/buyers';
import { findCrop } from '@/models/crop-journal';

/**
 * 🛒 Buyers, a directory of everyone buying produce near the farm.
 *
 * This is the browsing question, and it is the mirror image of Buyer Connection:
 * instead of starting from what the farmer has ready, it starts from who is out
 * there and what they want. The buyers are the same ones, so a rate seen here is
 * the same rate that shows up on the other screen.
 *
 * The screen is built around one list and three filters, all of which narrow that
 * same list, so the count under the search box always describes the cards below it:
 *
 * 1. 🔎 Search — matches a buyer's name, kind, town, contact person, phone number,
 *    pickup and payment, and the crops they buy. "rice", "Kumar" and "12" all work.
 * 2. 🌱 Crop Required — one button per crop, each carrying how many buyers want it.
 * 3. 📍 Buyer Location — the area buttons, so a rate 26 km away can be ruled out
 *    before it is compared with one next door.
 *
 * Below the filters, 🌱📦💰 adds the visible buyers together per crop, and 🌾 Buyer
 * List shows the buyers themselves, nearest first. Tapping one opens 📞 Contact
 * Buyer.
 *
 * Everything comes from `models/buyer-connection.ts` and `models/buyers.ts`. Nothing
 * is sent anywhere, so the requests recorded from the contact sheet are counted in
 * the notice and then discarded; when the backend is ready they become a POST and
 * the shapes stay the same.
 */
export default function BuyersScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  // `null` means every crop, which is how the screen opens.
  const [cropId, setCropId] = useState<string | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('all');
  const [contactTarget, setContactTarget] = useState<ContactTarget | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // One list drives the count, the summary and the cards, so the three can never
  // describe different sets of buyers.
  const visibleBuyers = useMemo(
    () =>
      filterBuyers(DEMO_BUYERS, {
        query,
        cropId,
        distance: distanceFilter,
      }),
    [query, cropId, distanceFilter]
  );

  const demand = useMemo(
    () => cropDemand(visibleBuyers, DEMO_HARVEST_LOTS),
    [visibleBuyers]
  );

  const resultLine = describeBuyerResults(visibleBuyers.length, DEMO_BUYERS.length, {
    query,
    cropId,
    cropLabel: cropId ? (findCrop(DEMO_BUYER_CROPS, cropId)?.name ?? null) : null,
    distanceLabel: distanceFilterLabel(distanceFilter),
  });

  /** Opens 📞 Contact Buyer for one buyer, for the crop in view when there is one. */
  function handleBuyerPress(buyer: Buyer) {
    const target = contactTargetFor(buyer, cropId, DEMO_HARVEST_LOTS);

    if (!target) {
      return;
    }

    setNotice(null);
    setContactTarget(target);
  }

  /**
   * Records the request when a contact button is pressed.
   *
   * Nothing leaves the phone in demo mode. The request is still built by the model,
   * which is the shape the POST will take once the backend can receive it, and the
   * notice says plainly that it has only been recorded locally.
   */
  function handleContact(target: ContactTarget, channel: ContactChannel) {
    const request = createSaleRequest(target, channel);

    setContactTarget(null);
    setNotice(
      `📞 ${channel} request recorded for ${request.buyerName}, ${formatQuintals(
        request.quantityKg
      )} at ${request.pricePerQuintal} per quintal. Demo mode, so nothing has been sent yet — Buyer Connection keeps the full request list.`
    );
  }

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Buyers"
              subtitle={`${DEMO_BUYERS.length} buyers near your farm · ${DEMO_BUYER_CROPS.length} crops in demand`}
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="buyers-screen"
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {/* 🔎 Search */}
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder="Search buyers, towns or crops"
              accessibilityLabel="Search buyers, towns or crops"
              testID="buyers-search"
            />

            {/* 🌱 Crop Required */}
            <View style={styles.filterBlock}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>🌱 Crop Required</Text>
              <CropFilterRow value={cropId} onChange={setCropId} buyers={DEMO_BUYERS} />
            </View>

            {/* 📍 Buyer Location */}
            <View style={styles.filterBlock}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>📍 Buyer Location</Text>
              <Text style={[styles.filterHint, { color: colors.textSecondary }]}>
                How far you are willing to send your produce. Narrowing the area narrows the best
                rate below, so a distant buyer is never counted as the top offer by accident.
              </Text>
              <DistanceFilterRow value={distanceFilter} onChange={setDistanceFilter} />
            </View>

            <Text style={[styles.resultLine, { color: colors.textSecondary }]}>{resultLine}</Text>

            {notice ? <FormAlert tone="info" message={notice} testID="buyers-notice" /> : null}

            {/* 🌱📦💰 What the buyers shown want, added up */}
            <CropDemandCard demand={demand} />

            {/* 🌾 Buyer List */}
            <View style={styles.listBlock}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>🌾 Buyer List</Text>
              <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
                Each card carries 📍 location, 💰 expected price and 📦 required quantity, with the
                📞 number behind the tap.
              </Text>

              {visibleBuyers.length === 0 ? (
                <View style={[styles.empty, { borderColor: colors.border }]}>
                  <Text style={styles.emptyEmoji}>{'🛒'}</Text>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No buyers to show</Text>
                  <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                    Try a wider area under 📍 Buyer Location, another crop under 🌱 Crop Required, or
                    clear the search box.
                  </Text>
                </View>
              ) : (
                visibleBuyers.map((buyer) => (
                  <BuyerCard
                    key={buyer.id}
                    buyer={buyer}
                    crops={DEMO_BUYER_CROPS}
                    onPress={handleBuyerPress}
                  />
                ))
              )}
            </View>

            <Text style={[styles.footnote, { color: colors.textSecondary }]}>
              Demo data only. Rates and quantities are made up for the area, nothing is dialled or
              sent from this page, and a buyer pays for a lot on its own terms. Check the quantity
              and rate with them before you load anything.
            </Text>
          </View>
        </ScrollView>

        <ContactBuyerSheet
          target={contactTarget}
          crops={DEMO_BUYER_CROPS}
          onClose={() => setContactTarget(null)}
          onContact={handleContact}
        />
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
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  filterBlock: {
    gap: Spacing.one,
  },
  filterTitle: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  filterHint: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  resultLine: {
    ...AgriTypography.caption,
  },
  listBlock: {
    gap: Spacing.two,
  },
  sectionTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  sectionHint: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.large,
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
  footnote: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
});
