import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography, type AgriPalette } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { stageProgress, type JournalCrop } from '@/models/crop-journal';
import type { CropHealth } from '@/models/farm';

type CropCardProps = {
  crop: JournalCrop;
  /** True for the crop whose growth timeline is shown underneath. */
  isSelected: boolean;
  onPress: (crop: JournalCrop) => void;
};

/**
 * One crop in the 🌱 My Crops list.
 *
 * The card is the crop's whole story at a glance: which field it is in, how far
 * along it is, how healthy it looks, and when it was sown. Tapping it selects the
 * crop, which is what the Growth Timeline below reads from.
 */
export function CropCard({ crop, isSelected, onPress }: CropCardProps) {
  const colors = useAgriTheme();
  const progress = stageProgress(crop.stage);
  const health = getHealthColors(crop.health, colors);

  // The variety is optional, so the line is built rather than interpolated.
  const where = crop.variety
    ? `${crop.variety} · ${crop.fieldName} · ${crop.areaAcres} ac`
    : `${crop.fieldName} · ${crop.areaAcres} ac`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${crop.name}, ${where}, stage ${crop.stage}, ${progress}% of the season complete`}
      onPress={() => onPress(crop)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 1,
        },
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.icon}>{crop.emoji}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {crop.name}
          </Text>
          <Text style={[styles.where, { color: colors.textSecondary }]} numberOfLines={1}>
            {where}
          </Text>
        </View>

        {isSelected ? (
          <View style={[styles.viewingChip, { backgroundColor: colors.primary }]}>
            <Text style={[styles.viewingText, { color: colors.onPrimary }]}>Viewing</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.badgeText, { color: colors.primaryDark }]} numberOfLines={1}>
            {crop.stage}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: health.background }]}>
          <View style={[styles.badgeDot, { backgroundColor: health.text }]} />
          <Text style={[styles.badgeText, { color: health.text }]} numberOfLines={1}>
            {crop.health}
          </Text>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View
            style={[styles.fill, { backgroundColor: colors.primary, width: `${progress}%` }]}
          />
        </View>
        <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
          {progress}% of the growing season
        </Text>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Detail label="Sown" value={crop.sownOn} />
        <Detail label="🌾 Expected harvest" value={crop.expectedHarvest} />
      </View>
    </Pressable>
  );
}

/** Maps a crop health to the background and text colour of its badge. */
function getHealthColors(
  health: CropHealth,
  colors: AgriPalette
): { background: string; text: string } {
  if (health === 'Action needed') {
    return { background: colors.dangerSoft, text: colors.danger };
  }
  if (health === 'Watch') {
    return { background: colors.warningSoft, text: colors.warning };
  }
  return { background: colors.primarySoft, text: colors.primaryDark };
}

type DetailProps = {
  label: string;
  value: string;
};

/** One labelled date at the bottom of the card. */
function Detail({ label, value }: DetailProps) {
  const colors = useAgriTheme();

  return (
    <View style={styles.detail}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    lineHeight: 28,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  where: {
    ...AgriTypography.caption,
  },
  viewingChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  viewingText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AgriRadius.pill,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  progressBlock: {
    gap: Spacing.one,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.two,
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  detail: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  detailValue: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
});
