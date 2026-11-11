import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { DistanceFilter, Expert } from '@/models/expert-consultation';

/** The three widths of search, as pills. */
const FILTERS: { id: DistanceFilter; label: string }[] = [
  { id: 'nearby', label: 'Within 15 km' },
  { id: 'all', label: 'In the district' },
  { id: 'anywhere', label: 'Anywhere' },
];

type ExpertLocationCardProps = {
  experts: readonly Expert[];
  value: DistanceFilter;
  onChange: (filter: DistanceFilter) => void;
  onSelect: (expert: Expert) => void;
};

/**
 * 📍 Expert Location.
 *
 * Distance is the reason a farmer gives up on getting advice, so it is a filter
 * rather than a footnote, and the nearest expert is always at the top of the
 * 👨‍🌾 list above.
 *
 * There is no map. A map needs a location permission, a tile server and a native
 * module, none of which belong in a demo build, and a static picture of a map
 * would tell a farmer a distance that is not real. Distances in kilometres and
 * the office each person works from are the honest version of the same idea.
 */
export function ExpertLocationCard({
  experts,
  value,
  onChange,
  onSelect,
}: ExpertLocationCardProps) {
  const colors = useAgriTheme();
  const nearest = [...experts].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <SectionCard
      title="\u{1F4CD} Expert Location"
      subtitle="How far you are willing to go. This narrows the expert list too."
      testID="expert-location-card">
      <View style={styles.body}>
        <View style={styles.filters}>
          {FILTERS.map((filter) => {
            const isSelected = filter.id === value;

            return (
              <Pressable
                key={filter.id}
                testID={`distance-filter-${filter.id}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={filter.label}
                onPress={() => onChange(filter.id)}
                style={({ pressed }) => [
                  styles.filter,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isSelected && {
                    backgroundColor: colors.primarySoft,
                    borderColor: colors.primary,
                  },
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.filterLabel,
                    { color: isSelected ? colors.primaryDark : colors.textSecondary },
                  ]}
                  numberOfLines={1}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {nearest.length === 0 ? (
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <Text style={styles.emptyEmoji}>{'\u{1F4CD}'}</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Nobody that close</Text>
            <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
              Try a wider area above. An expert further away is still better than none.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {nearest.map((expert, index) => (
              <Pressable
                key={expert.id}
                testID={`expert-location-${expert.id}`}
                accessibilityRole="button"
                accessibilityLabel={`${expert.name}, ${expert.distanceKm} kilometres, ${expert.base}`}
                onPress={() => onSelect(expert)}
                style={({ pressed }) => [
                  styles.row,
                  // A hairline between rows, but not above the first one.
                  index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                  pressed && styles.pressed,
                ]}>
                <View style={styles.distanceBlock}>
                  <Text style={[styles.distanceValue, { color: colors.primaryDark }]}>
                    {expert.distanceKm}
                  </Text>
                  <Text style={[styles.distanceUnit, { color: colors.textSecondary }]}>km</Text>
                </View>

                <View style={styles.copy}>
                  <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {expert.name}
                  </Text>
                  <Text style={[styles.base, { color: colors.textSecondary }]} numberOfLines={2}>
                    {expert.base}
                  </Text>
                  <Text style={[styles.response, { color: colors.textSecondary }]} numberOfLines={2}>
                    {expert.responseTime}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  filter: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  filterLabel: {
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
  distanceBlock: {
    alignItems: 'center',
    minWidth: 44,
  },
  distanceValue: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  distanceUnit: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '400',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  base: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  response: {
    ...AgriTypography.caption,
    fontWeight: '400',
    fontStyle: 'italic',
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
