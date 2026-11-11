import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { CropHealthSearchEntry } from '@/models/crop-health';

type CropHealthSearchResultCardProps = {
  entry: CropHealthSearchEntry;
};

/**
 * One 🔎 search result that is not a problem.
 *
 * Problems are shown as the full clickable card, because that is where the
 * warning signs and the prevention tips live. Everything else — a warning sign, a
 * prevention habit, a crop note or the explanation of pests and diseases as a
 * family — is one answer to one question, so it is shown as a plain card: which
 * section it came from, the title, and the line that matched.
 *
 * The layout follows the Fertilizer Guide's result card, so searching looks the
 * same on both guide screens.
 */
export function CropHealthSearchResultCard({ entry }: CropHealthSearchResultCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{entry.emoji}</Text>
        <Text style={[styles.section, { color: colors.textSecondary }]} numberOfLines={1}>
          {entry.section}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{entry.title}</Text>

      <Text style={[styles.detail, { color: colors.textSecondary }]}>{entry.detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    ...AgriTypography.caption,
    fontSize: 12,
    flex: 1,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  detail: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
});