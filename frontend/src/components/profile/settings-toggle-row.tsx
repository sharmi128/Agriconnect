import { StyleSheet, Switch, Text, View } from 'react-native';

import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type SettingsToggleRowProps = {
  /** Emoji shown in the circle to the left of the label. */
  emoji: string;
  label: string;
  /** One line explaining what the switch does. */
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Draws a hairline underneath, so the row reads as part of a list. */
  divider?: boolean;
  testID?: string;
};

/**
 * One on/off switch in a settings list: emoji, label, explanation and the switch.
 *
 * The whole row is the tap target rather than just the switch, because a switch
 * is a small target on a phone and the farmer is often holding the device in one
 * hand. The switch itself stays enabled for screen readers, which announce it
 * with the row's label.
 */
export function SettingsToggleRow({
  emoji,
  label,
  description,
  value,
  onValueChange,
  divider = false,
  testID,
}: SettingsToggleRowProps) {
  const colors = useAgriTheme();

  return (
    <View style={divider && { borderBottomColor: colors.border, borderBottomWidth: 1 }}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.iconEmoji}>{emoji}</Text>
        </View>

        <View style={styles.copy}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {description}
          </Text>
        </View>

        <Switch
          testID={testID}
          accessibilityLabel={label}
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
          ios_backgroundColor={colors.border}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    // A roomy row, so it is easy to tap while standing in a field.
    paddingVertical: Spacing.three,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
});
