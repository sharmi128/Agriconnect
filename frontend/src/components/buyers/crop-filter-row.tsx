import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { Buyer } from '@/models/buyer-connection';
import { cropFilterOptions, type CropFilterOption } from '@/models/buyers';

type CropFilterRowProps = {
  /** The chosen crop, or `null` for every crop. */
  value: string | null;
  onChange: (cropId: string | null) => void;
  /** The whole buyer list, so the counts never move as the search box changes. */
  buyers?: readonly Buyer[];
};

/**
 * 🌱 The crop buttons: every crop first, then one per crop a buyer wants.
 *
 * The row scrolls sideways like the marketplace category tabs and the 📍 area
 * buttons, so all of them stay reachable on a small phone. Each button carries the
 * number of buyers wanting that crop, so a farmer can see where the demand is
 * before tapping anything.
 *
 * The counts come from the full buyer list, not the filtered one. That is
 * deliberate: a search box narrowing the list underneath should not make the
 * buttons appear to change what buyers are out there.
 */
export function CropFilterRow({ value, onChange, buyers }: CropFilterRowProps) {
  const colors = useAgriTheme();
  const options: CropFilterOption[] = cropFilterOptions(buyers);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {options.map((option) => {
        const isActive = option.cropId === value;

        return (
          <Pressable
            key={option.cropId ?? 'all'}
            testID={`buyers-crop-filter-${option.cropId ?? 'all'}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${option.label}, ${option.count} ${
              option.count === 1 ? 'buyer' : 'buyers'
            }`}
            onPress={() => onChange(option.cropId)}
            style={({ pressed }) => [
              styles.pill,
              isActive
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && styles.pressed,
            ]}>
            <Text style={styles.emoji}>{option.emoji}</Text>

            <Text
              style={[
                styles.label,
                { color: isActive ? colors.onPrimary : colors.textSecondary },
              ]}
              numberOfLines={1}>
              {option.label}
            </Text>

            <View
              style={[
                styles.countBadge,
                { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.primarySoft },
              ]}>
              <Text
                style={[
                  styles.countText,
                  { color: isActive ? colors.onPrimary : colors.primaryDark },
                ]}>
                {option.count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  emoji: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  countBadge: {
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: AgriRadius.pill,
    alignItems: 'center',
  },
  countText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
});
