import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { CROP_WATER_NEEDS, type CropWaterNeed } from '@/models/water-management';

type CropWaterNeedsCardProps = {
  /** Which crops are actually growing on this farm. Empty shows the whole list. */
  crops?: readonly string[];
};

/**
 * 🌱 Crop Water Needs, one row per crop.
 *
 * The 📊 demand is a word and the frequency is a habit, not a number, because
 * "water often and evenly" is something a farmer can do and "3.2 units a week" is
 * not. Where a crop is already growing on the farm its row is marked, so the
 * farmer reads their own fields first and the rest only if they are planning
 * ahead.
 */
export function CropWaterNeedsCard({ crops }: CropWaterNeedsCardProps) {
  const colors = useAgriTheme();
  const growing = crops ?? [];

  return (
    <SectionCard
      title="🌱 Crop Water Needs"
      subtitle="How thirsty each crop is, and the habit that suits it"
      testID="crop-water-needs-card">
      <View style={styles.list}>
        {CROP_WATER_NEEDS.map((need, index) => {
          const isGrowing = growing.includes(need.crop);
          const tone = demandTone(need.demand, colors);

          return (
            <View
              key={need.crop}
              style={[
                styles.row,
                // A hairline between rows, but not above the first one.
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
              ]}>
              <View style={styles.header}>
                <Text style={styles.emoji}>{need.emoji}</Text>

                <View style={styles.headerText}>
                  <Text style={[styles.crop, { color: colors.text }]} numberOfLines={1}>
                    {need.crop}
                  </Text>
                  <Text style={[styles.frequency, { color: colors.textSecondary }]}>
                    {need.frequency}
                  </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: tone.soft, borderColor: tone.solid }]}>
                  <Text style={[styles.badgeText, { color: tone.text }]} numberOfLines={1}>
                    {need.demand}
                  </Text>
                </View>
              </View>

              <Text style={[styles.note, { color: colors.textSecondary }]}>{need.note}</Text>

              {isGrowing ? (
                <View style={[styles.growing, { backgroundColor: colors.primarySoft }]}>
                  <Text style={[styles.growingText, { color: colors.primaryDark }]}>
                    {'✓ Growing on your farm'}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </SectionCard>
  );
}

type Tone = {
  soft: string;
  solid: string;
  text: string;
};

/**
 * How thirsty a crop is, shown in the theme's own colours.
 *
 * High demand uses the warning amber rather than red, because a thirsty crop is
 * not a problem yet — it is a fact about the crop, and the colour should read as
 * information. The amber is reserved for the 💧 status that does want an action.
 */
function demandTone(demand: CropWaterNeed['demand'], colors: ReturnType<typeof useAgriTheme>): Tone {
  if (demand === 'High') {
    return { soft: colors.warningSoft, solid: colors.warning, text: colors.warning };
  }

  if (demand === 'Medium') {
    return { soft: colors.primarySoft, solid: colors.primary, text: colors.primaryDark };
  }

  return { soft: colors.background, solid: colors.border, text: colors.textSecondary };
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  row: {
    paddingVertical: Spacing.three,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  crop: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  frequency: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  note: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
  growing: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  growingText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
});
