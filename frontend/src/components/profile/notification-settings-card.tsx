import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { SettingsToggleRow } from '@/components/profile/settings-toggle-row';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAppSettings } from '@/context/app-settings-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { NOTIFICATION_PREFERENCES, notificationSummary } from '@/models/app-settings';

type NotificationSettingsCardProps = {
  /** Opens the 📢 Alerts & Notifications screen, for the link at the bottom. */
  onOpenNotifications: () => void;
};

/**
 * 🔔 Notification Settings.
 *
 * One switch per kind of alert, so a farmer can keep the storm warning and turn
 * off the market news. The switches write straight into the shared settings, so
 * they stay put when the farmer moves to another tab and comes back.
 *
 * The list is local demo data. Nothing is scheduled or delivered yet, which the
 * note under the switches makes clear rather than leaving a switch that looks
 * broken.
 */
export function NotificationSettingsCard({ onOpenNotifications }: NotificationSettingsCardProps) {
  const colors = useAgriTheme();
  const { settings, toggleNotification } = useAppSettings();
  const lastIndex = NOTIFICATION_PREFERENCES.length - 1;

  return (
    <SectionCard
      title="🔔 Notification Settings"
      subtitle={notificationSummary(settings)}
      testID="notification-settings-card">
      {NOTIFICATION_PREFERENCES.map((preference, index) => (
        <SettingsToggleRow
          key={preference.key}
          emoji={preference.emoji}
          label={preference.label}
          description={preference.description}
          value={settings.notifications[preference.key]}
          // The switch hands back the value it wants, but the row is a flip: the
          // farmer is asking for the opposite of what is on screen.
          onValueChange={() => toggleNotification(preference.key)}
          divider={index < lastIndex}
          testID={`toggle-notification-${preference.key}`}
        />
      ))}

      <View style={styles.footer}>
        <FormAlert
          tone="info"
          message="Demo mode: these switches are saved on this device only. Alerts start arriving once the backend is connected."
          testID="notification-demo-alert"
        />

        <Button
          label={'\u{1F4E2}  Open Alerts & Notifications'}
          variant="secondary"
          onPress={onOpenNotifications}
          testID="open-notifications"
        />

        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Weather, irrigation and harvest alerts are the ones worth keeping on.
        </Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: Spacing.three,
    gap: 12,
  },
  hint: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
});
