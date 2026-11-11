import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { FertilizerType } from '@/models/fertilizer-guide';

type FertilizerTypeCardProps = {
  type: FertilizerType;
  /** Flips the chevron when the card is open and showing its detail. */
  expanded: boolean;
  onPress: (type: FertilizerType) => void;
};

/**
 * One of the 🧪 fertilizer types, collapsed to a summary and expandable to the
 * full explanation.
 *
 * The layout follows the Farming Guide's category card, so tapping a card and
 * watching a chevron turn is already a familiar gesture in this app. What is
 * extra here is the ⚠️ caution line, which is pinned to the bottom of the open
 * card in the warning colour, because the mistake that costs a farmer the most is
 * usually the one described there.
 */
export function FertilizerTypeCard({ type, expanded, onPress }: FertilizerTypeCardProps) {
  const colors = useAgriTheme();

  return (
    <Pressable
      testID={`fertilizer-type-${type.id}`}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={type.title}
      accessibilityHint={expanded ? 'Hides the details' : 'Shows the details'}
      onPress={() => onPress(type)}
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
          <Text style={styles.emoji}>{type.emoji}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {type.title}
          </Text>
          <Text style={[styles.summary, { color: colors.textSecondary }]} numberOfLines={2}>
            {type.summary}
          </Text>
        </View>

        <Text
          style={[styles.chevron, { color: colors.primary }, expanded && styles.chevronExpanded]}>
          {'\u203A'}
        </Text>
      </View>

      {expanded ? (
        <View style={[styles.detail, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
          <Text style={[styles.bestForLabel, { color: colors.textSecondary }]}>Best for</Text>
          <Text style={[styles.bestFor, { color: colors.text }]}>{type.bestFor}</Text>

          <View style={styles.points}>
            {type.points.map((point) => (
              <View key={point} style={styles.pointRow}>
                <Text style={[styles.bullet, { color: colors.primary }]}>{'\u2022'}</Text>
                <Text style={[styles.pointText, { color: colors.text }]}>{point}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.caution, { backgroundColor: colors.warningSoft, borderColor: colors.warning }]}>
            <Text style={[styles.cautionLabel, { color: colors.warning }]}>
              {'\u26A0\uFE0F  Watch out'}
            </Text>
            <Text style={[styles.cautionText, { color: colors.warning }]}>{type.caution}</Text>
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
    gap: Spacing.three,
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
    gap: 2,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  summary: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 20,
  },
  chevron: {
    ...AgriTypography.title,
    fontWeight: '700',
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  detail: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  bestForLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  bestFor: {
    ...AgriTypography.body,
  },
  points: {
    gap: Spacing.two,
    marginTop: Spacing.one,
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
  },
});
