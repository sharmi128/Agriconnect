import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PhotoThumbnail } from '@/components/journal/photo-thumbnail';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { DEMO_JOURNAL_PHOTOS, photosForIds } from '@/models/crop-journal';

/** Cap on the library height, so it scrolls instead of filling the screen. */
const MAX_LIBRARY_HEIGHT = 300;

type PhotoPickerProps = {
  /** Ids of the photos attached so far. */
  value: string[];
  onChange: (photoIds: string[]) => void;
  /** Message from validation. When set, the label turns red. */
  error?: string;
  testID?: string;
};

/**
 * 📷 Add Photo, the photo field on the Add Growth Update form.
 *
 * The picker is built from React Native's own `Modal`, the same way the shared
 * `SelectField` builds its dropdown, so it needs no native module and looks the
 * same on iOS, Android and the web.
 *
 * The photos come from a fixed demo library rather than the device gallery. That
 * is deliberate for now: it keeps the screen working offline and avoids adding a
 * permissions-bearing dependency before the backend is connected. Swapping in
 * `expo-image-picker` later only changes this component — the timeline already
 * displays whatever ids are attached.
 */
export function PhotoPicker({ value, onChange, error, testID }: PhotoPickerProps) {
  const colors = useAgriTheme();
  const [isOpen, setIsOpen] = useState(false);

  const attached = photosForIds(value);

  /** Tapping a photo in the library attaches it, or takes it off again. */
  function toggle(photoId: string) {
    const isAttached = value.includes(photoId);

    onChange(isAttached ? value.filter((id) => id !== photoId) : [...value, photoId]);
  }

  return (
    <FieldWrapper label="📷 Add Photo" error={error}>
      {attached.length > 0 ? (
        <View style={styles.attached}>
          {attached.map((photo) => (
            <PhotoThumbnail key={photo.id} photo={photo} />
          ))}
        </View>
      ) : null}

      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel="Add Photo"
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.addButton,
          { backgroundColor: colors.surface, borderColor: colors.borderStrong },
          pressed && styles.pressed,
        ]}>
        <Text style={styles.addEmoji}>{'📷'}</Text>
        <Text style={[styles.addLabel, { color: colors.primary }]}>
          {attached.length > 0 ? 'Add another photo' : 'Add Photo'}
        </Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        // Required on Android, otherwise the hardware back button closes the
        // whole screen instead of just the picker.
        onRequestClose={() => setIsOpen(false)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close photo picker"
          style={styles.backdrop}
          onPress={() => setIsOpen(false)}>
          {/* Stops a tap on the card from bubbling up to the backdrop. */}
          <Pressable
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={(event) => event.stopPropagation()}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{'📷'} Add Photo</Text>
            <Text style={[styles.cardHint, { color: colors.textSecondary }]}>
              Tap a photo to attach it, or tap it again to take it off. The device camera
              roll will replace this library once it is connected.
            </Text>

            <ScrollView style={styles.library} contentContainerStyle={styles.libraryContent}>
              {DEMO_JOURNAL_PHOTOS.map((photo) => {
                const isAttached = value.includes(photo.id);

                return (
                  <Pressable
                    key={photo.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isAttached }}
                    accessibilityLabel={photo.caption}
                    onPress={() => toggle(photo.id)}
                    style={({ pressed }) => pressed && styles.pressed}>
                    <PhotoThumbnail photo={photo} selected={isAttached} />
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              onPress={() => setIsOpen(false)}
              style={({ pressed }) => [
                styles.doneButton,
                { borderTopColor: colors.border },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.doneLabel, { color: colors.primary }]}>
                {attached.length === 0 ? 'Done' : `Done · ${attached.length} attached`}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  attached: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  addButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: AgriRadius.medium,
    paddingHorizontal: 14,
  },
  addEmoji: {
    fontSize: 16,
    lineHeight: 22,
  },
  addLabel: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 15, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardTitle: {
    ...AgriTypography.label,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
  },
  cardHint: {
    ...AgriTypography.caption,
    fontWeight: '400',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  library: {
    maxHeight: MAX_LIBRARY_HEIGHT,
  },
  libraryContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  doneButton: {
    borderTopWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneLabel: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
});
