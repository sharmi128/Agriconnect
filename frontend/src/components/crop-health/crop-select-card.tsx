import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { SelectField } from '@/components/ui/select-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  ALL_CROPS_LABEL,
  cropFilterOptions,
  problemCountForCrop,
  watchNoteForCrop,
} from '@/models/crop-health';

type CropSelectCardProps = {
  crop: string;
  onCropChange: (crop: string) => void;
};

/**
 * 🌱 Select Crop.
 *
 * This is the same control as the crop chips at the top of the page, drawn as a
 * labelled dropdown, and both write the same value — so tapping a chip moves this
 * field too, and the page always agrees with itself about which crop is on
 * screen.
 *
 * The note under the field is where to look first in the chosen crop, not a
 * second list of problems. The count line is what tells a farmer that choosing a
 * crop actually did something.
 */
export function CropSelectCard({ crop, onCropChange }: CropSelectCardProps) {
  const colors = useAgriTheme();

  const options = cropFilterOptions();
  const count = problemCountForCrop(crop);

  return (
    <SectionCard
      title={'\u{1F331} Select Crop'}
      subtitle="Pick a crop to see what usually troubles it"
      testID="crop-health-crop-select">
      <View style={styles.body}>
        <SelectField
          label="Crop"
          value={crop}
          options={options}
          onChange={onCropChange}
          placeholder={ALL_CROPS_LABEL}
          testID="crop-health-select-crop"
        />

        <View
          style={[styles.note, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
          <Text style={[styles.noteTitle, { color: colors.primaryDark }]}>
            {crop ? `Where trouble starts in ${crop}` : 'Where trouble usually starts'}
          </Text>
          <Text style={[styles.noteBody, { color: colors.text }]}>{watchNoteForCrop(crop)}</Text>
        </View>

        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {crop === ''
            ? `Showing every problem in the guide: ${count} in all`
            : `${count} ${count === 1 ? 'problem' : 'problems'} covered for ${crop}`}
        </Text>
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
  count: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});