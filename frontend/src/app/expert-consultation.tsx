import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AskQuestionCard } from '@/components/experts/ask-question-card';
import { CropSpecialistsCard } from '@/components/experts/crop-specialists-card';
import { ExpertListCard } from '@/components/experts/expert-list-card';
import { ExpertLocationCard } from '@/components/experts/expert-location-card';
import { PreviousQuestionsCard } from '@/components/experts/previous-questions-card';
import { RequestConsultationCard } from '@/components/experts/request-consultation-card';
import { AuthHeader } from '@/components/auth/auth-header';
import { FormAlert } from '@/components/ui/form-alert';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_EXPERTS,
  DEMO_QUESTIONS,
  DEMO_SLOTS,
  askQuestion,
  expertSummary,
  expertsWithin,
  questionSummary,
  questionsNewestFirst,
  requestConsultation,
  slotOptionsForExpert,
  validateConsultationForm,
  validateQuestionForm,
  type AskedQuestion,
  type ConsultationFormValues,
  type ConsultationRequest,
  type DistanceFilter,
  type Expert,
  type QuestionFormValues,
} from '@/models/expert-consultation';
import { hasErrors, type FieldErrors } from '@/utils/validation';

const EMPTY_QUESTION: QuestionFormValues = { cropName: '', question: '' };
const EMPTY_CONSULTATION: ConsultationFormValues = { expertId: '', slotId: '', mode: '' };

/**
 * Expert Consultation screen.
 *
 * The order follows how advice is actually sought. A farmer arrives with a sick
 * plant, not with a name, so the crop comes first and narrows the people, then the
 * people are read, then the two ways of using them:
 *
 * 1. 👨‍🌾 Agricultural Experts — who advises farmers, and what each one is for.
 * 2. 🌱 Crop Specialists — start from the crop instead, tap to narrow the list.
 * 3. 📍 Expert Location — how far to travel, which also filters the list above.
 * 4. 📝 Ask a Question — write it down, saved on this device only.
 * 5. 📅 Request Consultation — book a day and a way to meet.
 * 6. 💬 Previous Questions — what was asked, and what came back.
 *
 * One expert selection drives all three of the crop, question and booking sections,
 * so the page can never say the question goes to one person and the booking to
 * another.
 *
 * Nothing here talks to a server. Questions and bookings are local and say so,
 * and the demo answers are labelled as demo text, because a sample reply that
 * looks like a real one makes the real one worthless later.
 */
export default function ExpertConsultationScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();

  // The demo list is readonly, so it is copied before it becomes state.
  const [questions, setQuestions] = useState<AskedQuestion[]>(() => [...DEMO_QUESTIONS]);
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('all');
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [questionValues, setQuestionValues] = useState<QuestionFormValues>(EMPTY_QUESTION);
  const [questionErrors, setQuestionErrors] = useState<FieldErrors<QuestionFormValues>>({});
  const [consultValues, setConsultValues] = useState<ConsultationFormValues>(EMPTY_CONSULTATION);
  const [consultErrors, setConsultErrors] = useState<FieldErrors<ConsultationFormValues>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [sequence, setSequence] = useState(0);

  const visibleExperts = expertsWithin(DEMO_EXPERTS, distanceFilter);
  const selectedExpert = DEMO_EXPERTS.find((expert) => expert.id === selectedExpertId);
  const history = questionsNewestFirst(questions);

  /**
   * Choosing an expert fills the booking form and the question target at once.
   *
   * The distance filter is left alone on purpose: narrowing the list is a
   * different decision from choosing a person, and changing one should not undo
   * the other.
   */
  function handleExpertSelect(expert: Expert) {
    setSelectedExpertId((current) => (current === expert.id ? '' : expert.id));
    setConsultValues((current) => ({ ...current, expertId: expert.id }));
    setConsultErrors((current) => ({ ...current, expertId: undefined }));
    setNotice(null);
  }

  function handleCropSelect(cropName: string) {
    setQuestionValues((current) => ({ ...current, cropName }));
    setQuestionErrors((current) => ({ ...current, cropName: undefined }));
  }

  function handleQuestionChange(field: keyof QuestionFormValues, value: string) {
    setQuestionValues((current) => ({ ...current, [field]: value }));
    setQuestionErrors((current) => ({ ...current, [field]: undefined }));
  }

  /**
   * Changing the day rebuilds the mode list, so a mode left over from the
   * previous day is cleared rather than silently offered and then rejected.
   */
  function handleConsultChange(field: keyof ConsultationFormValues, value: string) {
    setConsultValues((current) => {
      if (field !== 'slotId') {
        return { ...current, [field]: value };
      }

      const slot = DEMO_SLOTS.find((entry) => entry.id === value);
      const stillOffered =
        current.mode.length > 0 && slot ? slot.modes.includes(current.mode as never) : false;

      return { ...current, slotId: value, mode: stillOffered ? current.mode : '' };
    });
    setConsultErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleAsk() {
    const nextErrors = validateQuestionForm(questionValues);

    if (hasErrors(nextErrors)) {
      setQuestionErrors(nextErrors);
      return;
    }

    const draft = askQuestion(questionValues, selectedExpert, sequence + 1);

    if (draft) {
      setQuestions((current) => [draft, ...current]);
      setSequence(sequence + 1);
      setQuestionValues(EMPTY_QUESTION);
      setNotice(
        `\u{1F4DD} Question saved on this phone. ${draft.expertName} has not been told, and no answer will arrive in this build.`
      );
    }
  }

  function handleRequest() {
    const nextErrors = validateConsultationForm(consultValues);

    if (hasErrors(nextErrors)) {
      setConsultErrors(nextErrors);
      return;
    }

    const request = requestConsultation(consultValues, selectedExpert, sequence + 1);

    if (request) {
      setRequests((current) => [request, ...current]);
      setSequence(sequence + 1);
      setNotice(
        `\u{1F4C5} Request written down for ${request.slotLabel}. Nothing was booked and ${request.expertName} has not been told.`
      );
    }
  }

  function handleClear() {
    setQuestions([...DEMO_QUESTIONS]);
    setRequests([]);
    setQuestionValues(EMPTY_QUESTION);
    setQuestionErrors({});
    setConsultValues(EMPTY_CONSULTATION);
    setConsultErrors({});
    setSequence(0);
    setNotice(null);
  }

  // Only the days the chosen expert can actually be met, so an empty dropdown is
  // impossible when an expert is selected.
  const slotOptions = slotOptionsForExpert(selectedExpert);

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Expert Consultation"
              subtitle={`${expertSummary(visibleExperts)} \u00B7 ${questionSummary(history)}`}
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="expert-consultation-screen"
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <View style={styles.inner}>
            {notice ? <FormAlert tone="info" message={notice} testID="expert-notice" /> : null}

            {/* 👨‍🌾 Agricultural Experts */}
            <ExpertListCard
              experts={visibleExperts}
              onSelect={handleExpertSelect}
              selectedExpertId={selectedExpertId}
            />

            {/* 🌱 Crop Specialists */}
            <CropSpecialistsCard
              experts={visibleExperts}
              selectedCropName={questionValues.cropName}
              onSelectCrop={handleCropSelect}
            />

            {/* 📍 Expert Location */}
            <ExpertLocationCard
              experts={visibleExperts}
              value={distanceFilter}
              onChange={setDistanceFilter}
              onSelect={handleExpertSelect}
            />

            {/* 📝 Ask a Question */}
            <AskQuestionCard
              values={questionValues}
              errors={questionErrors}
              onChange={handleQuestionChange}
              onSubmit={handleAsk}
              isAsked={questions.some((question) => !question.isDemo)}
              expertName={selectedExpert?.name ?? 'Nobody chosen yet'}
            />

            {/* 📅 Request Consultation */}
            <RequestConsultationCard
              values={consultValues}
              errors={consultErrors}
              expert={selectedExpert}
              slotOptions={slotOptions}
              onChange={handleConsultChange}
              onSubmit={handleRequest}
              isRequested={requests.length > 0}
            />

            {/* 💬 Previous Questions */}
            <PreviousQuestionsCard
              questions={history}
              requests={requests}
              onClear={handleClear}
            />

            <Text style={[styles.footnote, { color: colors.textSecondary }]}>
              Demo data only. Nobody on this screen has been contacted. Advice on a crop, a
              disease or a spray is worth taking from your own agricultural officer in person,
              and an app is only a first step towards finding them.
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
