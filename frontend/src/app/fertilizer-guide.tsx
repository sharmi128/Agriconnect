import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { CropPickerCard } from '@/components/fertilizer/crop-picker-card';
import { FertilizerOverviewCard } from '@/components/fertilizer/fertilizer-overview-card';
import { FertilizerSearchResultCard } from '@/components/fertilizer/fertilizer-search-result-card';
import { FertilizerTypeCard } from '@/components/fertilizer/fertilizer-type-card';
import { GrowthStageCard } from '@/components/fertilizer/growth-stage-card';
import { GuidanceCard } from '@/components/fertilizer/guidance-card';
import { SafetyTipsCard } from '@/components/fertilizer/safety-tips-card';
import { SoilWaterCard } from '@/components/fertilizer/soil-water-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { CROP_STAGE_ORDER } from '@/models/crop-journal';
import type { CropStage } from '@/models/farm';
import {
  buildFertilizerSearchIndex,
  cropNamesWithNotes,
  FERTILIZER_TYPES,
  getFertilizerGuide,
  searchFertilizerContent,
  type FertilizerType,
  type FertilizerTypeId,
} from '@/models/fertilizer-guide';

/**
 * 🧪 Fertilizer Guide, opened from the Fertilizer Guide card on the Farming Guide
 * tab.
 *
 * The screen works the same way the Farming Guide tab does, so the two feel like
 * the same part of the app:
 *
 * - 🔎 The search box is at the top. With an empty box the sections below show;
 *   once the farmer types, the sections are replaced by matching results. The
 *   search index covers every table on the page, so "compost", "nitrogen" and
 *   "paddy" all work from the same box.
 * - 🌱🌿 The crop and growth stage pickers drive the two notes on the page. The
 *   crop starts on whatever the farmer already has saved on their profile, and
 *   the stage starts at the beginning of the season, so the page opens on
 *   something relevant rather than an empty dropdown.
 * - 🧪 The four fertilizer types are collapsed to one line each and expand in
 *   place, the same gesture as a Farming Guide category.
 *
 * The content is educational only. There are no fertilizer or chemical dosages
 * anywhere on this screen, and the amber notice on the overview card says so
 * plainly, because the numbers belong to the local agricultural expert and the
 * product label rather than to an app.
 */
export default function FertilizerGuideScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useFarmerProfile();

  const guide = getFertilizerGuide();

  // The crop opens on the farmer's own main crop, and the stage on the first
  // stage of the season, so the notes are never blank on arrival.
  const [crop, setCrop] = useState(() => profile.mainCrop || guide.cropNotes[0]?.crop || '');
  const [stage, setStage] = useState<CropStage>(() => CROP_STAGE_ORDER[0]);
  const [query, setQuery] = useState('');
  const [expandedType, setExpandedType] = useState<FertilizerTypeId | null>(null);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;
  const sampleCrops = cropNamesWithNotes().slice(0, 5).join(', ');

  // The index is only built when there is something to search for, so opening
  // the page does no search work at all.
  const searchIndex = useMemo(
    () => (isSearching ? buildFertilizerSearchIndex() : []),
    [isSearching]
  );
  const results = isSearching ? searchFertilizerContent(trimmedQuery, searchIndex) : [];

  /** Opens the tapped type and closes whichever one was open before. */
  function handleTypePress(type: FertilizerType) {
    setExpandedType((current) => (current === type.id ? null : type.id));
  }

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Fertilizer Guide"
              subtitle="Understand your inputs before you buy them"
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="fertilizer-guide-screen"
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {/* 🔎 Search fertilizer or crop */}
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder="Search fertilizer or crop"
              accessibilityLabel="Search fertilizer or crop"
              testID="fertilizer-search"
            />

            {isSearching ? (
              <>
                <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                  {results.length === 0
                    ? `No results for "${trimmedQuery}"`
                    : `${results.length} ${results.length === 1 ? 'result' : 'results'} for "${trimmedQuery}"`}
                </Text>

                {results.length === 0 ? (
                  <View style={[styles.empty, { borderColor: colors.border }]}>
                    <Text style={styles.emptyEmoji}>{'\u{1F50D}'}</Text>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing found</Text>
                    <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                      Try compost, nitrogen, water or safety. Crops covered include{' '}
                      {sampleCrops}.
                    </Text>
                  </View>
                ) : (
                  results.map((entry) => (
                    <FertilizerSearchResultCard key={entry.id} entry={entry} />
                  ))
                )}
              </>
            ) : (
              <>
                {/* 🧪 Fertilizer Guide overview */}
                <FertilizerOverviewCard />

                {/* 🌱 Select Crop */}
                <CropPickerCard crop={crop} onCropChange={setCrop} />

                {/* 🌿 Crop Growth Stage */}
                <GrowthStageCard stage={stage} onStageChange={setStage} />

                {/* 💧 Soil & Water Considerations */}
                <SoilWaterCard />

                {/* 🧪 Fertilizer Types */}
                <View style={styles.group}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    🧪 Fertilizer Types
                  </Text>
                  <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
                    Tap a type to read what it does and what goes wrong with it.
                  </Text>

                  {FERTILIZER_TYPES.map((type) => (
                    <FertilizerTypeCard
                      key={type.id}
                      type={type}
                      expanded={expandedType === type.id}
                      onPress={handleTypePress}
                    />
                  ))}
                </View>

                {/* 📋 General fertilizer guidance */}
                <GuidanceCard />

                {/* ⚠️ Safety Tips */}
                <SafetyTipsCard />

                <Text style={[styles.footnote, { color: colors.textSecondary }]}>
                  Covers {guide.cropNotes.length} crops and {FERTILIZER_TYPES.length} fertilizer
                  types. Educational information only — no dosages. Follow your local
                  agricultural expert and the product label for actual application.
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
  group: {
    gap: Spacing.two,
  },
  resultCount: {
    ...AgriTypography.caption,
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
