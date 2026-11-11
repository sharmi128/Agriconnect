import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useFarm } from '@/context/farm-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  daysUntilHarvest,
  describeDaysToHarvest,
  stageProgress,
} from '@/models/crop-journal';
import type { FarmField } from '@/models/farm';

/** A text row inside the details card: emoji, label on the left, value right. */
function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const colors = useAgriTheme();

  return (
    <View
      style={[
        styles.detailRow,
        { borderTopColor: colors.border },
      ]}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const NOT_RECORDED = 'Not set';

/**
 * 🏞️ Field Details, opened by tapping a field on My Farm.
 *
 * Shows the facts the farmer recorded about one plot: what it is called, how big
 * it is, where it is, what is planted and how it is watered. The 📈 growth stage
 * and 📅 expected harvest only appear when they have been recorded — a field added
 * yesterday has "Not added yet", not a made-up date.
 *
 * Every field can be viewed, edited and deleted from here, and a fallow one can
 * be planted straight away. Deleting asks first and takes the farmer back to My
 * Farm, because the plot is only removed from the list once it is confirmed and
 * there is nothing left on this page to come back to.
 */
export default function FieldDetailsScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { farm, deleteField, isHydrated } = useFarm();
  const params = useLocalSearchParams<{ id?: string }>();

  const field = farm.fields.find((entry) => entry.id === params.id);

  // Only true between opening the popup and answering it, so the confirmation
  // always names the field the farmer is actually looking at.
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  /** Removes the field and returns to My Farm, which no longer lists it. */
  function handleConfirmDelete() {
    if (!field) return;

    deleteField(field.id);
    setIsConfirmingDelete(false);
    router.replace('/farm');
  }

  const recordedDetails = [field?.location, field?.irrigation, field?.soil]
    .filter(Boolean)
    .join(' · ');

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader title="Field Details" onBack={() => router.back()} />
          </View>
        </View>

        <ScrollView
          testID="field-details-screen"
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {field ? (
              <>
                <View
                  style={[
                    styles.summary,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <View style={[styles.summaryIcon, { backgroundColor: colors.primarySoft }]}>
                    <Text style={styles.summaryEmoji}>{'\u{1F3DE}\uFE0F'}</Text>
                  </View>

                  <View style={styles.summaryText}>
                    <Text style={[styles.fieldName, { color: colors.text }]} numberOfLines={2}>
                      {field.name}
                    </Text>
                    {recordedDetails ? (
                      <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]} numberOfLines={2}>
                        {recordedDetails}
                      </Text>
                    ) : field.note ? (
                      <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]} numberOfLines={2}>
                        {field.note}
                      </Text>
                    ) : null}
                  </View>

                  <View style={[styles.areaBadge, { backgroundColor: colors.primarySoft }]}>
                    <Text style={[styles.areaText, { color: colors.primaryDark }]}>
                      {field.areaAcres} ac
                    </Text>
                  </View>
                </View>

                <SectionCard
                  title="\u{1F4CB} Field Details"
                  subtitle="What this plot is called and how it is worked"
                  testID="field-details-card">
                  <DetailRow
                    icon={'\u{1F4CD}'}
                    label="Location"
                    value={field.location || NOT_RECORDED}
                  />
                  <DetailRow
                    icon={'\u{1F33E}'}
                    label="Current Crop"
                    value={field.crop?.name ?? 'Fallow'}
                  />
                  <DetailRow
                    icon={'\u{1F33F}'}
                    label="Soil Type"
                    value={field.soil || NOT_RECORDED}
                  />
                  <DetailRow
                    icon={'\u{1F4A7}'}
                    label="Irrigation Type"
                    value={field.irrigation || NOT_RECORDED}
                  />
                </SectionCard>

                <SectionCard
                  title="\u{1F33E} Crop Progress"
                  subtitle={
                    field.crop
                      ? `How far along the ${field.crop.name} crop is`
                      : 'Nothing planted in this field'
                  }
                  testID="crop-progress-card">
                  {field.crop ? (
                    <Pressable
                      testID="open-crop-details"
                      accessibilityRole="button"
                      accessibilityLabel={`Open details for the ${field.crop.name} crop`}
                      onPress={() => router.push(`/field/${field.id}/crop`)}
                      style={({ pressed }) => pressed && styles.pressed}>
                      <CropProgress crop={field.crop} />

                      <View
                        style={[styles.openCropRow, { borderTopColor: colors.border }]}>
                        <Text style={[styles.openCropText, { color: colors.primaryDark }]}>
                          See full crop details
                        </Text>
                        <Text style={[styles.openCropText, { color: colors.primaryDark }]}>
                          {'\u203A'}
                        </Text>
                      </View>
                    </Pressable>
                  ) : (
                    <View style={styles.fallow}>
                      <Text style={styles.fallowEmoji}>{'\u{1F331}'}</Text>
                      <Text style={[styles.fallowTitle, { color: colors.text }]}>
                        Fallow field
                      </Text>
                      <Text style={[styles.fallowDetail, { color: colors.textSecondary }]}>
                        This plot is resting. Pick a crop when you are ready to plant.
                      </Text>

                      <Button
                        label="\u{1F331}  Plant a Crop"
                        variant="secondary"
                        onPress={() => router.push(`/add-crop?id=${field.id}`)}
                        testID="plant-crop-button"
                      />
                    </View>
                  )}
                </SectionCard>

                <View style={styles.actions}>
                  <Button
                    label="\u270F\uFE0F  Edit Field"
                    onPress={() => router.push(`/edit-field?id=${field.id}`)}
                    testID="edit-field-button"
                  />

                  <Button
                    label="\u{1F5D1}\uFE0F  Delete Field"
                    variant="secondary"
                    onPress={() => setIsConfirmingDelete(true)}
                    disabled={!isHydrated}
                    testID="delete-field-button"
                  />
                </View>
              </>
            ) : (
              <SectionCard title="Field not found" testID="field-not-found-card">
                <Text style={[styles.missingText, { color: colors.textSecondary }]}>
                  This field is no longer on the farm. It may have been deleted, or
                  it may have been added on a device that no longer has it saved.
                </Text>
                <Button label="Back to My Farm" onPress={() => router.back()} testID="missing-back" />
              </SectionCard>
            )}
          </View>
        </ScrollView>

        <ConfirmDialog
          visible={isConfirmingDelete}
          title="Delete this field?"
          message={
            field
              ? `${field.name} and everything recorded about it will be removed from your farm. This cannot be undone.`
              : ''
          }
          confirmLabel="Delete field"
          tone="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
          testID="delete-field-dialog"
        />
      </View>
    </PaddyBackground>
  );

  type CropProgressProps = {
    crop: NonNullable<FarmField['crop']>;
  };

  /** 📈 growth stage and 📅 expected harvest for a planted field. */
  function CropProgress({ crop }: CropProgressProps) {
    const colors = useAgriTheme();

    const hasStage = Boolean(crop.stage);
    const progress = crop.stage ? stageProgress(crop.stage) : 0;
    const days = crop.expectedHarvest ? daysUntilHarvest(crop.expectedHarvest) : null;
    const countdown = crop.expectedHarvest ? describeDaysToHarvest(days) : null;

    return (
      <View style={styles.cropProgress}>
        <View style={styles.row}>
          <Text style={styles.rowIcon}>{'\u{1F4C8}'}</Text>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              Crop Growth Stage
            </Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>
              {hasStage
                ? `${crop.stage} · ${progress}%${crop.health ? ` · ${crop.health}` : ''}`
                : 'Not added yet'}
            </Text>
          </View>
        </View>

        {hasStage ? (
          <View style={styles.progressBlock}>
            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <View
                style={[styles.fill, { backgroundColor: colors.primary, width: `${progress}%` }]}
              />
            </View>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              {progress}% of the growing season
            </Text>
          </View>
        ) : null}

        <View style={styles.row}>
          <Text style={styles.rowIcon}>{'\u{1F4C5}'}</Text>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              Expected Harvest
            </Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>
              {crop.expectedHarvest ? crop.expectedHarvest : 'Not added yet'}
            </Text>
            {countdown && crop.expectedHarvest ? (
              <Text style={[styles.rowHint, { color: colors.textSecondary }]}>{countdown}</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
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
  fieldName: {
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
  fallow: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  fallowEmoji: {
    fontSize: 32,
    lineHeight: 38,
  },
  fallowTitle: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  fallowDetail: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
  cropProgress: {
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  openCropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingTop: Spacing.two,
    marginTop: Spacing.two,
    borderTopWidth: 1,
  },
  openCropText: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  rowIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  rowValue: {
    ...AgriTypography.label,
  },
  rowHint: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  progressBlock: {
    gap: Spacing.one,
    marginLeft: 24 + Spacing.two,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  missingText: {
    ...AgriTypography.body,
  },
  actions: {
    gap: Spacing.two,
  },
});