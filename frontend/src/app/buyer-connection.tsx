import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { BuyerCard } from '@/components/buyers/buyer-card';
import { BuyerLocationCard } from '@/components/buyers/buyer-location-card';
import { ContactBuyerCard } from '@/components/buyers/contact-buyer-card';
import { ContactBuyerSheet } from '@/components/buyers/contact-buyer-sheet';
import { DistanceFilterRow } from '@/components/buyers/distance-filter-row';
import { HarvestLotCard } from '@/components/buyers/harvest-lot-card';
import { PriceExpectationCard } from '@/components/buyers/price-expectation-card';
import { QuantitySummaryCard } from '@/components/buyers/quantity-summary-card';
import { SaleRequestCard } from '@/components/buyers/sale-request-card';
import { FormAlert } from '@/components/ui/form-alert';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_BUYERS,
  DEMO_HARVEST_LOTS,
  DEMO_SALE_REQUESTS,
  buyersForCrop,
  buyersWithinDistance,
  contactTargetFor,
  createSaleRequest,
  describeRequestCounts,
  distanceFilterLabel,
  formatQuintals,
  requestsNewestFirst,
  totalAvailableKg,
  type Buyer,
  type ContactChannel,
  type ContactTarget,
  type DistanceFilter,
  type HarvestLot,
  type SaleRequest,
} from '@/models/buyer-connection';
import { DEMO_JOURNAL_CROPS, findCrop } from '@/models/crop-journal';

/**
 * Buyer Connection, opened from the Buyer Connection card on the Home dashboard.
 *
 * The screen is one journey, in the order it actually happens in the field:
 *
 * 1. 🌾 My Harvest — what is ready to sell, and what the farmer is asking for it.
 * 2. 🛒 Available Buyers — who wants it, at what rate, nearest first.
 * 3. 📍 Buyer Location — how far the farmer is willing to send it, which narrows
 *    the buyer lists on the screen.
 * 4. 💰 Expected Price — the asking rate next to the best rate on offer.
 * 5. 📦 Crop Quantity — how much is ready, and how much the buyers can take.
 * 6. 📞 Contact Buyer — the numbers, and the three ways to reach them.
 * 7. 📋 My Sales / Buyer Requests — every sale and request, with its status.
 *
 * Tapping a lot in 🌾 My Harvest narrows the buying sections to that crop, and
 * tapping it again shows every crop, so the filter can never get stuck.
 *
 * The buyers, lots and requests all come from `models/buyer-connection.ts`, and the
 * requests live in this screen's state. Nothing is sent anywhere yet, so reloading
 * starts from the demo again; when the Spring Boot backend is ready this state
 * becomes the fetch and the shapes stay exactly as they are.
 */
export default function BuyerConnectionScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();

  // The demo list is readonly, so it is copied before it becomes state.
  const [requests, setRequests] = useState<SaleRequest[]>(() => [...DEMO_SALE_REQUESTS]);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('all');
  // `null` means every crop is shown, which is how the screen opens.
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [contactTarget, setContactTarget] = useState<ContactTarget | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Tapping a lot narrows the buying sections to that crop.
  const visibleLots = selectedCropId
    ? DEMO_HARVEST_LOTS.filter((lot) => lot.cropId === selectedCropId)
    : DEMO_HARVEST_LOTS;

  const buyersForSelection = selectedCropId
    ? buyersForCrop(DEMO_BUYERS, selectedCropId)
    : [...DEMO_BUYERS];

  // One list drives every buying section, so the 📍 filter and the crop picked in
  // 🌾 My Harvest apply to all of them at once and they can never disagree.
  const visibleBuyers = buyersWithinDistance(buyersForSelection, distanceFilter);
  const history = requestsNewestFirst(requests);
  const readyTotal = totalAvailableKg(visibleLots);

  /** Tapping a lot shows its buyers; tapping the same lot again shows every crop. */
  function handleLotPress(lot: HarvestLot) {
    setSelectedCropId((current) => (current === lot.cropId ? null : lot.cropId));
  }

  /** Opens 📞 Contact Buyer for one buyer, for the crop in view when there is one. */
  function handleBuyerPress(buyer: Buyer) {
    const target = contactTargetFor(buyer, selectedCropId, DEMO_HARVEST_LOTS);

    if (!target) {
      return;
    }

    setContactTarget(target);
  }

  /**
   * Records the request when a contact button is pressed.
   *
   * Nothing leaves the phone in demo mode, so the new request simply goes to the
   * top of 📋 My Sales / Buyer Requests and the notice explains what happened. The
   * request itself is built by the model, which is also the shape the POST will
   * take once the backend can receive it.
   */
  function handleContact(target: ContactTarget, channel: ContactChannel) {
    const request = createSaleRequest(target, channel);

    setRequests((current) => [request, ...current]);
    setContactTarget(null);
    setNotice(
      `📞 ${channel} request sent to ${target.buyer.name} for ${formatQuintals(
        request.quantityKg
      )}. It is at the top of 📋 My Sales / Buyer Requests.`
    );
  }

  return (

    <PaddyBackground>
      <View style={styles.flex}>

        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Buyer Connection"
              subtitle={`${visibleLots.length} ${
                visibleLots.length === 1 ? 'crop' : 'crops'
              } ready · ${formatQuintals(readyTotal)} · ${visibleBuyers.length} ${
                visibleBuyers.length === 1 ? 'buyer' : 'buyers'
              } shown`}
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="buyer-connection-screen"
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {/* 🌾 My Harvest */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🌾 My Harvest</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              {selectedCropId
                ? 'Showing the buyers for the crop you picked. Tap it again to go back to every crop.'
                : 'Tap a crop to show only the buyers who want it.'}
            </Text>

            {visibleLots.map((lot) => (
              <HarvestLotCard
                key={lot.id}
                lot={lot}
                crop={findCrop(DEMO_JOURNAL_CROPS, lot.cropId)}
                isSelected={selectedCropId === lot.cropId}
                onPress={handleLotPress}
              />
            ))}

            {/* 🛒 Available Buyers */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🛒 Available Buyers</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              {`${visibleBuyers.length} ${
                visibleBuyers.length === 1 ? 'buyer' : 'buyers'
              } · ${distanceFilterLabel(distanceFilter).toLowerCase()}, nearest first.`}
            </Text>

            {visibleBuyers.length === 0 ? (
              <View style={[styles.empty, { borderColor: colors.border }]}>
                <Text style={styles.emptyEmoji}>{'🛒'}</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No buyers to show</Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  Try a wider area under 📍 Buyer Location, or tap the crop again to see buyers for
                  everything.
                </Text>
              </View>
            ) : (
              visibleBuyers.map((buyer) => (
                <BuyerCard
                  key={buyer.id}
                  buyer={buyer}
                  crops={DEMO_JOURNAL_CROPS}
                  onPress={handleBuyerPress}
                />
              ))
            )}

            {/* 📍 Buyer Location */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📍 Buyer Location</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              How far you are willing to send your produce. This narrows the buyer lists on this
              screen too, so every figure below belongs to the same set of buyers.
            </Text>

            <DistanceFilterRow value={distanceFilter} onChange={setDistanceFilter} />
            <BuyerLocationCard buyers={visibleBuyers} onPress={handleBuyerPress} />

            {/* 💰 Expected Price */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>💰 Expected Price</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              Your asking rate next to the best rate on offer for the same crop, per quintal.
            </Text>

            <PriceExpectationCard
              lots={visibleLots}
              buyers={visibleBuyers}
              crops={DEMO_JOURNAL_CROPS}
            />

            {/* 📦 Crop Quantity */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📦 Crop Quantity</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              {`${formatQuintals(readyTotal)} ready across ${visibleLots.length} ${
                visibleLots.length === 1 ? 'crop' : 'crops'
              }, against what the buyers shown can take.`}
            </Text>

            <QuantitySummaryCard
              lots={visibleLots}
              buyers={visibleBuyers}
              crops={DEMO_JOURNAL_CROPS}
            />

            {/* 📞 Contact Buyer */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📞 Contact Buyer</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              Phone numbers for the buyers shown. Contacting one records the request in 📋 below.
            </Text>

            {notice ? <FormAlert tone="info" message={notice} testID="contact-notice" /> : null}

            {visibleBuyers.map((buyer) => (
              <ContactBuyerCard key={buyer.id} buyer={buyer} onPress={handleBuyerPress} />
            ))}

            {/* 📋 My Sales / Buyer Requests */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📋 My Sales / Buyer Requests
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              {`${history.length} ${history.length === 1 ? 'request' : 'requests'} · ${describeRequestCounts(
                history
              )}`}
            </Text>

            {history.length === 0 ? (
              <View style={[styles.empty, { borderColor: colors.border }]}>
                <Text style={styles.emptyEmoji}>{'📋'}</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No requests yet</Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  Contact a buyer above and the request will appear here.
                </Text>
              </View>
            ) : (
              history.map((request) => (
                <SaleRequestCard
                  key={request.id}
                  request={request}
                  crop={findCrop(DEMO_JOURNAL_CROPS, request.cropId)}
                />
              ))
            )}
          </View>
        </ScrollView>

        <ContactBuyerSheet
          target={contactTarget}
          crops={DEMO_JOURNAL_CROPS}
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
  sectionTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  sectionHint: {
    ...AgriTypography.caption,
    fontWeight: '400',
    // Pulls the hint up under its heading instead of leaving a full gap.
    marginTop: -Spacing.two,
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
});


