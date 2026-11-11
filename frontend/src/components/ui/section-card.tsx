import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type SectionCardProps = {
  /** Section heading, emoji included, for example "🔔 Notification Settings". */
  title: string;
  /** One line under the heading explaining what the section is for. */
  subtitle?: string;
  /** The switches, dropdowns, rows or articles the section is made of. */
  children: React.ReactNode;
  testID?: string;
};

/**
 * The bordered card that every settings and guide section on a screen sits in.
 *
 * The heading carries its own emoji, which is how a farmer finds a section by
 * looking rather than by reading. Rows inside a section are separated by a
 * hairline, so a list of five switches still reads as one group.
 */
export function SectionCard({ title, subtitle, children, testID }: SectionCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        AgriShadows.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      ) : null}

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  subtitle: {
    ...AgriTypography.caption,
    fontWeight: '400',
    marginTop: 2,
  },
  body: {
    marginTop: Spacing.two,
  },
});
