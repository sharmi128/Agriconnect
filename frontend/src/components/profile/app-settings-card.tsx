import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { SettingsToggleRow } from '@/components/profile/settings-toggle-row';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Spacing } from '@/constants/theme';
import { useAppSettings } from '@/context/app-settings-context';
import { APP_PREFERENCES } from '@/models/app-settings';
import { useAgriTheme } from '@/hooks/use-agri-theme';

/**
 * ⚙️ App Settings.
 *
 * The 🌿 Appearance row is a read-only statement rather than a picker. The app
 * used to offer a dark theme, and it has one bright paddy-field theme now: these
 * screens are read outdoors, in daylight, so a switch that could turn them black
 * was the wrong thing to hand a farmer working in the sun. The row is kept so
 * the answer is on screen instead of the setting simply vanishing.
 *
 * The rest are the switches a phone-sized app normally offers. They are saved on
 * the device only until the backend is connected, and "Reset to default settings"
 * puts every one of them back.
 */
export function AppSettingsCard() {
  const colors = useAgriTheme();
  const { settings, toggleAppPreference, resetSettings } = useAppSettings();
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  return (
    <SectionCard
      title="\u2699\uFE0F App Settings"
      subtitle="Appearance and how the app behaves on this device"
      testID="app-settings-card">
      <View style={[styles.appearance, { backgroundColor: colors.surfaceGreen, borderColor: colors.primarySoft }]}>
        <Text style={styles.appearanceEmoji}>{'\u{1F33F}'}</Text>
        <View style={styles.appearanceCopy}>
          <Text style={[styles.appearanceTitle, { color: colors.primaryDark }]}>Daylight theme</Text>
          <Text style={[styles.appearanceBody, { color: colors.textSecondary }]}>
            AgriConnect always uses its bright paddy-field colors, so it stays easy to read in the
            sun.
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {APP_PREFERENCES.map((preference) => (
          <SettingsToggleRow
            key={preference.key}
            emoji={preference.emoji}
            label={preference.label}
            description={preference.description}
            value={settings.app[preference.key]}
            onValueChange={() => toggleAppPreference(preference.key)}
            // Every row carries a line, which also separates the last switch from
            // the reset button underneath.
            divider
            testID={`toggle-app-${preference.key}`}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          label="\u{1F504}  Reset to default settings"
          variant="secondary"
          onPress={() => setIsConfirmingReset(true)}
          testID="reset-settings"
        />
      </View>

      <ConfirmDialog
        visible={isConfirmingReset}
        title="Reset all settings?"
        message="Your language, land unit and every switch go back to how the app shipped. Your profile and farm details are not touched."
        confirmLabel="Reset"
        tone="danger"
        onConfirm={() => {
          resetSettings();
          setIsConfirmingReset(false);
        }}
        onCancel={() => setIsConfirmingReset(false)}
        testID="confirm-reset-settings"
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  appearance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  appearanceEmoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  appearanceCopy: {
    flex: 1,
    gap: 2,
  },
  appearanceTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  appearanceBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  list: {
    marginTop: Spacing.two,
  },
  actions: {
    marginTop: Spacing.three,
  },
});
