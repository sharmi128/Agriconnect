import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { FarmOverviewCard } from '@/components/farm/farm-overview-card';
import { FieldCard } from '@/components/farm/field-card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useFarm } from '@/context/farm-context';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { summarizeFarm, type FarmField } from '@/models/farm';

/**
 * My Farm, the tab that lists the farmer's fields and what is growing in them.
 *
 * The farm is held in the shared farm context and saved to the device, so a field
 * added today is still on this list the next time the app is opened, and a field
 * deleted here stays off it. The location comes from the shared farmer profile,
 * so it matches the Profile screen and the Home dashboard.
 *
 * Each field can be opened, edited or deleted from its card. Deleting asks first
 * and names the field, because a plot is a real thing with a crop in it and there
 * is no undo.
 */
export default function MyFarmScreen() {
  const colors = useAgriTheme();
  const { profile } = useFarmerProfile();
  const { farm, deleteField, isHydrated } = useFarm();
  const insets = useSafeAreaInsets();

  const fields = farm.fields;
  const { fallowCount } = summarizeFarm(fields);

  // Held until the farmer answers, so the confirmation always names the field it
  // is about to remove rather than whichever card was tapped last.
  const [pendingDelete, setPendingDelete] = useState<FarmField | null>(null);

  /**
   * Called when Add Field is tapped. Opens the Add Field form, which writes the
   * saved field into the shared farm and comes back here.
   */
  function handleAddField() {
    router.push('/add-field');
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;

    deleteField(pendingDelete.id);
    setPendingDelete(null);
  }

  return (
    <PaddyBackground>
      <ScrollView
        testID="my-farm-screen"
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          },
        ]}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>My Farm</Text>
            <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>
              {fallowCount > 0
                ? `${fallowCount} of ${fields.length} fields are fallow`
                : 'All fields are planted'}
            </Text>
          </View>

          <FarmOverviewCard
            farmName={farm.name}
            location={profile.location}
            fields={fields}
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {fields.length === 1 ? 'Field' : 'Fields'}
          </Text>

          {fields.length > 0 ? (
            fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onPress={() => router.push(`/field/${field.id}`)}
                onEdit={() => router.push(`/edit-field?id=${field.id}`)}
                onDelete={() => setPendingDelete(field)}
              />
            ))
          ) : (
            <SectionCard title="No fields yet" testID="farm-empty-card">
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Count your first plot to start the farm total and plant a crop in it. Fields
                you add are saved on this device.
              </Text>
            </SectionCard>
          )}

          <Button
            label="\u{1F4CD}  Add Field"
            variant="secondary"
            onPress={handleAddField}
            testID="add-field-button"
          />

          {isHydrated ? null : (
            <Text style={[styles.loadingNote, { color: colors.textSecondary }]}>
              Loading your saved fields...
            </Text>
          )}
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Delete this field?"
        message={
          pendingDelete
            ? `${pendingDelete.name} and everything recorded about it will be removed from your farm. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete field"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
        testID="delete-field-dialog"
      />
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
  header: {
    gap: 2,
  },
  screenTitle: {
    ...AgriTypography.title,
  },
  screenSubtitle: {
    ...AgriTypography.body,
  },
  sectionTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  emptyText: {
    ...AgriTypography.body,
    fontWeight: '400',
  },
  loadingNote: {
    ...AgriTypography.caption,
    textAlign: 'center',
  },
});
