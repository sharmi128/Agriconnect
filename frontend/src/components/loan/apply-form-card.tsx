import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { SectionCard } from '@/components/ui/section-card';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { LOAN_OPTIONS, type ApplicationFormValues } from '@/models/loan-support';
import type { FieldErrors } from '@/utils/validation';

type ApplyFormCardProps = {
  values: ApplicationFormValues;
  errors: FieldErrors<ApplicationFormValues>;
  onChange: (field: keyof ApplicationFormValues, value: string) => void;
  onSubmit: () => void;
  /** True once the farmer has submitted, which turns the button into a reset. */
  isSubmitted: boolean;
};

/**
 * 📝 Apply.
 *
 * Six fields, no more. Everything on this form is something an office will ask for
 * anyway, and every extra box is one more reason a farmer gives up halfway.
 *
 * Submitting does not send anything. It validates on the device, then hands the
 * screen a local reference number, and the card says so plainly rather than
 * pretending an application was received. A demo that says "submitted" when
 * nothing was sent teaches a farmer to trust a green tick that means nothing.
 */
export function ApplyFormCard({
  values,
  errors,
  onChange,
  onSubmit,
  isSubmitted,
}: ApplyFormCardProps) {
  return (
    <SectionCard
      title="\u{1F4DD} Apply"
      subtitle="Fill this in and write it down, or take it to the office. Nothing is sent from the app."
      testID="apply-form-card">
      <View style={styles.form}>
        <FormAlert
          tone="info"
          message="Demo form. It checks what you type and gives you a reference number to write down. No application is sent and no office sees it."
          testID="apply-form-demo-note"
        />

        {isSubmitted ? (
          <FormAlert
            tone="info"
            message="Form is ready to take to the office. Clear it to start again."
            testID="apply-form-done-note"
          />
        ) : null}

        <TextField
          label="Full Name"
          placeholder="As written on your national ID"
          value={values.fullName}
          onChangeText={(value) => onChange('fullName', value)}
          error={errors.fullName}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          testID="apply-input-name"
        />

        <TextField
          label="Phone Number"
          placeholder="e.g. +254 700 118 240"
          value={values.phone}
          onChangeText={(value) => onChange('phone', value)}
          error={errors.phone}
          keyboardType="phone-pad"
          returnKeyType="next"
          testID="apply-input-phone"
        />

        <TextField
          label="National ID Number"
          placeholder="7 or 8 digits"
          value={values.nationalId}
          onChangeText={(value) => onChange('nationalId', value)}
          error={errors.nationalId}
          keyboardType="number-pad"
          returnKeyType="next"
          testID="apply-input-id"
        />

        <SelectField
          label="Loan Applying For"
          value={values.loanId}
          options={LOAN_OPTIONS}
          onChange={(value) => onChange('loanId', value)}
          placeholder="Choose a loan from the list above"
          error={errors.loanId}
          testID="apply-select-loan"
        />

        <TextField
          label="Amount Requested"
          placeholder="e.g. 150000"
          value={values.amount}
          onChangeText={(value) => onChange('amount', value)}
          error={errors.amount}
          keyboardType="number-pad"
          returnKeyType="next"
          testID="apply-input-amount"
        />

        <TextField
          label="What Is The Money For?"
          placeholder="e.g. Seed and fertilizer for one season of paddy"
          value={values.purpose}
          onChangeText={(value) => onChange('purpose', value)}
          error={errors.purpose}
          multiline
          testID="apply-input-purpose"
        />

        <Button
          label={isSubmitted ? 'Clear Form' : 'Check And Prepare'}
          onPress={onSubmit}
          style={styles.submit}
          testID="apply-submit"
        />

        <Text style={styles.hint}>
          {isSubmitted
            ? 'Write the reference number down. The office will need it.'
            : 'Nothing leaves your phone. The check just tells you what is still missing.'}
        </Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  submit: {
    marginTop: Spacing.two,
  },
  hint: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
});
