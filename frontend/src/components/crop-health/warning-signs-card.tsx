import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { WARNING_SIGNS } from '@/models/crop-health';

/**
 * ⚠️ Warning Signs.
 *
 * These are the signs that do not belong to any one problem, which is exactly why
 * they come first in a farmer's week: you do not have to know the name of a
 * problem to act on it, and a field walk is what turns a patch into a decision.
 *
 * The card is drawn in the theme's warning colour from the intro line down, so it
 * reads as the "go and look" section rather than the "read and remember" one, the
 * same way the Fertilizer Guide marks its safety card.
 */
export function WarningSignsCard() {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title={'\u26A0\uFE0F Warning Signs'}
      subtitle="What to look for in any crop, before you know what the problem is"
      testID="crop-health-warning-signs">
      <View style={styles.body}>
        <View
          style={[styles.notice, { backgroundColor: colors.warningSoft, borderColor: colors.warning }]}>
          <Text style={[styles.noticeText, { color: colors.warning }]}>
            You do not need to name a problem to act on it. These are the signs that say
            {'\u201C'}walk this field today{'\u201D'}, and a problem found in one patch is a
            problem you can still handle by hand.
          </Text>
        </View>

        <View style={styles.list}>
          {WARNING_SIGNS.map((sign, index) => (
            <View
              key={sign.id}
              style={[
                styles.row,
                // A hairline between rows, but not above the first one.
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
              ]}>
              <Text style={styles.emoji}>{sign.emoji}</Text>

              <View style={styles.copy}>
                <Text style={[styles.title, { color: colors.text }]}>{sign.title}</Text>
                <Text style={[styles.detail, { color: colors.textSecondary }]}>{sign.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.two,
  },
  notice: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: Spacing.two,
  },
  noticeText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  emoji: {
    fontSize: 18,
    lineHeight: 24,
    width: 24,
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