import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { GuideCategory } from '@/models/guide';

type GuideCategoryCardProps = {
  category: GuideCategory;
  /** How many articles the category holds. */
  count: number;
  /** Flips the chevron when the card is open and showing its articles. */
  expanded?: boolean;
  /**
   * Replaces the article count in the badge, for a section that opens a full
   * screen rather than a list of articles.
   */
  badge?: string;
  /** Spoken hint for the tap. Defaults to the expand and collapse wording. */
  actionHint?: string;
  onPress: (category: GuideCategory) => void;
};

/**
 * One guide section such as Water Management, shown as a wide row so the icon,
 * title and subtitle all sit comfortably on a phone.
 *
 * Tapping the row is what opens the section, so the chevron both advertises that
 * and shows whether it is currently open. The Fertilizer Guide section is the one
 * exception: it opens a screen of its own, so it passes a badge and a hint saying
 * so rather than an article count.
 */
export function GuideCategoryCard({
  category,
  count,
  expanded = false,
  badge,
  actionHint,
  onPress,
}: GuideCategoryCardProps) {
  const colors = useAgriTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityHint={
        actionHint ?? (expanded ? 'Hides the articles in this section' : 'Shows the articles in this section')
      }
      accessibilityLabel={`${category.title}. ${badge ?? `${count} articles`}`}
      onPress={() => onPress(category)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: expanded ? colors.borderStrong : colors.border,
        },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>

      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {category.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {category.subtitle}
        </Text>
      </View>

      <View style={[styles.countBadge, { backgroundColor: colors.primarySoft }]}>
        <Text style={[styles.countText, { color: colors.primaryDark }]}>
          {badge ?? `${count} ${count === 1 ? 'article' : 'articles'}`}
        </Text>
      </View>

      <Text
        style={[
          styles.chevron,
          { color: colors.primary },
          expanded && styles.chevronExpanded,
        ]}>
        {'›'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  subtitle: {
    ...AgriTypography.caption,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AgriRadius.pill,
  },
  countText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    ...AgriTypography.title,
    fontWeight: '700',
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
});
