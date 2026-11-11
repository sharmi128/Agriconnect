import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import {
  AddGrowthUpdateForm,
  type GrowthUpdateDraft,
} from '@/components/journal/add-growth-update-form';
import { CropCard } from '@/components/journal/crop-card';
import { ExpectedHarvestCard } from '@/components/journal/expected-harvest-card';
import { GrowthTimeline } from '@/components/journal/growth-timeline';
import { HarvestRecordCard } from '@/components/journal/harvest-record-card';
import { HarvestSummaryCard } from '@/components/journal/harvest-summary-card';
import {
  RecordHarvestForm,
  type HarvestDraft,
} from '@/components/journal/record-harvest-form';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_GROWTH_UPDATES,
  DEMO_HARVEST_RECORDS,
  DEMO_JOURNAL_CROPS,
  createGrowthUpdate,
  createHarvestRecord,
  findCrop,
  harvestsNewestFirst,
  updatesForCrop,
  withCropStage,
  type GrowthUpdate,
  type HarvestRecord,
  type JournalCrop,
} from '@/models/crop-journal';

/**
 * Crop Growth Journal and Harvest, opened from the Harvest card on the Home
 * dashboard.
 *
 * The screen is one long journal for the season:
 *
 * 1. 🌱 My Crops — the crops being tracked, and the one the timeline follows.
 * 2. 📅 Crop Growth Timeline — everything logged against that crop, newest first.
 * 3. 📝 Add Growth Update — the entry form, with 📷 Add Photo.
 * 4. 🌾 Expected Harvest Date — when each crop should be ready.
 * 5. ⚖️💰 Harvest — the season's totals, and the form that records a harvest.
 * 6. 📋 Harvest History — every harvest already recorded.
 *
 * The journal lives in this screen's state and starts from the demo data in
 * `models/crop-journal.ts`. Nothing is sent anywhere yet, so reloading starts
 * from the demo again; when the Spring Boot backend is ready this state becomes
 * the fetch and the shapes stay exactly as they are.
 */
export default function CropJournalScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();

  // The demo data is readonly, so each list is copied before it becomes state.
  const [crops, setCrops] = useState<JournalCrop[]>(() => [...DEMO_JOURNAL_CROPS]);
  const [updates, setUpdates] = useState<GrowthUpdate[]>(() => [...DEMO_GROWTH_UPDATES]);
  const [harvests, setHarvests] = useState<HarvestRecord[]>(() => [...DEMO_HARVEST_RECORDS]);
  // The first crop is selected on open, so the timeline is never empty on arrival.
  const [selectedCropId, setSelectedCropId] = useState<string>(DEMO_JOURNAL_CROPS[0].id);

  const selectedCrop = findCrop(crops, selectedCropId);
  const selectedUpdates = updatesForCrop(updates, selectedCropId);
  const harvestHistory = harvestsNewestFirst(harvests);

  /**
   * Logs a growth update.
   *
   * The crop's stage moves to the stage of the update just written, because the
   * journal is the record of what actually happened in the field. The crop also
   * becomes the selected one, so the timeline shows the new entry straight away.
   */
  function handleAddUpdate(draft: GrowthUpdateDraft) {
    setUpdates((current) => [
      createGrowthUpdate(draft.cropId, draft.stage, draft.note, draft.photoIds),
      ...current,
    ]);

    setCrops((current) => withCropStage(current, draft.cropId, draft.stage));
    setSelectedCropId(draft.cropId);
  }

  /**
   * Records a harvest.
   *
   * The stage is deliberately left alone: a tomato patch is picked several times
   * while it is still fruiting, so only the farmer saying so in a growth update
   * marks a crop as harvested.
   */
  function handleAddHarvest(draft: HarvestDraft) {
    setHarvests((current) => [
      createHarvestRecord(draft.cropId, draft.quantityKg, draft.value),
      ...current,
    ]);

    setSelectedCropId(draft.cropId);
  }

  const timelineHint = selectedCrop
    ? `${selectedCrop.name} · ${selectedCrop.fieldName} · ${selectedUpdates.length} ${
        selectedUpdates.length === 1 ? 'update' : 'updates'
      }`
    : 'Tap a crop above to see its timeline';

  return (

    <PaddyBackground>
      <View style={styles.flex}>

        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Crop Journal"
              subtitle="Growth updates, photos and harvest records"
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="crop-journal-screen"
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {/* 🌱 My Crops */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🌱 My Crops</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              Tap a crop to follow its timeline below.
            </Text>

            {crops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                isSelected={crop.id === selectedCropId}
                onPress={(next) => setSelectedCropId(next.id)}
              />
            ))}

            {/* 📅 Crop Growth Timeline */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📅 Crop Growth Timeline
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              {timelineHint}
            </Text>

            <GrowthTimeline
              updates={selectedUpdates}
              cropName={selectedCrop?.name ?? 'this crop'}
            />

            {/* 📝 Add Growth Update */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📝 Add Growth Update
            </Text>

            <AddGrowthUpdateForm
              crops={crops}
              selectedCropId={selectedCropId}
              onCropChange={setSelectedCropId}
              onSubmit={handleAddUpdate}
            />

            {/* 🌾 Expected Harvest Date */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🌾 Expected Harvest Date
            </Text>

            {crops.map((crop) => (
              <ExpectedHarvestCard key={crop.id} crop={crop} />
            ))}

            {/* ⚖️ Harvest Quantity and 💰 Harvest Value */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              ⚖️ Harvest Quantity &amp; 💰 Harvest Value
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              Totals are kept in kilograms, whatever unit you record in.
            </Text>

            <HarvestSummaryCard records={harvests} />

            <RecordHarvestForm
              crops={crops}
              selectedCropId={selectedCropId}
              onCropChange={setSelectedCropId}
              onSubmit={handleAddHarvest}
            />

            {/* 📋 Harvest History */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📋 Harvest History
            </Text>

            {harvestHistory.length === 0 ? (
              <View style={[styles.empty, { borderColor: colors.border }]}>
                <Text style={styles.emptyEmoji}>{'📋'}</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  Nothing harvested yet
                </Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  Record a harvest above and it will appear here.
                </Text>
              </View>
            ) : (
              harvestHistory.map((record) => (
                <HarvestRecordCard
                  key={record.id}
                  record={record}
                  crop={findCrop(crops, record.cropId)}
                />
              ))
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
