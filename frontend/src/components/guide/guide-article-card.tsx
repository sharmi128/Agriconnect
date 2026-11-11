import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { GUIDE_CATEGORIES, type GuideArticle } from '@/models/guide';

type GuideArticleCardProps = {
  article: GuideArticle;
  onPress: (article: GuideArticle) => void;
};

/**
 * One search result. Shows which section the article belongs to, the crops it
 * covers and how long it takes to read, so a farmer can pick the right one
 * before opening it.
 */
export function GuideArticleCard({ article, onPress }: GuideArticleCardProps) {
  const colors = useAgriTheme();
  const category = GUIDE_CATEGORIES.find((entry) => entry.id === article.category);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${article.title}. ${article.readMinutes} minute read`}
      onPress={() => onPress(article)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{category?.emoji ?? '\u{1F4DA}'}</Text>
        <Text
          style={[styles.category, { color: colors.textSecondary }]}
          numberOfLines={1}>
          {category?.title}
        </Text>
        <Text style={[styles.readTime, { color: colors.textSecondary }]}>
          {article.readMinutes} min
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {article.title}
      </Text>

      <Text style={[styles.summary, { color: colors.textSecondary }]} numberOfLines={2}>
        {article.summary}
      </Text>

      <View style={styles.cropRow}>
        {article.crops.map((crop) => (
          <View
            key={crop}
            style={[styles.cropChip, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.cropText, { color: colors.primaryDark }]}>{crop}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 14,
    lineHeight: 20,
  },
  category: {
    ...AgriTypography.caption,
    fontSize: 12,
    flex: 1,
  },
  readTime: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  summary: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  cropRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.one,
  },
  cropChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  cropText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
});
