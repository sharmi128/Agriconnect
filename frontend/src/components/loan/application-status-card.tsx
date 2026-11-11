import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  APPLICATION_STAGE_DURATIONS,
  APPLICATION_STAGE_LABELS,
  APPLICATION_STEPS,
  applicationStatusLabel,
  applicationStepsWithProgress,
  type ApplicationSnapshot,
  type ApplicationStep,
} from '@/models/loan-support';

type ApplicationStatusCardProps = {
  snapshot: ApplicationSnapshot;
  steps?: readonly ApplicationStep[];
};

/**
 * 📊 Application Status.
 *
 * The timeline is drawn as a vertical line with a marker per step, so the farmer
 * reads their position on the journey rather than a status string they have to
 * decode. Done steps are solid, the current step is ringed, and steps still ahead
 * are greyed, which is the only three states a farmer actually needs.
 *
 * `snapshot` comes from the screen: the demo one until the farmer submits, then
 * the local one the form produced. Nothing here polls, so the status only ever
 * changes because the farmer changed it.
 */
export function ApplicationStatusCard({
  snapshot,
  steps = APPLICATION_STEPS,
}: ApplicationStatusCardProps) {
  const colors = useAgriTheme();
  const timeline = applicationStepsWithProgress(steps, snapshot.stage);

  return (
    <SectionCard
      title="\u{1F4CA} Application Status"
      subtitle="Where an application normally is, and where yours is"
      testID="application-status-card">
      <View style={styles.body}>
        <View style={[styles.reference, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.referenceCopy}>
            <Text style={[styles.referenceLabel, { color: colors.textSecondary }]}>
              Reference
            </Text>
            <Text style={[styles.referenceValue, { color: colors.text }]} numberOfLines={1}>
              {snapshot.reference}
            </Text>
          </View>

          <View style={styles.referenceCopy}>
            <Text style={[styles.referenceLabel, { color: colors.textSecondary }]}>
              Submitted
            </Text>
            <Text style={[styles.referenceValue, { color: colors.text }]} numberOfLines={1}>
              {snapshot.submittedOn}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.loanName, { color: colors.text }]} numberOfLines={1}>
            {snapshot.loanName}
          </Text>
          <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.badgeText, { color: colors.primaryDark }]} numberOfLines={1}>
              {snapshot.stage ? applicationStatusLabel(snapshot) : 'Not applied'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.waiting,
            { backgroundColor: colors.warningSoft, borderColor: colors.warning },
          ]}>
          <Text style={[styles.waitingLabel, { color: colors.warning }]}>Waiting on</Text>
          <Text style={[styles.waitingText, { color: colors.text }]}>{snapshot.waitingOn}</Text>
        </View>

        <View style={styles.timeline}>
          {timeline.map((entry, index) => (
            <View key={entry.step.stage} style={styles.stepRow}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.marker,
                    { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                    entry.done && { backgroundColor: colors.primary, borderColor: colors.primary },
                    entry.current && { borderColor: colors.primary, borderWidth: 3 },
                  ]}>
                  {entry.done ? (
                    <Text style={[styles.markerCheck, { color: colors.onPrimary }]}>
                      {'\u2713'}
                    </Text>
                  ) : null}
                </View>

                {index < timeline.length - 1 ? (
                  <View
                    style={[
                      styles.line,
                      { backgroundColor: colors.border },
                      entry.done && { backgroundColor: colors.primary },
                    ]}
                  />
                ) : null}
              </View>

              <View style={styles.stepCopy}>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: entry.done || entry.current ? colors.text : colors.textSecondary },
                  ]}>
                  {entry.step.label}
                </Text>

                <Text style={[styles.stepDuration, { color: colors.textSecondary }]}>
                  {APPLICATION_STAGE_DURATIONS[entry.step.stage]}
                </Text>

                <Text style={[styles.stepDetail, { color: colors.textSecondary }]}>
                  {entry.step.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.footnote, { color: colors.textSecondary }]}>
          {`Stages: ${Object.values(APPLICATION_STAGE_LABELS).join(' \u00B7 ')}`}
        </Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  reference: {
    flexDirection: 'row',
    gap: Spacing.three,
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  referenceCopy: {
    flex: 1,
    gap: 1,
  },
  referenceLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  referenceValue: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  loanName: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    borderRadius: AgriRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  waiting: {
    gap: 2,
    borderWidth: 1,
    borderRadius: AgriRadius.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  waitingLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  waitingText: {
    ...AgriTypography.caption,
    lineHeight: 19,
  },
  timeline: {
    gap: 0,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  rail: {
    alignItems: 'center',
    width: 24,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: AgriRadius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCheck: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: Spacing.three,
  },
  stepCopy: {
    flex: 1,
    gap: 2,
    paddingBottom: Spacing.three,
  },
  stepLabel: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  stepDuration: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  stepDetail: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 19,
  },
  footnote: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '400',
  },
});
