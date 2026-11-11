import { StyleSheet, Text, View } from 'react-native';

import { PhotoThumbnail } from '@/components/journal/photo-thumbnail';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { photosForIds, type GrowthUpdate } from '@/models/crop-journal';

type GrowthTimelineProps = {
  /** The selected crop's updates, newest first. */
  updates: GrowthUpdate[];
  /** Used in the empty message, for example "No updates for Tomato yet." */
  cropName: string;
};

/**
 * 📅 The growth updates for one crop, drawn as a vertical timeline.
 *
 * Newest is at the top, because that is the entry a farmer is most likely to
 * want. The dot and line on the left tie the entries into one story, and the
 * stage of each entry is a chip so the season can be read at a glance.
 */
export function GrowthTimeline({ updates, cropName }: GrowthTimelineProps) {
  const colors = useAgriTheme();

  if (updates.length === 0) {
    return (
      <View style={[styles.empty, { borderColor: colors.border }]}>
        <Text style={styles.emptyEmoji}>{'📝'}</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No updates yet</Text>
        <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
          Log the first update for {cropName} with the form below.
        </Text>
      </View>
    );
  }

  return (
    <View testID="growth-timeline">
      {updates.map((update, index) => (
        <TimelineEntry
          key={update.id}
          update={update}
          isLast={index === updates.length - 1}
        />
      ))}
    </View>
  );
}

type TimelineEntryProps = {
  update: GrowthUpdate;
  /** The last entry has no connector under it. */
  isLast: boolean;
};

/** One dated entry on the timeline, with its note and any attached photos. */
function TimelineEntry({ update, isLast }: TimelineEntryProps) {
  const colors = useAgriTheme();
  const photos = photosForIds(update.photoIds);

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        {isLast ? null : <View style={[styles.line, { backgroundColor: colors.border }]} />}
      </View>

      <View style={styles.entry}>
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{update.date}</Text>

            <View style={[styles.stageChip, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.stageText, { color: colors.primaryDark }]} numberOfLines={1}>
                {update.stage}
              </Text>
            </View>
          </View>

          <Text style={[styles.note, { color: colors.text }]}>{update.note}</Text>

          {photos.length > 0 ? (
            <View style={styles.photos}>
              {photos.map((photo) => (
                <PhotoThumbnail key={photo.id} photo={photo} />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rail: {
    width: 14,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 18,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 4,
  },
  entry: {
    flex: 1,
    paddingBottom: Spacing.three,
  },
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  date: {
    ...AgriTypography.caption,
    fontWeight: '700',
    flexShrink: 1,
  },
  stageChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  stageText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  note: {
    ...AgriTypography.body,
    fontWeight: '400',
  },
  photos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
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
});
