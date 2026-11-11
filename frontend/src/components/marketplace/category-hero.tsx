import { StyleSheet, Text, View } from 'react-native';

import { CategoryArtImage } from '@/components/marketplace/category-art';
import { MarketplaceHeaderBar } from '@/components/marketplace/marketplace-header-bar';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import type { MarketplaceCategoryInfo } from '@/models/marketplace';

type CategoryHeroProps = {
  category: MarketplaceCategoryInfo;
  /** Pads the top of the band by the safe-area inset plus this much. */
  topInset: number;
  onBack: () => void;
  /** The count line, so the farmer knows how much is behind this page. */
  subtitle: string;
};

/**
 * The green band at the top of a category page.
 *
 * It carries the category's own illustration rather than the general paddy
 * field, so the page says which of the five this is before the title is read:
 * a farmer who tapped 🚜 Machinery sees a tractor in the header, not the same
 * field that is on all the other categories.
 *
 * The wash is a flat green over the artwork, the same treatment as the
 * Marketplace home hero, so the five category pages and the home screen are
 * visibly one family.
 */
export function CategoryHero({ category, topInset, onBack, subtitle }: CategoryHeroProps) {
  return (
    <View style={[styles.band, { paddingTop: topInset + Spacing.two }]}>
      <CategoryArtImage category={category.key} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.wash]} />

      <MarketplaceHeaderBar
        tone="onPrimary"
        title={category.title}
        subtitle={subtitle}
        onBack={onBack}
        testID={`marketplace-category-header-${category.key}`}
      />

      <View style={styles.footer}>
        <Text style={styles.emoji}>{category.emoji}</Text>
        <Text style={styles.blurb}>{category.blurb}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
    overflow: 'hidden',
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  wash: {
    backgroundColor: 'rgba(27, 78, 32, 0.62)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  blurb: {
    ...AgriTypography.body,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.92)',
    flex: 1,
  },
});
