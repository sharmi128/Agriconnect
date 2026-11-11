import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { SelectField } from '@/components/ui/select-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { CROP_STAGE_OPTIONS, isCropStage } from '@/models/crop-journal';
import { FERTILIZER_DISCLAIMER, noteForStage } from '@/models/fertilizer-guide';
import type { CropStage } from '@/models/farm';

type GrowthStageCardProps = {
  stage: CropStage;
  onStageChange: (stage: CropStage) => void;
};

/**
 * 🌿 Crop Growth Stage.
 *
 * The dropdown offers the same stages the 🌾 Harvest screen uses, so a farmer
 * tracking a crop in the journal sees identical wording in both places. Choosing a
 * stage shows what the plant is doing at that point and what usually deserves
 * attention.
 *
 * The disclaimer is repeated here on purpose. This is the card a farmer is most
 * likely to be reading when they want a number, so the reminder that the number
 * comes from a local expert and the product label sits right under the answer.
 */
export function GrowthStageCard({ stage, onStageChange }: GrowthStageCardProps) {
  const colors = useAgriTheme();
  const note = noteForStage(stage);

  return (
    <SectionCard
      title="\u{1F33F} Crop Growth Stage"
      subtitle="What the plant is doing right now, and what it usually needs"
      testID="fertilizer-growth-stage">
      <View style={styles.body}>
        <SelectField
          label="Growth stage"
          value={stage}
          options={CROP_STAGE_OPTIONS}
          onChange={(value) => {
            // The dropdown only offers real stages, but the value arrives as a
            // plain string, so it is narrowed here rather than in the screen.
            if (isCropStage(value)) {
              onStageChange(value);
            }
          }}
          placeholder="Select a growth stage"
          testID="fertilizer-select-stage"
        />

        {note ? (
          <View style={[styles.note, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
            <Text style={[styles.noteFocus, { color: colors.primaryDark }]}>{note.focus}</Text>
            <Text style={[styles.noteBody, { color: colors.text }]}>{note.note}</Text>
          </View>
        ) : null}

        <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>{FERTILIZER_DISCLAIMER}</Text>
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
  noteFocus: {
    ...AgriTypography.label,
  },
  noteBody: {
    ...AgriTypography.body,
  },
  disclaimer: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});
