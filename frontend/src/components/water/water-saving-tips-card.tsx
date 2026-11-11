import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { WATER_SAVING_TIPS, type WaterSavingTip } from '@/models/water-management';

type WaterSavingTipsCardProps = {
  tips?: readonly WaterSavingTip[];
};

/**
 * 💡 Water-Saving Tips.
 *
 * These are habits, not equipment, so every one of them is available to a farmer
 * on any budget. Each is numbered because the ordering is deliberate: putting the
 * water at the roots comes first, because it is the change that saves the most,
 * and checking for leaks comes last because it is the one that is easiest to put
 * off indefinitely.
 */
export function WaterSavingTipsCard({ tips = WATER_SAVING_TIPS }: WaterSavingTipsCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="💡 Water-Saving Tips"
      subtitle="Habits that lower how much water a field needs, in the order worth doing them"
      testID="water-saving-tips-card">
      <View style={styles.list}>
        {tips.map((tip, index) => (
          <View
            key={tip.id}
            style={[
              styles.row,
              // A hairline between rows, but not above the first one.
              index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
            ]}>
            <View style={[styles.number, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.numberText, { color: colors.primaryDark }]}>{index + 1}</Text>
            </View>

            <View style={styles.copy}>
              <Text style={[styles.title, { color: colors.text }]}>{tip.title}</Text>
              <Text style={[styles.detail, { color: colors.textSecondary }]}>{tip.detail}</Text>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  number: {
    width: 28,
    height: 28,
    borderRadius: AgriRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...AgriTypography.label,
  },
  detail: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
});
