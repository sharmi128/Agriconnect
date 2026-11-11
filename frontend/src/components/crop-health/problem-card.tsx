import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { problemKindEmoji, problemKindLabel, type CropProblem } from '@/models/crop-health';

type ProblemCardProps = {
  problem: CropProblem;
  /** Flips the chevron when the card is open and showing its detail. */
  expanded: boolean;
  onPress: (problem: CropProblem) => void;
};

/**
 * One common crop problem — a pest or a disease — as a clean, clickable card.
 *
 * Closed, the card answers the three things a farmer asks first: what the
 * problem is called, which crop it belongs to, and what it does. Tapping it
 * opens the two lists that matter: ⚠️ the warning signs to look for in the
 * field, and 💡 the general prevention tips that make it less likely next time.
 *
 * The layout follows the Fertilizer Guide's type card, so tapping a card and
 * watching a chevron turn is already a familiar gesture in this app. The footer
 * of the open card repeats the one rule the page is built on: AgriConnect
 * describes problems, and never hands out a spray programme.
 */
export function ProblemCard({ problem, expanded, onPress }: ProblemCardProps) {
  const colors = useAgriTheme();
  const isPest = problem.kind === 'pest';

  return (
    <Pressable
      testID={`crop-problem-${problem.id}`}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${problem.name}. ${problem.crop} ${problemKindLabel(problem.kind)}.`}
      accessibilityHint={
        expanded
          ? 'Hides the warning signs and prevention tips'
          : 'Shows the warning signs and prevention tips'
      }
      onPress={() => onPress(problem)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: expanded ? colors.borderStrong : colors.border,
        },
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.emoji}>{problem.emoji}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {problem.name}
          </Text>

          <View style={styles.badges}>
            {/* The crop comes first, because it is what a farmer checks first. */}
            <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.badgeText, { color: colors.primaryDark }]}>{problem.crop}</Text>
            </View>

            {/* 🐛 pests and 🍃 diseases are told apart by colour, at a glance. */}
            <View
              style={[
                styles.badge,
                { backgroundColor: isPest ? colors.warningSoft : colors.waterSoft },
              ]}>
              <Text
                style={[styles.badgeText, { color: isPest ? colors.warning : colors.water }]}>
                {`${problemKindEmoji(problem.kind)} ${problemKindLabel(problem.kind)}`}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.chevron, { color: colors.primary }, expanded && styles.chevronExpanded]}>
          {'\u203A'}
        </Text>
      </View>

      <Text style={[styles.summary, { color: colors.textSecondary }]}>{problem.summary}</Text>

      {!expanded ? (
        <Text style={[styles.hint, { color: colors.primary }]}>
          {'Tap for warning signs and prevention'}
        </Text>
      ) : null}

      {expanded ? (
        <View style={[styles.detail, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.warning }]}>
            {'\u26A0\uFE0F  Warning signs'}
          </Text>

          <View style={styles.points}>
            {problem.warningSigns.map((sign) => (
              <View key={sign} style={styles.pointRow}>
                <Text style={[styles.bullet, { color: colors.warning }]}>{'\u2022'}</Text>
                <Text style={[styles.pointText, { color: colors.text }]}>{sign}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.primaryDark }]}>
            {'\u{1F4A1}  General prevention tips'}
          </Text>

          <View style={styles.points}>
            {problem.preventionTips.map((tip) => (
              <View key={tip} style={styles.pointRow}>
                <Text style={[styles.bullet, { color: colors.primary }]}>{'\u2022'}</Text>
                <Text style={[styles.pointText, { color: colors.text }]}>{tip}</Text>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.footnote,
              { backgroundColor: colors.primarySoft, borderColor: colors.border },
            ]}>
            <Text style={[styles.footnoteText, { color: colors.primaryDark }]}>
              General practice only. AgriConnect does not give chemical treatments or dosages.
              Confirm what you are looking at with your local agricultural officer before
              treating the field.
            </Text>
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    ...AgriTypography.title,
    fontWeight: '700',
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  summary: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
  hint: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  detail: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
  sectionLabel: {
    ...AgriTypography.label,
  },
  points: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  bullet: {
    ...AgriTypography.body,
  },
  pointText: {
    ...AgriTypography.body,
    flex: 1,
  },
  footnote: {
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footnoteText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
});