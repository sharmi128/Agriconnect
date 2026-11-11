import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { FertilizerSearchEntry } from '@/models/fertilizer-guide';

type FertilizerSearchResultCardProps = {
  entry: FertilizerSearchEntry;
};

/**
 * One 🔎 search result.
 *
 * The layout follows the Farming Guide's article card, so results look like the
 * rest of the app: which section the answer came from, then the title and the
 * line that matched. Because the index is built from every table on the page, a
 * single box answers both "compost" and "paddy".
 */
export function FertilizerSearchResultCard({ entry }: FertilizerSearchResultCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}>
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
