import { Image } from 'expo-image';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import type { AgriPalette } from '@/constants/agri-theme';
import { AgriTypography } from '@/constants/agri-theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { marketplaceImageSource, type MarketplaceImageKey } from '@/models/marketplace-images';
import type { ListingTone } from '@/models/marketplace';

type ListingImageProps = {
  /** Which local photograph to draw, from the marketplace image registry. */
  image: MarketplaceImageKey;
  /** Accent for the badge text, so it can follow the listing's own tone. */
  tone: ListingTone;
  /** Height of the block. Card thumbnails are short, detail images are tall. */
  height?: number;
  /** Optional label shown in a white pill in the top corner. */
  badge?: string;
  /** Tint for the badge text, overriding the tone. */
  badgeColor?: string;
  style?: ViewStyle;
  testID?: string;
};

/**
 * The photograph every marketplace card and detail page uses.
 *
 * The image is a local file required at build time, so it is on the device
 * before the card is drawn and it draws the same whether the phone has signal or
 * not — which is the whole reason a farmer can trust what they see on a listing
 * they opened in a field.
 *
 * Every photograph is cropped to fill rather than scaled to fit, so a portrait
 * shot in a short card thumbnail and a wide shot on the details page both fill
 * the box instead of letterboxing inside it.
 *
 * The tone is still carried, but only for the badge: the Rent or Buy pill needs a
 * colour that reads against an arbitrary photograph, and a white pill with dark
 * text on it is the one treatment that survives all of them.
 */
export function ListingImage({
  image,
  tone,
  height = 132,
  badge,
  badgeColor,
  style,
  testID,
}: ListingImageProps) {
  const colors = useAgriTheme();

  return (
    <View
      testID={testID}
      style={[styles.block, { height, backgroundColor: colors.border }, style]}>
      <Image
        style={StyleSheet.absoluteFill}
        source={marketplaceImageSource(image)}
        contentFit="cover"
        transition={0}
      />

      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.surface }]}>
          <Text
            style={[styles.badgeText, { color: badgeColor ?? toneForeground(tone, colors) }]}
            numberOfLines={1}>
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/**
 * The dark half of a tone, used for the badge text sitting on white. It is
 * darker than the tone's own soft background so the pill keeps its contrast now
 * that the backdrop behind it is a photograph rather than a flat colour.
 */
function toneForeground(tone: ListingTone, colors: AgriPalette): string {
  if (tone === 'gold') {
    return colors.harvestDark;
  }

  if (tone === 'earth') {
    return colors.earth;
  }

  if (tone === 'blue') {
    return colors.water;
  }

  return colors.primaryDark;
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
});
