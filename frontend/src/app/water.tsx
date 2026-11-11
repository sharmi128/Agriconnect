import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { CropWaterNeedsCard } from '@/components/water/crop-water-needs-card';
import { IrrigationTypeCard } from '@/components/water/irrigation-type-card';
import { RainfallCard } from '@/components/water/rainfall-card';
import { WaterSavingTipsCard } from '@/components/water/water-saving-tips-card';
import { WaterStatusCard } from '@/components/water/water-status-card';
import { WateringReminderCard } from '@/components/water/watering-reminder-card';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppSettings } from '@/context/app-settings-context';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { DEMO_FARM, growingCrops } from '@/models/farm';
import {
  DEMO_FIELD_WATER,
  DEMO_WATERING_REMINDERS,
  nextReminder,
  remindersInOrder,
  waterSummary,
  type WateringReminder,
} from '@/models/water-management';

/**
 * Water Management, opened from the 💧 Water Status card on the Home dashboard.
 *
 * The screen is ordered the way a farmer uses it on a morning:
 *
 * 1. 💧 Water Status — what each field is holding, and what to do about it today.
 * 2. 📅 Watering Reminder — the fields waiting, each one a tap to mark as watered.
 * 3. 🌧️ Rainfall Information — what has fallen and what is coming, which is what
 *    decides whether the reminder above is worth acting on at all.
 * 4. 🚿 Irrigation Type — how the water gets here, read from the farmer profile.
 * 5. 🌱 Crop Water Needs — how thirsty each crop is, in habits rather than numbers.
 * 6. 💡 Water-Saving Tips — how to need less of it next season.
 *
 * The reminders are the only state on the screen, and they are local: tapping a
 * field marks it watered for this visit and nothing is scheduled or sent anywhere.
 * Everything else reads from `models/water-management.ts` plus the same field,
 * crop, weather and profile data the other screens use, so a number here matches
 * the number on the Weather and My Farm screens.
 *
 * There are no pump sizes, litres or tank volumes on this page on purpose. How much
 * water a field needs depends on the soil, the field size and the crop, so the
 * numbers belong to a local agricultural officer rather than to an app.
 */
export default function WaterManagementScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { settings } = useAppSettings();
  const { profile } = useFarmerProfile();

  // Only ever set in this session. A reminder is a nudge, not a record.
  const [doneIds, setDoneIds] = useState<string[]>([]);

  const next = nextReminder(DEMO_WATERING_REMINDERS, doneIds);

  /** Tapping a field marks it watered, or puts it back if it was already done. */
  function handleToggle(reminder: WateringReminder) {
    setDoneIds((current) =>
      current.includes(reminder.id)
        ? current.filter((id) => id !== reminder.id)
        : [...current, reminder.id]
    );
  }

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Water Management"
              subtitle={
                next
                  ? `${waterSummary(DEMO_FIELD_WATER)} · next: ${next.fieldName} ${next.dueLabel.toLowerCase()}`
                  : `${waterSummary(DEMO_FIELD_WATER)} · nothing due`
              }
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="water-management-screen"
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {/* 💧 Water Status */}
            <WaterStatusCard statuses={DEMO_FIELD_WATER} unit={settings.landAreaUnit} />

            {/* 📅 Watering Reminder */}
            <WateringReminderCard
              reminders={remindersInOrder(DEMO_WATERING_REMINDERS, doneIds)}
              doneIds={doneIds}
              onToggle={handleToggle}
            />

            {/* 🌧️ Rainfall Information */}
            <RainfallCard />

            {/* 🚿 Irrigation Type */}
            <IrrigationTypeCard value={profile.irrigationType} />

            {/* 🌱 Crop Water Needs */}
            <CropWaterNeedsCard crops={growingCrops(DEMO_FARM.fields)} />

            {/* 💡 Water-Saving Tips */}
            <WaterSavingTipsCard />

            <Text style={[styles.footnote, { color: colors.textSecondary }]}>
              Demo data only. How much water a field needs depends on its soil, its size and
              its crop, so the amounts belong to your local agricultural officer rather than to
              an app.
            </Text>
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  footnote: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
});
