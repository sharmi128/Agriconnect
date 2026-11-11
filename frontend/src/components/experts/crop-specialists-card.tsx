import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { expertsForCrop, type Expert } from '@/models/expert-consultation';

type CropSpecialistsCardProps = {
  experts: readonly Expert[];
  /** The crop picked in 📝 Ask a Question, which highlights its specialists. */
  selectedCropName: string;
  onSelectCrop: (cropName: string) => void;
};

/**
 * 🌱 Crop Specialists.
 *
 * A farmer usually arrives with a crop, not with a person, so the crops are the
 * way in: tap one and the section narrows to the experts who actually cover it.
 *
 * Tapping the same crop again clears it, so the filter can never leave the
 * section showing nothing. The count on each row is the honest part, because
 * "no one covers that" is a real answer and a better one than a list of people
 * who would be guessing.
 */
export function CropSpecialistsCard({
  experts,
  selectedCropName,
  onSelectCrop,
}: CropSpecialistsCardProps) {
  const colors = useAgriTheme();

  // Counting the crops here rather than importing a helper keeps the row count and
  // the people it names on the same line, where a farmer can compare them.
  const cropNames = [...new Set(experts.flatMap((expert) => expert.crops))].sort();
  const selected = selectedCropName.length > 0 ? expertsForCrop(experts, selectedCropName) : experts;

  return (
    <SectionCard
      title="\u{1F331} Crop Specialists"
      subtitle="Tap a crop to see who knows it best"
      testID="crop-specialists-card">
      <View style={styles.body}>
        <View style={styles.crops}>
          {cropNames.map((crop) => {
            const count = expertsForCrop(experts, crop).length;
            const isSelected = crop === selectedCropName;

            return (
              <Pressable
                key={crop}
                testID={`crop-specialist-${crop}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${crop}, ${count} specialists`}
                onPress={() => onSelectCrop(isSelected ? '' : crop)}
                style={({ pressed }) => [
                  styles.crop,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isSelected && { backgroundColor: colors.primarySoft, borderColor: colors.primary },
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.cropName,
                    { color: isSelected ? colors.primaryDark : colors.text },
                  ]}
                  numberOfLines={1}>
                  {crop}
                </Text>

                <Text
                  style={[
                    styles.cropCount,
                    { color: isSelected ? colors.primaryDark : colors.textSecondary },
                  ]}>
                  {count === 1 ? '1 expert' : `${count} experts`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedCropName.length > 0 ? (
          <View style={styles.matched}>
            <Text style={[styles.matchedTitle, { color: colors.text }]}>
              {selectedCropName}
            </Text>

            {selected.map((expert) => (
              <View key={expert.id} style={styles.matchedRow}>
                <Text style={styles.matchedEmoji}>{expert.emoji}</Text>
                <Text style={[styles.matchedName, { color: colors.text }]} numberOfLines={1}>
                  {expert.name}
                </Text>
                <Text
                  style={[styles.matchedRole, { color: colors.textSecondary }]}
                  numberOfLines={1}>
                  {expert.title}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  crops: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  crop: {
    gap: 1,
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  cropName: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  cropCount: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '400',
  },
  matched: {
    gap: 6,
  },
  matchedTitle: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  matchedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  matchedEmoji: {
    fontSize: 16,
    lineHeight: 22,
  },
  matchedName: {
    ...AgriTypography.caption,
    fontWeight: '700',
    flex: 1,
  },
  matchedRole: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});
