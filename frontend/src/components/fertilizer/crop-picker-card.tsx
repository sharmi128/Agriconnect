import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { SelectField } from '@/components/ui/select-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { CROP_OPTIONS } from '@/models/farmer-profile';
import { noteForCrop } from '@/models/fertilizer-guide';

type CropPickerCardProps = {
  crop: string;
  onCropChange: (crop: string) => void;
};

/**
 * 🌱 Select Crop.
 *
 * Choosing a crop swaps in a short note about how that crop generally feeds. The
 * options are the same crop list the Edit Profile form uses, so a farmer never
 * sees two different spellings of the same crop in one app.
 *
 * The note is deliberately descriptive rather than prescriptive. It has no
 * products and no quantities, so it points the farmer toward a conversation with
 * their local expert instead of substituting for one.
 */
export function CropPickerCard({ crop, onCropChange }: CropPickerCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u{1F331} Select Crop"
      subtitle="Pick a crop to see how it generally feeds"
      testID="fertilizer-crop-picker">
      <View style={styles.body}>
        <SelectField
          label="Crop"
          value={crop}
          options={CROP_OPTIONS}
          onChange={onCropChange}
          placeholder="Select a crop"
          testID="fertilizer-select-crop"
        />

        <View style={[styles.note, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
          <Text style={[styles.noteTitle, { color: colors.primaryDark }]}>
            {crop ? `About ${crop}` : 'About your crop'}
          </Text>
          <Text style={[styles.noteBody, { color: colors.text }]}>{noteForCrop(crop)}</Text>
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  note: {
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  noteTitle: {
    ...AgriTypography.label,
  },
  noteBody: {
    ...AgriTypography.body,
  },
});
