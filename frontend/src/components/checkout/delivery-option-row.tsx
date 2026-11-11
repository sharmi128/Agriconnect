import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  deliveryChargeLabel,
  deliveryEstimateLabel,
  type DeliveryOption,
} from '@/models/marketplace-delivery';

type DeliveryOptionRowProps = {
  option: DeliveryOption;
  /** Whether this is the speed the parcel is going at. */
  isSelected: boolean;
  onSelect: (option: DeliveryOption) => void;
  testID?: string;
};

/**
 * One delivery speed, and the whole choice on a single row.
 *
 * A farmer comparing two speeds is really comparing two numbers — how many days,
 * and how many rupees — so both sit on the row rather than behind a second tap.
 * The charge is stated in full here, before anything is chosen, because the
 * point of the row is to be able to decide without committing to it.
 *
 * The tick sits on the right so the two options line up as a pair down the
 * page, and the selected row is drawn in the paddy green rather than being
 * marked with a heavier border alone, which is a difference a finger finds
 * faster than an eye does.
 */
export function DeliveryOptionRow({
  option,
  isSelected,
  onSelect,
  testID,
}: DeliveryOptionRowProps) {
  const colors = useAgriTheme();
  const estimate = deliveryEstimateLabel(option);

  return (
    <Pressable
      testID={testID ?? `delivery-option-${option.id}`}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${option.title}, ${estimate}, ${deliveryChargeLabel(option.charge)}`}
      onPress={() => onSelect(option)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: isSelected ? colors.primarySoft : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
        },
        pressed && styles.pressed,
      ]}>
      <View
        style={[
          styles.tile,
          { backgroundColor: isSelected ? colors.surface : colors.surfaceMuted },
        ]}>
        <Text style={styles.emoji}>{option.emoji}</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]}>{option.title}</Text>
        <Text style={[styles.estimate, { color: colors.primary }]}>{estimate}</Text>
        <Text style={[styles.blurb, { color: colors.textSecondary }]} numberOfLines={2}>
          {option.blurb}
        </Text>
      </View>

      <View style={styles.trailing}>
        <Text style={[styles.charge, { color: colors.text }]}>
          {deliveryChargeLabel(option.charge)}
        </Text>
        <Text style={[styles.chargeNote, { color: colors.textSecondary }]}>delivery</Text>

        <View
          style={[
            styles.tick,
            {
              backgroundColor: isSelected ? colors.primary : 'transparent',
              borderColor: isSelected ? colors.primary : colors.borderStrong,
            },
          ]}>
          {isSelected ? <Text style={styles.tickMark}>{'\u2713'}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  tile: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AgriRadius.medium,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...AgriTypography.subtitle,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  estimate: {
    ...AgriTypography.label,
    fontSize: 13,
  },
  blurb: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '400',
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 1,
  },
  charge: {
    ...AgriTypography.subtitle,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  chargeNote: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '400',
  },
  tick: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
    marginTop: 4,
  },
  tickMark: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
