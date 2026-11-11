import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { SectionCard } from '@/components/ui/section-card';
import { SelectField } from '@/components/ui/select-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { SelectOption } from '@/models/farmer-profile';
import {
  CONSULTATION_MODE_LABELS,
  CONSULTATION_MODE_NOTES,
  DEMO_SLOTS,
  type ConsultationFormValues,
  type ConsultationMode,
  type Expert,
} from '@/models/expert-consultation';
import type { FieldErrors } from '@/utils/validation';

type RequestConsultationCardProps = {
  values: ConsultationFormValues;
  errors: FieldErrors<ConsultationFormValues>;
  /** The expert chosen above, so the form can explain what that person offers. */
  expert: Expert | undefined;
  /** The days that expert can actually be met, computed by the screen. */
  slotOptions: SelectOption[];
  onChange: (field: keyof ConsultationFormValues, value: string) => void;
  onSubmit: () => void;
  isRequested: boolean;
};

/**
 * 📅 Request Consultation.
 *
 * The day and the way of meeting are not independent. A Saturday slot with only
 * farm visits does not take a phone call, so the mode list is rebuilt whenever the
 * day changes and the model rejects a mismatched pair. Booking a visit on a day
 * with no visits would be a wasted journey, and the form refuses it rather than
 * letting the farmer find out at the office.
 *
 * Only four days are offered, all inside the week. A long calendar a farmer cannot
 * act on is noise.
 */
export function RequestConsultationCard({
  values,
  errors,
  expert,
  slotOptions,
  onChange,
  onSubmit,
  isRequested,
}: RequestConsultationCardProps) {
  const colors = useAgriTheme();

  const slot = DEMO_SLOTS.find((entry) => entry.id === values.slotId);
  const modeOptions = (expert?.modes ?? [])
    .filter((mode) => !slot || slot.modes.includes(mode))
    .map((mode) => ({ label: CONSULTATION_MODE_LABELS[mode], value: mode }));

  return (
    <SectionCard
      title="\u{1F4C5} Request Consultation"
      subtitle="Pick a day and a way to meet. Both must suit the expert you chose."
      testID="request-consultation-card">
      <View style={styles.form}>
        <FormAlert
          tone="info"
          message="Demo booking. This is written to this phone only. No expert is booked and no office is told."
          testID="request-consultation-demo-note"
        />

        {expert ? (
          <View style={[styles.who, { backgroundColor: colors.primarySoft }]}>
            <Text style={styles.whoEmoji}>{expert.emoji}</Text>
            <View style={styles.whoCopy}>
              <Text style={[styles.whoName, { color: colors.primaryDark }]}>{expert.name}</Text>
              <Text style={[styles.whoResponse, { color: colors.textSecondary }]}>
                {expert.responseTime}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.who, { backgroundColor: colors.background }]}>
            <Text style={styles.whoEmoji}>{'\u{1F464}'}</Text>
            <View style={styles.whoCopy}>
              <Text style={[styles.whoName, { color: colors.textSecondary }]}>
                No expert chosen yet
              </Text>
              <Text style={[styles.whoResponse, { color: colors.textSecondary }]}>
                Pick one in 👨‍🌾 Agricultural Experts above and the days will load here.
              </Text>
            </View>
          </View>
        )}

        <SelectField
          label="Which Day?"
          value={values.slotId}
          options={slotOptions}
          onChange={(value) => onChange('slotId', value)}
          placeholder={expert ? 'Choose a day' : 'Choose an expert first'}
          error={errors.slotId}
          testID="consult-select-slot"
        />

        <SelectField
          label="How Do You Want To Meet?"
          value={values.mode}
          options={modeOptions}
          onChange={(value) => onChange('mode', value)}
          placeholder={slot ? 'Choose how to meet' : 'Choose a day first'}
          error={errors.mode}
          testID="consult-select-mode"
        />

        {values.mode ? (
          <View style={[styles.modeNote, { backgroundColor: colors.waterSoft }]}>
            <Text style={[styles.modeNoteText, { color: colors.text }]}>
              {CONSULTATION_MODE_NOTES[values.mode as ConsultationMode]}
            </Text>
          </View>
        ) : null}

        {expert ? (
          <View style={styles.languages}>
            <Text style={[styles.languagesLabel, { color: colors.textSecondary }]}>
              {`\u{1F310}  Speaks: ${expert.languages.join(', ')}`}
            </Text>
          </View>
        ) : null}

        <Button
          label={isRequested ? 'Clear Request' : 'Request This Slot'}
          onPress={onSubmit}
          style={styles.submit}
          testID="consult-submit"
        />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  who: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: AgriRadius.medium,
    padding: Spacing.three,
  },
  whoEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  whoCopy: {
    flex: 1,
    gap: 2,
  },
  whoName: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  whoResponse: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  modeNote: {
    borderRadius: AgriRadius.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  modeNoteText: {
    ...AgriTypography.caption,
    lineHeight: 19,
  },
  languages: {
    flexDirection: 'row',
  },
  languagesLabel: {
    ...AgriTypography.caption,
    fontWeight: '600',
    flex: 1,
  },
  submit: {
    marginTop: Spacing.two,
  },
});
