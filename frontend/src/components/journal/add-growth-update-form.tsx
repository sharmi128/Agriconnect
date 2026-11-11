import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PhotoPicker } from '@/components/journal/photo-picker';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  CROP_STAGE_OPTIONS,
  cropOptionsFor,
  isCropStage,
  type JournalCrop,
} from '@/models/crop-journal';
import { formatToday } from '@/models/expenses';
import type { CropStage } from '@/models/farm';
import {
  MAX_NOTE_LENGTH,
  validateGrowthUpdate,
  type GrowthUpdateFormValues,
} from '@/utils/journal-validation';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/** What the form hands back once a valid update has been written. */
export type GrowthUpdateDraft = {
  cropId: string;
  stage: CropStage;
  note: string;
  photoIds: string[];
};

type AddGrowthUpdateFormProps = {
  crops: JournalCrop[];
  /** The crop selected on the My Crops list, which the form starts on. */
  selectedCropId: string;
  /** Called when the crop changes here, so the timeline above follows along. */
  onCropChange: (cropId: string) => void;
  onSubmit: (draft: GrowthUpdateDraft) => void;
};

/**
 * 📝 Add Growth Update, the journal's entry form.
 *
 * The crop defaults to whichever crop is selected on the list above, so the
 * common case — logging something about the crop you are already looking at —
 * needs no extra taps. Changing the crop here also moves the timeline, so the
 * two never disagree about what is being written about.
 *
 * The date is today's date rather than a field: an update is always something
 * that happened now, and that avoids shipping a date picker before one is
 * needed.
 */
export function AddGrowthUpdateForm({
  crops,
  selectedCropId,
  onCropChange,
  onSubmit,
}: AddGrowthUpdateFormProps) {
  const colors = useAgriTheme();

  const [stage, setStage] = useState('');
  const [note, setNote] = useState('');
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors<GrowthUpdateFormValues>>({});

  function handleSubmit() {
    const nextErrors = validateGrowthUpdate({ cropId: selectedCropId, stage, note });

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    // Validation above guarantees this, and the guard keeps the cast out.
    if (!isCropStage(stage)) {
      return;
    }

    onSubmit({ cropId: selectedCropId, stage, note, photoIds });

    // Clear the form, so the next update starts blank.
    setStage('');
    setNote('');
    setPhotoIds([]);
    setErrors({});
  }

  return (
    <View
      testID="add-growth-update-form"
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Saved with today&apos;s date, {formatToday()}. The crop&apos;s stage moves to the stage
        you pick here.
      </Text>

      <SelectField
        label="Crop"
        value={selectedCropId}
        options={cropOptionsFor(crops)}
        onChange={onCropChange}
        placeholder="Select a crop"
        error={errors.cropId}
        testID="journal-update-crop"
      />

      <SelectField
        label="Growth Stage"
        value={stage}
        options={CROP_STAGE_OPTIONS}
        onChange={(value) => {
          setStage(value);
          setErrors((current) => ({ ...current, stage: undefined }));
        }}
        placeholder="Which stage is the crop at?"
        error={errors.stage}
        testID="journal-update-stage"
      />

      <TextField
        label="What did you see?"
        value={note}
        onChangeText={(value) => {
          setNote(value);
          setErrors((current) => ({ ...current, note: undefined }));
        }}
        placeholder="For example: first flowers opened on the south side"
        error={errors.note}
        multiline
        testID="journal-update-note"
      />

      <Text style={[styles.counter, { color: colors.textSecondary }]}>
        {note.trim().length} / {MAX_NOTE_LENGTH} characters
      </Text>

      <PhotoPicker value={photoIds} onChange={setPhotoIds} testID="journal-update-photo" />

      <Button
        label="Save Growth Update"
        onPress={handleSubmit}
        testID="journal-save-update"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: Spacing.three,
  },
  hint: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  counter: {
    ...AgriTypography.caption,
    fontSize: 12,
    marginTop: -Spacing.two,
  },
});
