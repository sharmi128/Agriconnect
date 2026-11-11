import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_REQUIRED_DOCUMENTS,
  documentProgress,
  missingDocuments,
  type RequiredDocument,
} from '@/models/loan-support';

type RequiredDocumentsCardProps = {
  documents?: readonly RequiredDocument[];
  /** Papers the farmer has ticked off, local to this visit. */
  readyIds: readonly string[];
  onToggle: (document: RequiredDocument) => void;
};

/**
 * 📄 Required Documents.
 *
 * This is the section that saves the most wasted trips, so it is a checklist
 * rather than a list to read. Each row explains where the paper comes from and,
 * more importantly, why the office wants it, because a farmer who understands
 * that a farm record is what proves they can repay is far more willing to go and
 * find it.
 *
 * Ticks are local to the visit. Nothing here is submitted, so a tick is a note to
 * self and never claims to be a document the office has seen.
 */
export function RequiredDocumentsCard({
  documents = DEMO_REQUIRED_DOCUMENTS,
  readyIds,
  onToggle,
}: RequiredDocumentsCardProps) {
  const colors = useAgriTheme();
  const { ready, total } = documentProgress(documents, readyIds);
  const missing = missingDocuments(documents, readyIds);

  return (
    <SectionCard
      title="\u{1F4C4} Required Documents"
      subtitle="Tap a paper when you have it. Ticks are not sent anywhere."
      testID="required-documents-card">
      <View style={styles.body}>
        <View
          style={[
            styles.summary,
            { backgroundColor: ready === total ? colors.primarySoft : colors.warningSoft },
          ]}>
          <Text
            style={[
              styles.summaryText,
              { color: ready === total ? colors.primaryDark : colors.warning },
            ]}>
            {ready === total
              ? 'All papers ready. You can apply.'
              : `${ready} of ${total} ready \u00B7 ${missing.length} still to find`}
          </Text>
        </View>

        <View style={styles.list}>
          {documents.map((document, index) => {
            const isReady = readyIds.includes(document.id);

            return (
              <Pressable
                key={document.id}
                testID={`required-document-${document.id}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isReady }}
                accessibilityLabel={document.name}
                onPress={() => onToggle(document)}
                style={({ pressed }) => [
                  styles.row,
                  // A hairline between rows, but not above the first one.
                  index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                  pressed && styles.pressed,
                ]}>
                <View
                  style={[
                    styles.check,
                    { borderColor: isReady ? colors.primary : colors.borderStrong },
                    isReady && { backgroundColor: colors.primary },
                  ]}>
                  {isReady ? (
                    <Text style={[styles.checkMark, { color: colors.onPrimary }]}>
                      {'\u2713'}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.copy}>
                  <View style={styles.nameRow}>
                    <Text style={styles.emoji}>{document.emoji}</Text>
                    <Text
                      style={[
                        styles.name,
                        { color: colors.text },
                        isReady && styles.nameReady,
                      ]}
                      numberOfLines={1}>
                      {document.name}
                    </Text>
                  </View>

                  <Text style={[styles.issuedBy, { color: colors.textSecondary }]}>
                    {document.issuedBy}
                  </Text>
                  <Text style={[styles.why, { color: colors.text }]}>{document.why}</Text>

                  {document.note ? (
                    <Text style={[styles.note, { color: colors.textSecondary }]}>
                      {document.note}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  summary: {
    borderRadius: AgriRadius.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  summaryText: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: AgriRadius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 15,
    lineHeight: 21,
  },
  name: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
  },
  nameReady: {
    textDecorationLine: 'line-through',
  },
  issuedBy: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  why: {
    ...AgriTypography.caption,
    lineHeight: 19,
  },
  note: {
    ...AgriTypography.caption,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 19,
  },
});
