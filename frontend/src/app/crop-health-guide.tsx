import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { CropHealthOverviewCard } from '@/components/crop-health/crop-health-overview-card';
import { CropHealthSearchResultCard } from '@/components/crop-health/crop-health-search-result-card';
import { CropSelectCard } from '@/components/crop-health/crop-select-card';
import { PreventionTipsCard } from '@/components/crop-health/prevention-tips-card';
import { ProblemCard } from '@/components/crop-health/problem-card';
import { ProblemKindCard } from '@/components/crop-health/problem-kind-card';
import { WarningSignsCard } from '@/components/crop-health/warning-signs-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  buildCropHealthSearchIndex,
  CROP_PROBLEMS,
  cropFilterOptions,
  cropNamesWithProblems,
  problemCountForCrop,
  problemsForCrop,
  searchCropHealthContent,
  type CropProblem,
} from '@/models/crop-health';

/**
 * 🐛🍃 Crop Disease & Pest Guide, opened from the 🌱 Farming Guide tab.
 *
 * The screen works the same way the rest of the guide does, so it feels like the
 * same part of the app:
 *
 * - 🔎 The search box and the crop chips are one filter expressed two ways, and
 *   🌱 Select Crop writes the same value, so the page never disagrees with itself
 *   about which crop is on screen. With an empty box the sections below show;
 *   once the farmer types, the sections are replaced by matching results. The
 *   index covers every table on the page, so "borer", "yellowing" and "tomato"
 *   all work from one box, and a result that is a problem is shown as the full
 *   clickable card.
 * - 🌱 The crop starts on whatever the farmer already has saved on their profile,
 *   so the page opens on something relevant instead of an empty list. If that
 *   crop is not covered here, the filter opens on "All crops" rather than on a
 *   page with nothing in it.
 * - 🐛🍃 Pest Information and Disease Information teach the farmer how to tell the
 *   two families apart, which is the decision that comes before any treatment.
 *
 * The content is educational only. There are no chemical names, no mixtures and
 * no dosages anywhere on this screen, and the amber notice at the top of the
 * overview card says so plainly, because those decisions belong to the local
 * agricultural officer and to the product label rather than to an app.
 */
export default function CropHealthGuideScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useFarmerProfile();

  const crops = cropNamesWithProblems();
  const filterOptions = cropFilterOptions(crops);

  // The filter opens on the farmer's own main crop when this guide covers it, and
  // on "All crops" when it does not, so the page is never empty on arrival.
  const [crop, setCrop] = useState(() =>
    crops.includes(profile.mainCrop) ? profile.mainCrop : ''
  );
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  // The index is only built when there is something to search for, so opening the
  // page does no search work at all.
  const searchIndex = useMemo(
    () => (isSearching ? buildCropHealthSearchIndex() : []),
    [isSearching]
  );
  const results = isSearching ? searchCropHealthContent(trimmedQuery, crop, searchIndex) : [];

  const problems = problemsForCrop(crop);

  /**
   * Changes the crop and closes whichever card was open.
   *
   * The list under the filter changes completely when the crop changes, so an
   * expanded card would otherwise stay open on a problem that is no longer on the
   * page.
   */
  function handleCropChange(nextCrop: string) {
    setCrop(nextCrop);
    setExpandedId(null);
  }

  /** Opens the tapped problem and closes whichever one was open before. */
  function handleProblemPress(problem: CropProblem) {
    setExpandedId((current) => (current === problem.id ? null : problem.id));
  }

  return (

    <PaddyBackground>
      <View style={styles.flex}>

        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Crop Disease & Pest Guide"
              subtitle="Name the problem, then decide calmly"
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="crop-health-guide-screen"
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {/* 🔎 Search / Filter */}
            <View style={styles.group}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {'\u{1F50D} Search / Filter'}
              </Text>
              <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
                Search a problem, a crop or a sign — or tap a crop to narrow the page.
              </Text>

              <SearchField
                value={query}
                onChangeText={setQuery}
                placeholder="Search problem, crop or sign"
                accessibilityLabel="Search crop disease and pest guide"
                testID="crop-health-search"
              />

              <View style={styles.chips}>
                {filterOptions.map((option) => {
                  const isActive = option.value === crop;
                  const count = problemCountForCrop(option.value);

                  return (
                    <Pressable
                      key={option.value === '' ? 'all-crops' : option.value}
                      testID={`crop-health-filter-${option.value === '' ? 'all' : option.value}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                      accessibilityLabel={`${option.label}, ${count} problems`}
                      onPress={() => handleCropChange(option.value)}
                      style={({ pressed }) => [
                        styles.chip,
                        {
                          backgroundColor: isActive ? colors.primary : colors.surface,
                          borderColor: isActive ? colors.primary : colors.border,
                        },
                        pressed && styles.pressed,
                      ]}>
                      <Text
                        style={[
                          styles.chipText,
                          { color: isActive ? colors.onPrimary : colors.text },
                        ]}>
                        {`${option.label} (${count})`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {isSearching ? (
              <>
                <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                  {results.length === 0
                    ? `No results for "${trimmedQuery}"`
                    : `${results.length} ${results.length === 1 ? 'result' : 'results'} for "${trimmedQuery}"`}
                  {crop === '' ? '' : ` · filtered to ${crop}`}
                </Text>

                {results.length === 0 ? (
                  <View style={[styles.empty, { borderColor: colors.border }]}>
                    <Text style={styles.emptyEmoji}>{'\u{1F50D}'}</Text>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing found</Text>
                    <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                      Try a crop name like Paddy or Tomato, a sign like yellowing, or a word like
                      borer, mildew or prevention. Crops covered include {crops.join(', ')}.
                    </Text>
                  </View>
                ) : (
                  results.map((entry) => {
                    const problem = entry.problemId
                      ? CROP_PROBLEMS.find((item) => item.id === entry.problemId)
                      : undefined;

                    // A result that is a problem keeps its full card, so the warning
                    // signs and the prevention tips can be read straight from a search.
                    return problem ? (
                      <ProblemCard
                        key={entry.id}
                        problem={problem}
                        expanded={expandedId === problem.id}
                        onPress={handleProblemPress}
                      />
                    ) : (
                      <CropHealthSearchResultCard key={entry.id} entry={entry} />
                    );
                  })
                )}
              </>
            ) : (
              <>
                {/* 🐛🍃 What the page covers, and what it will not say */}
                <CropHealthOverviewCard />

                {/* 🌱 Select Crop */}
                <CropSelectCard crop={crop} onCropChange={handleCropChange} />

                {/* 🔍 Common Crop Problems */}
                <View style={styles.group}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {'\u{1F50D} Common Crop Problems'}
                  </Text>
                  <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
                    {crop === ''
                      ? `Every problem in the guide, ${problems.length} in all. `
                      : `What usually troubles ${crop}, ${problems.length} in all. `}
                    Tap a card to open the warning signs and the general prevention tips.
                  </Text>

                  {problems.map((problem) => (
                    <ProblemCard
                      key={problem.id}
                      problem={problem}
                      expanded={expandedId === problem.id}
                      onPress={handleProblemPress}
                    />
                  ))}
                </View>

                {/* 🐛 Pest Information */}
                <ProblemKindCard kind="pest" crop={crop} />

                {/* 🍃 Disease Information */}
                <ProblemKindCard kind="disease" crop={crop} />

                {/* ⚠️ Warning Signs */}
                <WarningSignsCard />

                {/* 💡 General Prevention Tips */}
                <PreventionTipsCard />

                <Text style={[styles.footnote, { color: colors.textSecondary }]}>
                  Covers {CROP_PROBLEMS.length} common problems across {crops.length} crops.
                  Educational information only — no chemical treatments, no mixtures and no
                  dosages. Confirm what you are looking at with your local agricultural officer
                  before treating a field.
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
  group: {
    gap: Spacing.two,
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  chipText: {
    ...AgriTypography.caption,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
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