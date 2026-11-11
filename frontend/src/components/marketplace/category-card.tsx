import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CategoryArtImage } from '@/components/marketplace/category-art';
import { categoryHref } from '@/components/marketplace/routes';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { listingCountLabel, type MarketplaceCategoryInfo } from '@/models/marketplace';

type CategoryCardProps = {
  category: MarketplaceCategoryInfo;
  /** How many demo listings are behind the category. */
  count: number;
};

/**
 * One row on Marketplace home.
 *
 * The card is split in two, and the split is the whole design: a green header
 * carrying the category's own illustration, its name in white and the number of
 * listings in harvest yellow, sitting on a white body that says in plain words
 * what is inside. The farmer sees five blocks of green and can tell them apart
 * before reading a single word of the description.
 *
 * The header is green and the body is white rather than one pale card, because
 * a farmer scrolling past needs the category to be recognisable at a glance,
 * and colour does that faster than a line of text. Black text stays on the
 * white half, where it is easiest to read.
 *
 * The cards are full-width rows rather than a grid because the descriptions are
 * full sentences, and a sentence fits across a phone but not down a two-column
 * tile.
 */
export function CategoryCard({ category, count }: CategoryCardProps) {
  const colors = useAgriTheme();

  return (
    <Pressable
      testID={`marketplace-category-${category.key}`}
      accessibilityRole="button"
      accessibilityLabel={`${category.title}. ${category.description}. ${listingCountLabel(count)}`}
      onPress={() => router.push(categoryHref(category.key))}
      style={({ pressed }) => [
        styles.card,
        AgriShadows.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      {/* 🟩 The green header: illustration, name, and how much is behind it. */}
      <View style={styles.header}>
        <CategoryArtImage category={category.key} style={StyleSheet.absoluteFill} />

        {/* A flat green wash, so white text on the artwork stays readable. */}
        <View style={[StyleSheet.absoluteFill, styles.headerWash]} />

        <View style={styles.headerRow}>
          <Text style={styles.headerEmoji}>{category.emoji}</Text>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {category.title}
          </Text>

          <View style={styles.countChip}>
            <Text style={styles.countText}>{listingCountLabel(count)}</Text>
          </View>
        </View>
      </View>

      {/* ⬜ The white body: what it is, and the way in. */}
      <View style={styles.body}>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {category.description}
        </Text>

        <View style={styles.footer}>
          <View style={[styles.dot, { backgroundColor: colors.fresh }]} />
          <Text style={[styles.footerText, { color: colors.primary }]}>Browse listings</Text>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>{'\u2192'}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.88,
  },
  /**
   * The green header is shorter than the artwork, so the horizon line sits high
   * enough in the crop that the silhouette is never cut off at the foot.
   */
  header: {
    height: 96,
    justifyContent: 'flex-end',
    backgroundColor: '#2E7D32',
  },
  headerWash: {
    backgroundColor: 'rgba(27, 78, 32, 0.58)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  headerEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  headerTitle: {
    ...AgriTypography.subtitle,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  /** The one place harvest yellow appears on the card, so it means "how many". */
  countChip: {
    marginLeft: 'auto',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: AgriRadius.pill,
    backgroundColor: '#F4C542',
  },
  countText: {
    ...AgriTypography.caption,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    color: '#4A3600',
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  description: {
    ...AgriTypography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  footerText: {
    ...AgriTypography.label,
    fontSize: 13,
    flex: 1,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
  },
  arrow: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    // Nudges the glyph onto the optical centre, which sits right of the box.
    marginLeft: 2,
  },
});
