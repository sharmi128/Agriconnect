import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { DEMO_SUPPORT_PROGRAMS, type SupportProgram } from '@/models/loan-support';

type SupportProgramsCardProps = {
  programs?: readonly SupportProgram[];
};

/**
 * 📋 Support Programs.
 *
 * These sit above the loans on purpose. A subsidy, a training visit or a grant
 * match often pays for more than a loan would, and a farmer looking only at
 * borrowing is leaving money on the table.
 *
 * The requirement is shown as prominently as the benefit. A scheme that only
 * advertises what you get, and hides the condition attached to it, wastes the
 * farmer's trip to the office.
 */
export function SupportProgramsCard({ programs = DEMO_SUPPORT_PROGRAMS }: SupportProgramsCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u{1F4CB} Support Programs"
      subtitle="Schemes that help without borrowing. Worth checking before you take a loan."
      testID="support-programs-card">
      <View style={styles.list}>
        {programs.map((program, index) => (
          <View
            key={program.id}
            style={[
              styles.row,
              // A hairline between rows, but not above the first one.
              index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
            ]}>
            <View style={styles.header}>
              <Text style={styles.emoji}>{program.emoji}</Text>

              <View style={styles.headerCopy}>
                <Text style={[styles.name, { color: colors.text }]}>{program.name}</Text>
                <Text style={[styles.provider, { color: colors.textSecondary }]}>
                  {program.provider}
                </Text>
              </View>
            </View>

            <View style={[styles.benefit, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.benefitLabel, { color: colors.primaryDark }]}>
                What you get
              </Text>
              <Text style={[styles.benefitText, { color: colors.text }]}>{program.benefit}</Text>
            </View>

            <View style={[styles.requirement, { backgroundColor: colors.warningSoft }]}>
              <Text style={[styles.requirementLabel, { color: colors.warning }]}>
                What you must do
              </Text>
              <Text style={[styles.requirementText, { color: colors.text }]}>
                {program.requirement}
              </Text>
            </View>

            <View style={styles.howTo}>
              <Text style={[styles.howToLabel, { color: colors.textSecondary }]}>
                {'\u{1F4CD}  How to ask'}
              </Text>
              <Text style={[styles.howToText, { color: colors.text }]}>{program.howToApply}</Text>
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
    gap: 6,
    paddingVertical: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  headerCopy: {
    flex: 1,
    gap: 1,
  },
  name: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  provider: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  benefit: {
    gap: 2,
    borderRadius: AgriRadius.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  benefitLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  benefitText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 19,
  },
  requirement: {
    gap: 2,
    borderRadius: AgriRadius.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  requirementLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  requirementText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 19,
  },
  howTo: {
    gap: 1,
  },
  howToLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  howToText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 19,
  },
});
