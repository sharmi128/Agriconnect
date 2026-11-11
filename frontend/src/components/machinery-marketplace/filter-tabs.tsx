import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { MACHINE_FILTERS, type MachineFilter } from '@/models/machinery-marketplace';

type FilterTabsProps = {
  value: MachineFilter;
  onChange: (value: MachineFilter) => void;
};

/**
 * Offer buttons for the Machinery Marketplace: All, Rent and Buy.
 *
 * The row scrolls sideways so it stays reachable on small phones, the same way
 * the marketplace category tabs do.
 */
export function FilterTabs({ value, onChange }: FilterTabsProps) {
  const colors = useAgriTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {MACHINE_FILTERS.map((filter) => {
        const isActive = filter.key === value;

        return (
          <Pressable
            key={filter.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={filter.label}
            onPress={() => onChange(filter.key)}
            testID={`filter-${filter.key}`}
            style={({ pressed }) => [
              styles.pill,
              isActive
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
              pressed && styles.pillPressed,
            ]}>
            <Text style={styles.emoji}>{filter.emoji}</Text>
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
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
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
  pillPressed: {
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