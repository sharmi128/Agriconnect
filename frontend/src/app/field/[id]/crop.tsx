import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/auth-header';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SectionCard } from '@/components/ui/section-card';
import { GrowthTimeline } from '@/components/journal/growth-timeline';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useFarm } from '@/context/farm-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_GROWTH_UPDATES,
  DEMO_JOURNAL_CROPS,
  describeDaysToHarvest,
  daysUntilHarvest,
  stageProgress,
  updatesForCrop,
} from '@/models/crop-journal';
import type { CropStatus } from '@/models/weather';
import { DEMO_WEATHER_REPORT } from '@/models/weather';
import {
  CROP_WATER_NEEDS,
  DEMO_FIELD_WATER,
  WATER_LEVEL_LABELS,
  type WaterLevel,
} from '@/models/water-management';

/** A text row inside a details card: emoji, label on the left, value right. */
function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const colors = useAgriTheme();

  return (
    <View style={[styles.detailRow, { borderTopColor: colors.border }]}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const NOT_RECORDED = 'Not added yet';

/**
 * 🌱 Crop Details, opened from 📈 Crop Progress on the Field Details page.
 *
 * One page for one planting: what the crop is, when it was sown and expected
 * to harvest, how the field's water is looking, how the weather is treating
 * it, and the growth updates logged through the season.
 *
 * The crop facts come from the field's record in the shared farm, so ✏️ Edit
 * Crop changes are visible here immediately, and 🗑 Remove Crop leaves the field
 * fallow again. The 💧 water, 🌤️ weather and 📈 updates sections read the same
 * demo models as the Water and Weather screens, matched by field and crop name so
 * the pages can never disagree.
 */
export default function CropDetailsScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { farm, removeCrop, isHydrated } = useFarm();
  const params = useLocalSearchParams<{ id?: string }>();

  const field = farm.fields.find((entry) => entry.id === params.id);
  const crop = field?.crop ?? null;

  // Only true between opening the popup and answering it, so the farmer always
  // confirms against the crop that is actually on screen.
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  /**
   * Clears the crop and returns to the field, which is now fallow.
   *
   * Replacing rather than going back matters here: with the crop gone this screen
   * has nothing left to show, and the farmer came here to look at their field.
   */
  function handleConfirmRemove() {
    if (!field) return;

    removeCrop(field.id);
    setIsConfirmingRemove(false);
    router.replace(`/field/${field.id}`);
  }


  // The growth journal tracks the same crops by name, so the field's crop can
  // borrow its season history. A field added by hand finds no entry, which is
  // honest: it has no recorded updates yet.
  const journalCrop = crop
    ? DEMO_JOURNAL_CROPS.find(
        (entry) => entry.fieldName === field?.name && entry.name === crop.name
      )
    : undefined;

  const updates = journalCrop ? updatesForCrop(DEMO_GROWTH_UPDATES, journalCrop.id) : [];
  const water = field ? DEMO_FIELD_WATER.find((entry) => entry.fieldId === field.id) : undefined;
  const waterNeed = crop ? CROP_WATER_NEEDS.find((entry) => entry.crop === crop.name) : undefined;
  const condition = crop
    ? DEMO_WEATHER_REPORT.crops.find(
        (entry) => entry.field === field?.name && entry.crop === crop.name
      )
    : undefined;
  const today = DEMO_WEATHER_REPORT.forecast[0];

  const progress = crop?.stage ? stageProgress(crop.stage) : 0;
  const countdown = crop?.expectedHarvest
    ? describeDaysToHarvest(daysUntilHarvest(crop.expectedHarvest))
    : null;

  const stageValue = crop?.stage
    ? `${crop.stage} · ${progress}%${crop.health ? ` · ${crop.health}` : ''}`
    : NOT_RECORDED;
  const harvestValue = crop?.expectedHarvest
    ? `${crop.expectedHarvest}${countdown ? ` — ${countdown}` : ''}`
    : NOT_RECORDED;

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, paddingTop: insets.top + Spacing.two },
        ]}>
        <View style={styles.inner}>
          <AuthHeader title="Crop Details" onBack={() => router.back()} />
        </View>
      </View>

      <View
        testID="crop-details-screen"
        style={styles.flex}>
        {field && crop ? (
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
            <View style={styles.inner}>
              <View
                style={[
                  styles.summary,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}>
                <View style={[styles.summaryIcon, { backgroundColor: colors.primarySoft }]}>
                  <Text style={styles.summaryEmoji}>{journalCrop?.emoji ?? '\u{1F331}'}</Text>
                </View>

                <View style={styles.summaryText}>
                  <Text style={[styles.cropName, { color: colors.text }]} numberOfLines={2}>
                    {crop.name}
                  </Text>
                  <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]} numberOfLines={2}>
                    {field.name}
                  </Text>
                </View>

                <View style={[styles.areaBadge, { backgroundColor: colors.primarySoft }]}>
                  <Text style={[styles.areaText, { color: colors.primaryDark }]}>
                    {field.areaAcres} ac
                  </Text>
                </View>
              </View>

              <SectionCard
                title="\u{1F33F} Crop Profile"
                subtitle="What is growing, when it was sown and when to harvest"
                testID="crop-profile-card">
                <DetailRow icon={'\u{1F3DE}\uFE0F'} label="Field" value={field.name} />
                <DetailRow
                  icon={'\u{1F331}'}
                  label="Variety"
                  value={crop.variety || 'Not recorded'}
                />
                <DetailRow
                  icon={'\u{1F4C5}'}
                  label="Planting Date"
                  value={crop.sownOn || NOT_RECORDED}
                />
                <DetailRow icon={'\u{1F4C8}'} label="Growth Stage" value={stageValue} />
                <DetailRow icon={'\u{1F33E}'} label="Expected Harvest" value={harvestValue} />
              </SectionCard>

              <SectionCard
                title="\u{1F4A7} Water Status"
                subtitle="What this field is holding and what the crop needs"
                testID="crop-water-card">
                {water ? (
                  <View style={styles.waterBlock}>
                    <View style={styles.waterHeader}>
                      <Text style={styles.waterEmoji}>{'\u{1F331}'}</Text>
                      <Text style={[styles.waterField, { color: colors.text }]}>
                        Field water
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor: levelTone(water.level, colors).soft,
                            borderColor: levelTone(water.level, colors).solid,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.badgeText,
                            { color: levelTone(water.level, colors).text },
                          ]}>
                          {WATER_LEVEL_LABELS[water.level]}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.waterReading, { color: colors.text }]}>
                      {water.reading}
                    </Text>
                    <Text style={[styles.waterAction, { color: colors.textSecondary }]}>
                      {water.action}
                    </Text>

                    {water.daysSinceIrrigation !== null ? (
                      <Text style={[styles.waterMeta, { color: colors.textSecondary }]}>
                        {`Last watered ${water.daysSinceIrrigation} ${
                          water.daysSinceIrrigation === 1 ? 'day' : 'days'
                        } ago`}
                      </Text>
                    ) : null}
                  </View>
                ) : (
                  <Text style={[styles.muted, { color: colors.textSecondary }]}>
                    No field water reading has been recorded for this field yet.
                  </Text>
                )}

                {waterNeed ? (
                  <View style={[styles.needRow, { borderTopColor: colors.border }]}>
                    <Text style={styles.needEmoji}>{waterNeed.emoji}</Text>
                    <Text style={[styles.needText, { color: colors.textSecondary }]}>
                      {`${waterNeed.demand} demand · ${waterNeed.frequency}`}
                    </Text>
                  </View>
                ) : null}
              </SectionCard>

              <SectionCard
                title="\u{1F324}\uFE0F Weather"
                subtitle="How this crop is coping with the current conditions"
                testID="crop-weather-card">
                {condition ? (
                  <View style={styles.waterBlock}>
                    <View style={styles.waterHeader}>
                      <Text style={styles.waterEmoji}>{condition.emoji}</Text>
                      <Text style={[styles.waterField, { color: colors.text }]}>
                        {condition.status} for {crop.name}
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor: statusTone(condition.status, colors).soft,
                            borderColor: statusTone(condition.status, colors).solid,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.badgeText,
                            { color: statusTone(condition.status, colors).text },
                          ]}>
                          {condition.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.waterReading, { color: colors.text }]}>
                      {condition.note}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.muted, { color: colors.textSecondary }]}>
                    No crop forecast note has been recorded for this crop yet.
                  </Text>
                )}

                <View style={[styles.needRow, { borderTopColor: colors.border }]}>
                  <Text style={styles.needEmoji}>{'\u{1F324}\uFE0F'}</Text>
                  <Text style={[styles.needText, { color: colors.textSecondary }]}>
                    {`Today: ${today.condition}, ${DEMO_WEATHER_REPORT.current.temperature} · ${today.rainChance} rain`}
                  </Text>
                </View>
              </SectionCard>

              <SectionCard
                title="\u{1F4C8} Growth Updates"
                subtitle="The season so far, newest first"
                testID="crop-updates-card">
                {updates.length > 0 ? (
                  <GrowthTimeline updates={updates} cropName={crop.name} />
                ) : (
                  <View style={styles.updatesEmpty}>
                    <Text style={styles.updatesEmptyEmoji}>{'\u{1F4DD}'}</Text>
                    <Text style={[styles.updatesEmptyTitle, { color: colors.text }]}>
                      No updates recorded
                    </Text>
                    <Text style={[styles.updatesEmptyBody, { color: colors.textSecondary }]}>
                      Growth entries for {crop.name} will appear here once the season is logged.
                    </Text>
                  </View>
                )}
              </SectionCard>

              <View style={styles.actions}>
                <Button
                  label="\u270F\uFE0F  Edit Crop"
                  onPress={() => router.push(`/edit-crop?id=${field.id}`)}
                  testID="edit-crop-button"
                />

                <Button
                  label="\u{1F5D1}\uFE0F  Remove Crop"
                  variant="secondary"
                  onPress={() => setIsConfirmingRemove(true)}
                  disabled={!isHydrated}
                  testID="remove-crop-button"
                />
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
            <View style={styles.inner}>
              <SectionCard title="No crop found" testID="crop-not-found-card">
                {field ? (
                  <Text style={[styles.missingText, { color: colors.textSecondary }]}>
                    Nothing is planted in {field.name} right now. Pick a crop when you are ready
                    to plant.
                  </Text>
                ) : (
                  <Text style={[styles.missingText, { color: colors.textSecondary }]}>
                    This field has not lasted from the last visit. It may have been added and then
                    lost when the app restarted, since farm details live on this device for now.
                  </Text>
                )}
                <Button label="Back to Field" onPress={() => router.back()} testID="crop-missing-back" />
              </SectionCard>
            </View>
          </ScrollView>
        )}
      </View>

      <ConfirmDialog
        visible={isConfirmingRemove}
        title="Remove this crop?"
        message={
          crop
            ? `${crop.name} will be taken off ${field?.name ?? 'this field'} and the field will be marked fallow. The field itself is not deleted.`
            : ''
        }
        confirmLabel="Remove crop"
        tone="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setIsConfirmingRemove(false)}
        testID="remove-crop-dialog"
      />
    </View>
  );
}

type Tone = {
  soft: string;
  solid: string;
  text: string;
};

/** The colour a water level is shown in, the same tones the Water screen uses. */
function levelTone(level: WaterLevel, colors: ReturnType<typeof useAgriTheme>): Tone {
  switch (level) {
    case 'adequate':
      return { soft: colors.primarySoft, solid: colors.primary, text: colors.primaryDark };
    case 'low':
    case 'due':
      return { soft: colors.warningSoft, solid: colors.warning, text: colors.warning };
    case 'not-needed':
    default:
      return { soft: colors.background, solid: colors.border, text: colors.textSecondary };
  }
}

/** The colour a weather condition is shown in, matching its urgency. */
function statusTone(status: CropStatus, colors: ReturnType<typeof useAgriTheme>): Tone {
  switch (status) {
    case 'Excellent':
    case 'Good':
      return { soft: colors.primarySoft, solid: colors.primary, text: colors.primaryDark };
    case 'Watch':
    case 'At risk':
    default:
      return { soft: colors.warningSoft, solid: colors.warning, text: colors.warning };
  }
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
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryEmoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  summaryText: {
    flex: 1,
    gap: 2,
  },
  cropName: {
    ...AgriTypography.title,
  },
  summarySubtitle: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  areaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: AgriRadius.pill,
  },
  areaText: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  detailIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  detailLabel: {
    ...AgriTypography.body,
    flex: 1,
  },
  detailValue: {
    ...AgriTypography.body,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  waterBlock: {
    gap: 4,
    paddingBottom: Spacing.two,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  waterEmoji: {
    fontSize: 16,
    lineHeight: 22,
  },
  waterField: {
    ...AgriTypography.label,
    flex: 1,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  waterReading: {
    ...AgriTypography.body,
  },
  waterAction: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  waterMeta: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  needRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
  },
  needEmoji: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  needText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    flexShrink: 1,
  },
  muted: {
    ...AgriTypography.body,
    paddingBottom: Spacing.two,
  },
  updatesEmpty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  updatesEmptyEmoji: {
    fontSize: 28,
    lineHeight: 36,
  },
  updatesEmptyTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  updatesEmptyBody: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
  missingText: {
    ...AgriTypography.body,
  },
  actions: {
    gap: Spacing.two,
  },
});