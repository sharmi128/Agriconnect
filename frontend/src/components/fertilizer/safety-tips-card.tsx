import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { SAFETY_TIPS } from '@/models/fertilizer-guide';

/**
 * ⚠️ Safety Tips.
 *
 * These lines protect the person doing the work rather than the crop, so they are
 * marked in the warning colour from the theme and opened with a note saying why
 * they matter. It is the one card on the screen that looks different on purpose: a
 * farmer skimming the page should feel they are reading a different kind of
 * instruction.
 */
export function SafetyTipsCard() {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u26A0\uFE0F Safety Tips"
      subtitle="How to handle and store fertilizer without hurting yourself or your water"
      testID="fertilizer-safety">
      <View style={styles.list}>
        <View style={[styles.notice, { backgroundColor: colors.warningSoft, borderColor: colors.warning }]}>
          <Text style={[styles.noticeText, { color: colors.warning }]}>
            These are the rules that matter most on this page. A missed harvest costs
            a season; a mishap with your hands, your breathing or your water costs
            more than that.
          </Text>
        </View>

        {SAFETY_TIPS.map((tip, index) => (
          <View
            key={tip.id}
            style={[
              styles.row,
              // A hairline between rows, but not above the first one.
              index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
            ]}>
            <Text style={[styles.check, { color: colors.warning }]}>{'\u2713'}</Text>

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
  notice: {
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: Spacing.two,
  },
  noticeText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  check: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    width: 20,
    lineHeight: 24,
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
