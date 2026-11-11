import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography, type AgriPalette } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { JournalPhoto, JournalPhotoTone } from '@/models/crop-journal';

type PhotoThumbnailProps = {
  photo: JournalPhoto;
  /** Adds a tick and a highlighted border. Used by the photo picker. */
  selected?: boolean;
};

/**
 * One photo shown as a small tile.
 *
 * There is no real image behind this. A tile is the photo's themed colour, its
 * emoji and its caption, which is the same stand-in the marketplace listing card
 * uses for a listing photo. It keeps the screen working offline with no image
 * hosting, and both the timeline and the picker get the same look from one
 * component.
 */
export function PhotoThumbnail({ photo, selected = false }: PhotoThumbnailProps) {
  const colors = useAgriTheme();
  const toneBackground = getToneBackground(photo.tone, colors);

  return (
    <View
      accessibilityLabel={selected ? `${photo.caption}, attached` : photo.caption}
      style={styles.tile}>
      <View
        style={[
          styles.photo,
          {
            backgroundColor: toneBackground,
            borderColor: selected ? colors.primary : colors.border,
          },
        ]}>
        <Text style={styles.emoji}>{photo.emoji}</Text>

        {selected ? (
          <View style={[styles.tick, { backgroundColor: colors.primary }]}>
            <Text style={[styles.tickText, { color: colors.onPrimary }]}>{'\u2713'}</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.caption, { color: colors.textSecondary }]} numberOfLines={2}>
        {photo.caption}
      </Text>
    </View>
  );
}

/** Maps a photo tone to the background colour of its tile. */
function getToneBackground(tone: JournalPhotoTone, colors: AgriPalette): string {
  if (tone === 'gold') {
    return colors.warningSoft;
  }
  if (tone === 'earth') {
    return colors.earthSoft;
  }
  if (tone === 'blue') {
    return colors.waterSoft;
  }
  return colors.primarySoft;
}

/** Fixed width, so a row of tiles wraps evenly on any screen. */
const TILE_WIDTH = 82;

const styles = StyleSheet.create({
  tile: {
    width: TILE_WIDTH,
    gap: Spacing.one,
  },
  photo: {
    height: 58,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  tick: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  caption: {
    ...AgriTypography.caption,
    fontSize: 11,
    lineHeight: 15,
  },
});
