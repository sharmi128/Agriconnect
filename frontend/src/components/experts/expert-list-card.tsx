import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { CONSULTATION_MODE_LABELS, type Expert } from '@/models/expert-consultation';

type ExpertListCardProps = {
  experts: readonly Expert[];
  onSelect: (expert: Expert) => void;
  selectedExpertId?: string;
};

/**
 * 👨‍🌾 Agricultural Experts.
 *
 * Each row is a tap target that fills the booking form further down, so a farmer
 * reads the people here and then does not choose one twice.
 *
 * There is no star rating on any of these rows, on purpose. A rating is a claim
 * about a real person, and an invented five-star score is the fastest way to
 * teach a farmer that the numbers on a screen mean nothing. What is shown instead
 * is the qualification, the crops they cover, and how they can be reached, which
 * are the things a farmer can actually check.
 */
export function ExpertListCard({
  experts,
  onSelect,
  selectedExpertId = '',
}: ExpertListCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u{1F468}\u200D\u{1F33E} Agricultural Experts"
      subtitle="Tap an expert to fill the booking form below with them"
      testID="expert-list-card">
      <View style={styles.list}>
        {experts.map((expert, index) => {
          const isSelected = expert.id === selectedExpertId;

          return (
            <Pressable
              key={expert.id}
              testID={`expert-${expert.id}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${expert.name}, ${expert.title}`}
              onPress={() => onSelect(expert)}
              style={({ pressed }) => [
                styles.row,
                { borderColor: colors.border },
                isSelected && styles.rowSelected,
                // A hairline between rows, but not above the first one.
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                pressed && styles.pressed,
              ]}>
              <View style={styles.header}>
                <Text style={styles.avatar}>{expert.emoji}</Text>

                <View style={styles.headerCopy}>
                  <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {expert.name}
                  </Text>
                  <Text style={[styles.title, { color: colors.textSecondary }]} numberOfLines={1}>
                    {expert.title}
                  </Text>
                </View>

                <Text style={[styles.distance, { color: colors.primaryDark }]} numberOfLines={1}>
                  {`${expert.distanceKm} km`}
                </Text>
              </View>

              <Text style={[styles.specialty, { color: colors.text }]}>{expert.specialty}</Text>

              <Text style={[styles.qualification, { color: colors.textSecondary }]}>
                {expert.qualification}
              </Text>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
                  {`\u{1F33E}  ${expert.crops.join(' \u00B7 ')}`}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
                  {`\u{1F310}  ${expert.languages.join(', ')}`}
                </Text>
              </View>

              <View style={styles.modes}>
                {expert.modes.map((mode) => (
                  <View
                    key={mode}
                    style={[styles.mode, { backgroundColor: colors.waterSoft }]}>
                    <Text style={[styles.modeText, { color: colors.water }]} numberOfLines={1}>
                      {CONSULTATION_MODE_LABELS[mode]}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  row: {
    gap: 5,
    borderWidth: 1,
    borderRadius: AgriRadius.small,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  rowSelected: {
    // A thicker green border marks the expert the form is filled with, without
    // recolouring text the farmer is already reading.
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    fontSize: 22,
    lineHeight: 28,
  },
  headerCopy: {
    flex: 1,
    gap: 1,
  },
  name: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  title: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  distance: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  specialty: {
    ...AgriTypography.caption,
    lineHeight: 19,
  },
  qualification: {
    ...AgriTypography.caption,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
  },
  meta: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  modes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  mode: {
    borderRadius: AgriRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  modeText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
});
