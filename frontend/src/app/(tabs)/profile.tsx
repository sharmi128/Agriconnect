import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AboutAgriConnectCard } from '@/components/profile/about-agriconnect-card';
import { AppSettingsCard } from '@/components/profile/app-settings-card';
import { FarmInfoCard } from '@/components/profile/farm-info-card';
import { FarmerSummaryCard } from '@/components/profile/farmer-summary-card';
import { LanguageSettingsCard } from '@/components/profile/language-settings-card';
import { LogoutCard } from '@/components/profile/logout-card';
import { NotificationSettingsCard } from '@/components/profile/notification-settings-card';
import { SettingsLinkRow } from '@/components/profile/settings-link-row';
import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';

/**
 * 👨‍🌾 Farmer Profile, the third tab of the app.
 *
 * The screen is one scroll of self-contained sections, in the order a farmer
 * thinks about them:
 *
 * 1. 👨‍🌾 Farmer Profile — avatar, name, 📍 location.
 * 2. Farm Information — 📍 location, 📐 land area, 🌾 main crop, 💧 irrigation.
 * 3. ✏️ Edit Profile — a settings row that opens the same form screen.
 * 4. 🔔 Notification Settings — one switch per kind of alert.
 * 5. 🌐 Language & Region — 🌐 app language and the 📐 land size unit.
 * 6. ⚙️ App Settings — ☀️ daylight theme and the on/off switches, plus a reset.
 * 7. ℹ️ About AgriConnect — what the app is, the version, how to get help.
 * 8. 🚪 Logout — behind a confirmation, because it is easy to tap by accident.
 *
 * It only reads the shared profile and settings, so whatever Edit Profile or a
 * switch last saved is displayed here straight away.
 */
export default function ProfileScreen() {
  const colors = useAgriTheme();
  const { profile } = useFarmerProfile();
  const insets = useSafeAreaInsets();

  return (
    <PaddyBackground>
      <ScrollView
        testID="profile-screen"
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          },
        ]}>
        <View style={styles.inner}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>👨‍🌾 Farmer Profile</Text>

          <FarmerSummaryCard profile={profile} />

          <FarmInfoCard profile={profile} />

          <SectionCard
            title="Account"
            subtitle="Your name, location and farm details on this device"
            testID="account-card">
            <SettingsLinkRow
              emoji={'\u270F\uFE0F'}
              label="Edit Profile"
              description="Name, location, land size, fields and crops"
              value={profile.name}
              onPress={() => router.push('/edit-profile')}
              testID="edit-profile-link"
            />
          </SectionCard>

          <NotificationSettingsCard
            onOpenNotifications={() => router.push('/notifications')}
          />

          <LanguageSettingsCard />

          <AppSettingsCard />

          <AboutAgriConnectCard />

          <LogoutCard />
        </View>
      </ScrollView>
    </PaddyBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  screenTitle: {
    ...AgriTypography.title,
  },
});
