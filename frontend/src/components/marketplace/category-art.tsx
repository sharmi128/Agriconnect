import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

import { categoryImageKey, marketplaceImageSource } from '@/models/marketplace-images';
import type { MarketplaceCategory } from '@/models/marketplace';

/**
 * The picture that stands for each Marketplace category.
 *
 * The five cards on Marketplace home, and the band at the top of a category page,
 * show one photograph each — the field, the tractor, the tools, the seed, the
 * fertilizer — so the farmer can recognise a category from the picture before
 * they have read the word on it.
 *
 * The photographs are the same local files the listings themselves use, keyed
 * through the marketplace image registry rather than required here, so a category
 * card can never drift away from the listings underneath it.
 */
type CategoryArtImageProps = {
  category: MarketplaceCategory;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
};

/**
 * The photo for one category, cropped to fill whatever box it is given.
 *
 * Always rendered with `cover`: the shots are wide, and every box they go into —
 * a card header on Marketplace home, a band on a category page — is shorter than
 * the photo, so cropping keeps the subject in frame rather than letterboxing it.
 */
export function CategoryArtImage({ category, style, accessibilityLabel }: CategoryArtImageProps) {
  return (
    <Image
      pointerEvents="none"
      style={style}
      source={categoryArtSource(category)}
      contentFit="cover"
      accessibilityLabel={accessibilityLabel}
      transition={0}
    />
  );
}

/** The raw source, for the few places that need it without the wrapper. */
export function categoryArtSource(category: MarketplaceCategory) {
  return marketplaceImageSource(categoryImageKey(category));
}
