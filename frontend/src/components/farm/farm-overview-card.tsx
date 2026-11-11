import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatAcres, summarizeFarm, type FarmField } from '@/models/farm';

type FarmOverviewCardProps = {
  farmName: string;
  /** Taken from the farmer profile, so it matches the Profile screen. */
  location: string;
  fields: FarmField[];
};

/**
 * The overview card at the top of the My Farm page: the farm name, its
 * location, the total land area, how many fields there are, and the crops
 * currently growing.
 *
 * Every number is added up from the fields rather than stored separately, so the
 * card can never disagree with the list below it, and the same totals are what
 * the Home dashboard reports.
 */
export function FarmOverviewCard({ farmName, location, fields }: FarmOverviewCardProps) {
  const colors = useAgriTheme();
  const { crops, fieldCount, totalAcres } = summarizeFarm(fields);

  return (
    <View
      testID="farm-overview-card"
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View
          style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.emoji}>{'\u{1F33E}'}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.farmName, { color: colors.text }]} numberOfLines={1}>
            {farmName}
          </Text>

          <View style={styles.locationRow}>
            <Text style={styles.pin}>{'\u{1F4CD}'}</Text>
            <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
              {location || 'Location not set'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'\u{1F4D0}'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatAcres(totalAcres)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total land</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'\u{1F3DE}\uFE0F'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{fieldCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {fieldCount === 1 ? 'Field' : 'Fields'}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statEmoji}>{'\u{1F33E}'}</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{crops.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {crops.length === 1 ? 'Crop' : 'Crops'}
          </Text>
        </View>
      </View>

      <View style={[styles.cropsBlock, { borderTopColor: colors.border }]}>
        <View style={styles.cropsHeader}>
          <Text style={styles.cropEmoji}>{'\u{1F331}'}</Text>
          <Text style={[styles.cropsTitle, { color: colors.textSecondary }]}>Current crops</Text>
        </View>

        {crops.length > 0 ? (
          <View style={styles.chipsRow}>
            {crops.map((crop) => (
              <View
                key={crop}
                style={[styles.chip, { backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.chipText, { color: colors.primaryDark }]}>{crop}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={[styles.emptyCrops, { color: colors.textSecondary }]}>
            No crops planted yet.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  farmName: {
    ...AgriTypography.title,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pin: {
    fontSize: 13,
  },
  location: {
    ...AgriTypography.body,
    flexShrink: 1,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: {
    fontSize: 18,
  },
  statValue: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  statLabel: {
    ...AgriTypography.caption,
  },
  cropsBlock: {
    borderTopWidth: 1,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  cropsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cropEmoji: {
    fontSize: 15,
  },
  cropsTitle: {
    ...AgriTypography.label,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: AgriRadius.pill,
  },
  chipText: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  emptyCrops: {
    ...AgriTypography.caption,
  },
});
