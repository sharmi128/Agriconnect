import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { DISTANCE_FILTERS, type DistanceFilter } from '@/models/buyer-connection';

type DistanceFilterRowProps = {
  value: DistanceFilter;
  onChange: (value: DistanceFilter) => void;
};

/**
 * 📍 The area buttons for Buyer Location: everywhere, or within 10, 25 or 50 km.
 *
 * The row scrolls sideways like the marketplace category tabs, so all four
 * options stay reachable on a small phone. The chosen area narrows the buyer
 * lists on the screen, which is why the buttons name a distance instead of
 * saying "Near" or "Far".
 */
export function DistanceFilterRow({ value, onChange }: DistanceFilterRowProps) {
  const colors = useAgriTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {DISTANCE_FILTERS.map((filter) => {
        const isActive = filter.key === value;

        return (
          <Pressable
            key={filter.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={filter.label}
            onPress={() => onChange(filter.key)}
            style={({ pressed }) => [
              styles.pill,
              isActive
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && styles.pressed,
            ]}>
            <Text style={styles.emoji}>{'📍'}</Text>
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.onPrimary : colors.textSecondary },
              ]}
              numberOfLines={1}>
              {filter.label}
            </Text>
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
});
