import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { ApplyFormCard } from '@/components/loan/apply-form-card';
import { ApplicationStatusCard } from '@/components/loan/application-status-card';
import { HelpContactCard } from '@/components/loan/help-contact-card';
import { LoanInformationCard } from '@/components/loan/loan-information-card';
import { RequiredDocumentsCard } from '@/components/loan/required-documents-card';
import { SupportProgramsCard } from '@/components/loan/support-programs-card';
import { AuthHeader } from '@/components/auth/auth-header';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useFarmerProfile } from '@/context/farmer-profile-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_APPLICATION,
  DEMO_LOANS,
  DEMO_REQUIRED_DOCUMENTS,
  DEMO_SUPPORT_PROGRAMS,
  formFromProfile,
  loanSummary,
  submitApplication,
  validateApplicationForm,
  type ApplicationFormValues,
  type ApplicationSnapshot,
  type LoanOption,
  type RequiredDocument,
} from '@/models/loan-support';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Loan & Support screen.
 *
 * The order is the argument. A farmer who is short of money should see the
 * schemes that might not need a loan at all before they see borrowing, so
 * 📋 Support Programs comes above 💰 Loan Information, and 📄 Required Documents
 * comes before 📝 Apply, because the papers are the part that actually stops an
 * application.
 *
 * 1. 📋 Support Programs — subsidies, grants and training that need no loan.
 * 2. 💰 Loan Information — the loans, and what each one is really for.
 * 3. 📄 Required Documents — a checklist, ticked local to the visit.
 * 4. 📝 Apply — a six-field form that validates on the device and stops there.
 * 5. 📊 Application Status — the four steps an application goes through.
 * 6. 📞 Help & Contact — real counters, opened through the dialler.
 *
 * Nothing on this page talks to a server. Submitting the form produces a local
 * reference number and a local application; the status card shows that one
 * instead of the demo snapshot. Both reset when the app restarts, which is why
 * the form says so rather than implying an office received anything.
 */
export default function LoanSupportScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useFarmerProfile();

  // The profile's name pre-fills the form, unless it is still the placeholder,
  // which would be worse than an empty box on a form an office reads.
  const [values, setValues] = useState<ApplicationFormValues>(() => formFromProfile(profile.name));
  const [errors, setErrors] = useState<FieldErrors<ApplicationFormValues>>({});
  const [readyIds, setReadyIds] = useState<string[]>([]);
  const [application, setApplication] = useState<ApplicationSnapshot | null>(null);
  const [submitCount, setSubmitCount] = useState(0);

  const snapshot = application ?? DEMO_APPLICATION;

  /** Updates one field and clears its error as soon as the farmer types. */
  function handleChange(field: keyof ApplicationFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleDocumentToggle(document: RequiredDocument) {
    setReadyIds((current) =>
      current.includes(document.id)
        ? current.filter((id) => id !== document.id)
        : [...current, document.id]
    );
  }

  /** Tapping a loan above fills the dropdown below, so it is not chosen twice. */
  function handleLoanSelect(loan: LoanOption) {
    handleChange('loanId', loan.id);
  }

  function handleSubmit() {
    const nextErrors = validateApplicationForm(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    // The counter is state, not a random number, so two applications in one
    // session cannot land on the same reference.
    setSubmitCount((count) => count + 1);

    const result = submitApplication(values, submitCount + 1);

    if (result) {
      setApplication(result);
      setErrors({});
    }
  }

  function handleClear() {
    setValues(formFromProfile(profile.name));
    setErrors({});
    setApplication(null);
  }

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Loan & Support"
              subtitle={loanSummary(DEMO_LOANS, DEMO_SUPPORT_PROGRAMS)}
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="loan-support-screen"
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <View style={styles.inner}>
            {/* 📋 Support Programs */}
            <SupportProgramsCard />

            {/* 💰 Loan Information */}
            <LoanInformationCard
              loans={DEMO_LOANS}
              onSelect={handleLoanSelect}
              selectedLoanId={values.loanId}
            />

            {/* 📄 Required Documents */}
            <RequiredDocumentsCard
              documents={DEMO_REQUIRED_DOCUMENTS}
              readyIds={readyIds}
              onToggle={handleDocumentToggle}
            />

            {/* 📝 Apply */}
            <ApplyFormCard
              values={values}
              errors={errors}
              onChange={handleChange}
              onSubmit={application ? handleClear : handleSubmit}
              isSubmitted={application !== null}
            />

            {/* 📊 Application Status */}
            <ApplicationStatusCard snapshot={snapshot} />

            {/* 📞 Help & Contact */}
            <HelpContactCard />

            <Text style={[styles.footnote, { color: colors.textSecondary }]}>
              Demo data only. The rates, penalties and repayment dates a lender gives you are
              the ones that count, and they only come from the lender or your local
              agricultural officer.
            </Text>
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
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
  footnote: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 19,
  },
});
