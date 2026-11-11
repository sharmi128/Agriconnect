import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  LOAN_CATEGORY_LABELS,
  LOAN_FOR_LABELS,
  type LoanOption,
} from '@/models/loan-support';

type LoanInformationCardProps = {
  loans: readonly LoanOption[];
  onSelect: (loan: LoanOption) => void;
  /** The loan the farmer picked in the form, highlighted so the page agrees with itself. */
  selectedLoanId?: string;
};

/**
 * 💰 Loan Information.
 *
 * Each loan is a tap target that pre-fills the application form further down, so
 * a farmer reads the options here and does not retype one. The three facts shown
 * are the three that decide whether the loan is worth applying for: what it is
 * for, what you must already have, and how long it takes.
 *
 * There is no interest rate on purpose. A rate printed in an app goes stale, and
 * a farmer who plans on a stale rate cannot pay. The rate belongs to the officer,
 * and the note under each loan says what the money actually has to earn back.
 */
export function LoanInformationCard({
  loans,
  onSelect,
  selectedLoanId = '',
}: LoanInformationCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u{1F4B0} Loan Information"
      subtitle="Tap a loan to fill the application form below with it"
      testID="loan-information-card">
      <View style={styles.list}>
        {loans.map((loan, index) => {
          const isSelected = loan.id === selectedLoanId;

          return (
            <Pressable
              key={loan.id}
              testID={`loan-option-${loan.id}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${loan.name} from ${loan.provider}`}
              onPress={() => onSelect(loan)}
              style={({ pressed }) => [
                styles.row,
                { borderColor: colors.border },
                isSelected && [styles.rowSelected, { borderColor: colors.primary }],
                // A hairline between rows, but not above the first one.
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                pressed && styles.pressed,
              ]}>
              <View style={styles.header}>
                <Text style={styles.emoji}>{loan.emoji}</Text>

                <View style={styles.headerCopy}>
                  <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {loan.name}
                  </Text>
                  <Text style={[styles.provider, { color: colors.textSecondary }]} numberOfLines={1}>
                    {loan.provider}
                  </Text>
                </View>

                <Text style={[styles.amount, { color: colors.primaryDark }]} numberOfLines={1}>
                  {loan.amountLabel}
                </Text>
              </View>

              <View style={styles.badges}>
                <Badge
                  label={LOAN_CATEGORY_LABELS[loan.category]}
                  soft={colors.earthSoft}
                  text={colors.earth}
                />
                <Badge
                  label={LOAN_FOR_LABELS[loan.forWho]}
                  soft={colors.waterSoft}
                  text={colors.water}
                />
              </View>

              <Text style={[styles.purpose, { color: colors.text }]}>{loan.purpose}</Text>

              <Detail
                emoji="\u{1F4CB}"
                label="You need"
                detail={loan.requirement}
                colors={colors}
              />
              <Detail
                emoji="\u{23F3}"
                label="Takes"
                detail={loan.turnaround}
                colors={colors}
              />
              <Detail emoji="\u{1F4A1}" label="Worth knowing" detail={loan.note} colors={colors} />
            </Pressable>
          );
        })}
      </View>
    </SectionCard>
  );
}

/** One fact line, so the label and the sentence about it line up down the card. */
function Detail({
  emoji,
  label,
  detail,
  colors,
}: {
  emoji: string;
  label: string;
  detail: string;
  colors: ReturnType<typeof useAgriTheme>;
}) {
  return (
    <View style={styles.detail}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
        {`${emoji}  ${label}`}
      </Text>
      <Text style={[styles.detailText, { color: colors.text }]}>{detail}</Text>
    </View>
  );
}

/** Small pill used for the category and audience labels. */
function Badge({ label, soft, text }: { label: string; soft: string; text: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: soft }]}>
      <Text style={[styles.badgeText, { color: text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  row: {
    gap: 6,
    borderRadius: AgriRadius.small,
    borderWidth: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  rowSelected: {
    // A thicker green border marks the loan the form is filled with, without
    // recolouring the text that a farmer is already reading.
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.7,
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
  amount: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    borderRadius: AgriRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  purpose: {
    ...AgriTypography.caption,
    lineHeight: 19,
  },
  detail: {
    gap: 1,
  },
  detailLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  detailText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 19,
  },
});
