import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { SectionCard } from '@/components/ui/section-card';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { EXPERT_CROP_OPTIONS, type QuestionFormValues } from '@/models/expert-consultation';
import type { FieldErrors } from '@/utils/validation';

type AskQuestionCardProps = {
  values: QuestionFormValues;
  errors: FieldErrors<QuestionFormValues>;
  onChange: (field: keyof QuestionFormValues, value: string) => void;
  onSubmit: () => void;
  isAsked: boolean;
  /** Who the question will go to, so the farmer can see before they write. */
  expertName: string;
};

/**
 * 📝 Ask a Question.
 *
 * Two fields, and the crop dropdown reuses the app's own crop list so a farmer
 * cannot invent a crop that no expert covers.
 *
 * The note about what makes a good question is not decoration. The single most
 * common reason a question comes back unanswered is that it does not say what was
 * seen, so the honest prompts are given here rather than left to the expert to ask
 * for on a second round trip.
 *
 * Nothing is sent. The button writes the question to 💬 Previous Questions on this
 * device and says so, because a green tick implying a real expert was notified is
 * exactly the kind of lie a demo should not tell.
 */
export function AskQuestionCard({
  values,
  errors,
  onChange,
  onSubmit,
  isAsked,
  expertName,
}: AskQuestionCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u{1F4DD} Ask a Question"
      subtitle="Say what you saw, and where. That is what gets a real answer."
      testID="ask-question-card">
      <View style={styles.form}>
        <FormAlert
          tone="info"
          message="Demo form. Your question is saved on this phone and listed under Previous Questions. No expert is notified and nothing is sent."
          testID="ask-question-demo-note"
        />

        <View style={styles.target}>
          <Text style={[styles.targetLabel, { color: colors.textSecondary }]}>
            Going to
          </Text>
          <Text style={[styles.targetValue, { color: colors.text }]} numberOfLines={1}>
            {expertName}
          </Text>
          <Text style={[styles.targetHint, { color: colors.textSecondary }]}>
            Pick an expert in 👨‍🌾 Agricultural Experts or 🌱 Crop Specialists above.
          </Text>
        </View>

        <SelectField
          label="Which Crop?"
          value={values.cropName}
          options={EXPERT_CROP_OPTIONS}
          onChange={(value) => onChange('cropName', value)}
          placeholder="Choose a crop"
          error={errors.cropName}
          testID="question-select-crop"
        />

        <TextField
          label="Your Question"
          placeholder="e.g. The lower leaves on my tomato are going yellow from the bottom up"
          value={values.question}
          onChangeText={(value) => onChange('question', value)}
          error={errors.question}
          multiline
          testID="question-input-text"
        />

        <View style={styles.hints}>
          <Text style={[styles.hintTitle, { color: colors.text }]}>A question that gets answered says:</Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            {'\u2022'} Which crop, and which field
          </Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            {'\u2022'} What you can see, and where on the plant
          </Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            {'\u2022'} When it started, and what changed since
          </Text>
        </View>

        <Button
          label={isAsked ? 'Clear Question' : 'Save Question'}
          onPress={onSubmit}
          style={styles.submit}
          testID="question-submit"
        />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  target: {
    gap: 2,
  },
  targetLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  targetValue: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  targetHint: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  hints: {
    gap: 2,
  },
  hintTitle: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  hint: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  submit: {
    marginTop: Spacing.two,
  },
});
