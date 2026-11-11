import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  PROBLEM_KIND_INFORMATION,
  problemKindLabel,
  problemsOfKindForCrop,
  type CropProblemKind,
} from '@/models/crop-health';

type ProblemKindCardProps = {
  kind: CropProblemKind;
  /** The crop filter, so the index line under the card can follow it. */
  crop: string;
};

/**
 * 🐛 Pest Information and 🍃 Disease Information.
 *
 * Both sections use the same component, because a farmer reading them is asking
 * the same question: how do I tell which kind of problem this is? The card
 * answers it in one place — what this kind of problem is, how to recognise it,
 * how it travels, and what usually goes wrong — and then lists the problems of
 * that kind covered on this page, as a quick index for the chosen crop.
 *
 * The colour is the one difference. 🐛 is drawn in the warning colour and 🍃 in
 * the water blue, the same two colours the badges on the problem cards use, so
 * the two families stay told apart all the way down the page.
 */
export function ProblemKindCard({ kind, crop }: ProblemKindCardProps) {
  const colors = useAgriTheme();
  const info = PROBLEM_KIND_INFORMATION.find((entry) => entry.kind === kind);

  if (!info) {
    return null;
  }

  const isPest = kind === 'pest';
  const list = problemsOfKindForCrop(crop, kind);
  const accent = isPest ? colors.warning : colors.water;
  const accentSoft = isPest ? colors.warningSoft : colors.waterSoft;

  return (
    <SectionCard
      title={`${info.emoji} ${info.title}`}
      subtitle={
        isPest
          ? 'What a pest is, and how to find it on the plant'
          : 'What a disease is, and why it follows wet weather'
      }
      testID={`crop-health-${kind}-info`}>
      <View style={styles.body}>
        <Text style={[styles.summary, { color: colors.text }]}>{info.summary}</Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>How to tell</Text>

        <View style={styles.points}>
          {info.tells.map((tell) => (
            <View key={tell} style={styles.pointRow}>
              <Text style={[styles.check, { color: accent }]}>{'\u2713'}</Text>
              <Text style={[styles.pointText, { color: colors.text }]}>{tell}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          How it moves from plant to plant
        </Text>
        <Text style={[styles.spread, { color: colors.text }]}>{info.spread}</Text>

        <View style={[styles.caution, { backgroundColor: accentSoft, borderColor: accent }]}>
          <Text style={[styles.cautionLabel, { color: accent }]}>{'\u26A0\uFE0F  Watch out'}</Text>
          <Text style={[styles.cautionText, { color: accent }]}>{info.caution}</Text>
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {crop === ''
            ? `${problemKindLabel(kind)} problems in this guide`
            : `${problemKindLabel(kind)} problems covered for ${crop}`}
        </Text>

        {list.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No {problemKindLabel(kind).toLowerCase()} problems are listed for {crop} in this
            guide. Switch the crop to see the rest.
          </Text>
        ) : (
          <View style={styles.list}>
            {list.map((problem, index) => (
              <View
                key={problem.id}
                style={[
                  styles.listRow,
                  // A hairline between rows, but not above the first one.
                  index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                ]}>
                <Text style={styles.listEmoji}>{problem.emoji}</Text>
                <Text style={[styles.listName, { color: colors.text }]} numberOfLines={2}>
                  {problem.name}
                </Text>
                <Text style={[styles.listCrop, { color: colors.textSecondary }]}>
                  {problem.crop}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.two,
  },
  summary: {
    ...AgriTypography.body,
    marginBottom: Spacing.one,
  },
  label: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  points: {
    gap: Spacing.two,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  check: {
    ...AgriTypography.label,
    width: 18,
    lineHeight: 22,
  },
  pointText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    flex: 1,
    lineHeight: 21,
  },
  spread: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
  caution: {
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
    marginTop: Spacing.two,
  },
  cautionLabel: {
    ...AgriTypography.label,
  },
  cautionText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 20,
  },
  list: {
    gap: 0,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: 10,
  },
  listEmoji: {
    fontSize: 15,
    lineHeight: 20,
  },
  listName: {
    ...AgriTypography.caption,
    fontWeight: '600',
    flex: 1,
  },
  listCrop: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  empty: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});