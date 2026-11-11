import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { SOIL_NOTES, WATER_NOTES, type SoilNote, type WaterNote } from '@/models/fertilizer-guide';

type NoteRowProps = {
  note: SoilNote | WaterNote;
  /** A hairline above the row, hidden on the first one. */
  divider: boolean;
};

function NoteRow({ note, divider }: NoteRowProps) {
  const colors = useAgriTheme();

  return (
    <View style={[styles.noteRow, divider && { borderTopColor: colors.border, borderTopWidth: 1 }]}>
      <Text style={styles.noteEmoji}>{note.emoji}</Text>

      <View style={styles.noteCopy}>
        <Text style={[styles.noteTitle, { color: colors.text }]}>{note.title}</Text>
        <Text style={[styles.noteDetail, { color: colors.textSecondary }]}>{note.detail}</Text>
      </View>
    </View>
  );
}

/**
 * 💧 Soil and Water Considerations.
 *
 * The two halves answer the same question from opposite ends. Soil decides how
 * long nutrients stay available and how water moves through the field; the state
 * of the soil's moisture decides whether anything you apply is taken up at all.
 * Reading them together is what turns a fertilizer bag into a decision.
 */
export function SoilWaterCard() {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u{1F4A7} Soil & Water Considerations"
      subtitle="What your soil is, and how wet it is, decides what actually reaches the roots"
      testID="fertilizer-soil-water">
      <View style={styles.body}>
        <Text style={[styles.groupTitle, { color: colors.text }]}>Soil type</Text>

        {SOIL_NOTES.map((note, index) => (
          <NoteRow key={note.id} note={note} divider={index > 0} />
        ))}

        <Text style={[styles.groupTitle, styles.groupTitleSpaced, { color: colors.text }]}>
          Soil moisture
        </Text>

        {WATER_NOTES.map((note, index) => (
          <NoteRow key={note.id} note={note} divider={index > 0} />
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 0,
  },
  groupTitle: {
    ...AgriTypography.label,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  groupTitleSpaced: {
    marginTop: Spacing.four,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  noteEmoji: {
    fontSize: 18,
    lineHeight: 24,
    width: 26,
    textAlign: 'center',
  },
  noteCopy: {
    flex: 1,
    gap: 2,
  },
  noteTitle: {
    ...AgriTypography.label,
  },
  noteDetail: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
});
