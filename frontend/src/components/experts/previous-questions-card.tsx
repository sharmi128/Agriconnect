import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  QUESTION_STATUS_LABELS,
  type AskedQuestion,
  type ConsultationRequest,
  type QuestionStatus,
} from '@/models/expert-consultation';

type PreviousQuestionsCardProps = {
  questions: readonly AskedQuestion[];
  /** Bookings made on this device, shown under the questions. */
  requests: readonly ConsultationRequest[];
  onClear: () => void;
};

type Badge = { soft: string; solid: string; text: string };

/**
 * 💬 Previous Questions.
 *
 * The demo rows are labelled as demo rows. A farmer has to be able to tell the
 * difference between something an expert actually wrote and something this app
 * made up, because the whole value of the section is that they can trust it later.
 * A demo answer that looks identical to a real one makes the real one worthless.
 *
 * Bookings sit under the questions because they are the farmer's own outgoing
 * request, while the questions are the conversation that comes back.
 */
export function PreviousQuestionsCard({
  questions,
  requests,
  onClear,
}: PreviousQuestionsCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u{1F4AC} Previous Questions"
      subtitle="What you have asked, and what came back"
      testID="previous-questions-card">
      <View style={styles.body}>
        {questions.length === 0 ? (
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <Text style={styles.emptyEmoji}>{'\u{1F4AC}'}</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing asked yet</Text>
            <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
              Your question will appear here once you save it above.
            </Text>
          </View>
        ) : (
          questions.map((question, index) => (
            <View
              key={question.id}
              style={[
                styles.row,
                // A hairline between rows, but not above the first one.
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
              ]}>
              <View style={styles.header}>
                <Text style={styles.crop}>{question.cropName}</Text>

                <View style={[styles.badge, { backgroundColor: statusTone(question.status, colors).soft }]}>
                  <Text
                    style={[styles.badgeText, { color: statusTone(question.status, colors).text }]}
                    numberOfLines={1}>
                    {QUESTION_STATUS_LABELS[question.status]}
                  </Text>
                </View>
              </View>

              <Text style={[styles.askedBy, { color: colors.textSecondary }]} numberOfLines={1}>
                {`To ${question.expertName} \u00B7 ${question.askedOn}`}
              </Text>

              <Text style={[styles.question, { color: colors.text }]}>{question.question}</Text>

              {question.answer ? (
                <View
                  style={[
                    styles.answer,
                    { backgroundColor: colors.primarySoft, borderColor: colors.primary },
                  ]}>
                  <Text style={[styles.answerLabel, { color: colors.primaryDark }]}>Answer</Text>
                  <Text style={[styles.answerText, { color: colors.text }]}>{question.answer}</Text>
                </View>
              ) : (
                <Text style={[styles.waiting, { color: colors.textSecondary }]}>
                  No answer yet. In this build nothing is ever sent, so it never arrives.
                </Text>
              )}

              {question.isDemo ? (
                <View style={[styles.demoTag, { backgroundColor: colors.warningSoft }]}>
                  <Text style={[styles.demoTagText, { color: colors.warning }]} numberOfLines={2}>
                    {'\u{1F4E3}'} Demo example. This is sample text, not a real reply.
                  </Text>
                </View>
              ) : null}
            </View>
          ))
        )}

        {requests.length > 0 ? (
          <View style={styles.requests}>
            <Text style={[styles.requestsTitle, { color: colors.text }]}>
              Consultation requests you made
            </Text>

            {requests.map((request, index) => (
              <View
                key={request.id}
                style={[
                  styles.requestRow,
                  // A hairline between rows, but not above the first one.
                  index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                ]}>
                <Text style={styles.requestEmoji}>{'\u{1F4C5}'}</Text>

                <View style={styles.requestCopy}>
                  <Text style={[styles.requestLine, { color: colors.text }]} numberOfLines={2}>
                    {`${request.expertName} \u00B7 ${request.slotLabel}`}
                  </Text>
                  <Text style={[styles.requestNote, { color: colors.textSecondary }]} numberOfLines={2}>
                    {`${request.mode} \u00B7 requested ${request.requestedOn}. Not sent anywhere.`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {questions.length > 0 || requests.length > 0 ? (
          <Text
            testID="previous-questions-clear"
            accessibilityRole="button"
            onPress={onClear}
            style={[styles.clear, { color: colors.danger }]}>
            Clear what is on this phone
          </Text>
        ) : null}
      </View>
    </SectionCard>
  );
}

/**
 * How a status looks.
 *
 * A question still with the expert uses the amber rather than the green, so
 * "waiting" never looks the same as "answered".
 */
function statusTone(status: QuestionStatus, colors: ReturnType<typeof useAgriTheme>): Badge {
  if (status === 'answered') {
    return { soft: colors.primarySoft, solid: colors.primary, text: colors.primaryDark };
  }

  if (status === 'closed') {
    return { soft: colors.background, solid: colors.border, text: colors.textSecondary };
  }

  return { soft: colors.warningSoft, solid: colors.warning, text: colors.warning };
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  row: {
    gap: 4,
    paddingVertical: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  crop: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    borderRadius: AgriRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  askedBy: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  question: {
    ...AgriTypography.caption,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  answer: {
    gap: 2,
    borderWidth: 1,
    borderRadius: AgriRadius.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  answerLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  answerText: {
    ...AgriTypography.caption,
    lineHeight: 19,
  },
  waiting: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  demoTag: {
    alignSelf: 'flex-start',
    borderRadius: AgriRadius.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  demoTagText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  requests: {
    gap: 0,
  },
  requestsTitle: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  requestEmoji: {
    fontSize: 15,
    lineHeight: 21,
  },
  requestCopy: {
    flex: 1,
    gap: 2,
  },
  requestLine: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  requestNote: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  clear: {
    ...AgriTypography.caption,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  emptyEmoji: {
    fontSize: 26,
    lineHeight: 34,
  },
  emptyTitle: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  emptyBody: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
});
