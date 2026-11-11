import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type SettingsLinkRowProps = {
  /** Emoji shown in the circle to the left of the label. */
  emoji: string;
  label: string;
  /** One line explaining where the row leads. */
  description?: string;
  /** Current value shown on the right, for example "English". */
  value?: string;
  /** Highlights the label, used for the 🚪 Logout row. */
  tone?: 'default' | 'danger';
  onPress: () => void;
  divider?: boolean;
  testID?: string;
};

/**
 * A tappable settings row that leads somewhere, with a chevron to say so.
 *
 * The value sits on the right in a fixed column, so several rows with values
 * line up even when their labels are different lengths.
 */
export function SettingsLinkRow({
  emoji,
  label,
  description,
  value,
  tone = 'default',
  onPress,
  divider = false,
  testID,
}: SettingsLinkRowProps) {
  const colors = useAgriTheme();
  const isDanger = tone === 'danger';
  const labelColor = isDanger ? colors.danger : colors.text;

  return (
    <View style={divider && { borderBottomColor: colors.border, borderBottomWidth: 1 }}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={description}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View
          style={[
            styles.icon,
            { backgroundColor: isDanger ? colors.dangerSoft : colors.primarySoft },
          ]}>
          <Text style={styles.iconEmoji}>{emoji}</Text>
        </View>

        <View style={styles.copy}>
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>

          {description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          ) : null}
        </View>

        {value ? (
          <Text style={[styles.value, { color: isDanger ? colors.danger : colors.textSecondary }]}>
            {value}
          </Text>
        ) : null}

        <Text style={[styles.chevron, { color: colors.textSecondary }]}>{'\u203A'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pressed: {
    opacity: 0.6,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: AgriRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...AgriTypography.label,
  },
  description: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  value: {
    ...AgriTypography.caption,
    maxWidth: 140,
    textAlign: 'right',
  },
  chevron: {
    fontSize: 20,
    lineHeight: 24,
  },
});
