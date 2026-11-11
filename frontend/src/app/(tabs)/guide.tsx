import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { GuideArticleCard } from '@/components/guide/guide-article-card';
import { GuideCategoryCard } from '@/components/guide/guide-category-card';
import { SearchField } from '@/components/ui/search-field';
import { AgriTypography } from '@/constants/agri-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  articlesInCategory,
  CROP_HEALTH_CATEGORY_ID,
  FERTILIZER_CATEGORY_ID,
  GUIDE_ARTICLES,
  GUIDE_CATEGORIES,
  searchGuideArticles,
  type GuideArticle,
  type GuideCategory,
  type GuideCategoryId,
} from '@/models/guide';

/**
 * Farming Guide, the tab that replaces the starter's Explore screen.
 *
 * The screen has two states. With an empty search box it shows the seven topic
 * cards, and tapping one expands it in place to reveal the articles inside that
 * section. Once the farmer types, the cards are replaced by matching articles
 * instead. Searching looks at crop names as well as titles and summaries, so
 * "paddy" and "irrigation" both work.
 *
 * The 🧪 Fertilizer Guide and 🐛 Disease & Pest Guide cards are the two that do
 * not expand. Those topics are too long for a list of articles, so each opens a
 * screen of its own and its badge says "Open guide" rather than counting
 * articles.
 *
 * All content is local demo data. Opening an article is the one thing still to
 * do, so article cards give press feedback but go nowhere for now.
 */
export default function FarmingGuideScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<GuideCategoryId | null>(null);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;
  const results = isSearching ? searchGuideArticles(trimmedQuery) : [];

  /**
   * Opens the tapped section.
   *
   * Six of the eight sections expand in place to reveal their articles, so only
   * one section shows its articles at a time. The Fertilizer Guide and the Crop
   * Disease & Pest Guide are the exceptions: both are screens of their own, so
   * they are pushed instead.
   */
  function handleCategoryPress(category: GuideCategory) {
    if (category.id === FERTILIZER_CATEGORY_ID) {
      router.push('/fertilizer-guide');
      return;
    }

    if (category.id === CROP_HEALTH_CATEGORY_ID) {
      router.push('/crop-health-guide');
      return;
    }

    setExpandedId((current) => (current === category.id ? null : category.id));
  }

  /**
   * Called when an article is tapped.
   *
   * The article screens have not been built yet, and typed routes reject links
   * to files that are not there, so nothing is pushed for now.
   */
  function handleArticlePress(_article: GuideArticle) {
    // TODO: navigate to the article screen when it is built.
  }

  return (
    <PaddyBackground>
      <ScrollView
        testID="farming-guide-screen"
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          },
        ]}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Farming Guide</Text>
            <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>
              {GUIDE_ARTICLES.length} articles across {GUIDE_CATEGORIES.length} topics
            </Text>
          </View>

          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search crops or topics"
            accessibilityLabel="Search farming guide"
            testID="guide-search"
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
                    Try a crop name like Paddy or Tomato, or a topic like water.
                  </Text>
                </View>
              ) : (
                results.map((article) => (
                  <GuideArticleCard
                    key={article.id}
                    article={article}
                    onPress={handleArticlePress}
                  />
                ))
              )}
            </>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse by topic</Text>

              {GUIDE_CATEGORIES.map((category) => {
                const articles = articlesInCategory(GUIDE_ARTICLES, category.id);
                const isExpanded = expandedId === category.id;
                const isFertilizer = category.id === FERTILIZER_CATEGORY_ID;

                // The two guide screens open a page of their own rather than a
                // list of articles, so their badges say so instead of counting
                // articles.
                const opensOwnScreen =
                  isFertilizer || category.id === CROP_HEALTH_CATEGORY_ID;

                return (
                  <View key={category.id} style={styles.group}>
                    <GuideCategoryCard
                      category={category}
                      count={articles.length}
                      expanded={isExpanded}
                      badge={opensOwnScreen ? 'Open guide' : undefined}
                      actionHint={opensOwnScreen ? `Opens the ${category.title}` : undefined}
                      onPress={handleCategoryPress}
                    />

                    {isExpanded ? (
                      <View style={styles.articles}>
                        {articles.map((article) => (
                          <GuideArticleCard
                            key={article.id}
                            article={article}
                            onPress={handleArticlePress}
                          />
                        ))}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
    </PaddyBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  header: {
    gap: 2,
  },
  screenTitle: {
    ...AgriTypography.title,
  },
  screenSubtitle: {
    ...AgriTypography.body,
  },
  sectionTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  resultCount: {
    ...AgriTypography.caption,
  },
  group: {
    gap: Spacing.two,
  },
  articles: {
    gap: Spacing.two,
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
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
