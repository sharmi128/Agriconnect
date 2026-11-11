import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { FieldWrapper, fieldRowStyle } from '@/components/ui/field-wrapper';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { getOptionLabel, type SelectOption } from '@/models/farmer-profile';

/** Cap on the list height, so long lists scroll instead of filling the screen. */
const MAX_LIST_HEIGHT = 280;

type SelectFieldProps = {
  label: string;
  /** The currently selected value. An empty string means nothing is chosen. */
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  /** Message from validation. When set, the border turns red. */
  error?: string;
  testID?: string;
};

/**
 * Dropdown built from React Native's own `Modal`.
 *
 * This is used for "Main Crop" and "Irrigation Type". It is written by hand
 * rather than pulled from a package so it needs no native module, works in
 * Expo Go, and looks the same on iOS, Android and the web. The trigger row uses
 * the shared `fieldRowStyle`, so a dropdown is indistinguishable from a text
 * input until you tap it.
 */
export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  error,
  testID,
}: SelectFieldProps) {
  const colors = useAgriTheme();
  const [isOpen, setIsOpen] = useState(false);

  const hasValue = value.length > 0;
  const borderColor = error ? colors.danger : colors.border;

  function handleSelect(option: SelectOption) {
    onChange(option.value);
    setIsOpen(false);
  }

  return (
    <FieldWrapper label={label} error={error}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          fieldRowStyle,
          {
            backgroundColor: colors.surface,
            borderColor,
            justifyContent: 'space-between',
            gap: 12,
          },
          pressed && styles.pressed,
        ]}>
        <Text
          numberOfLines={1}
          style={[styles.value, { color: hasValue ? colors.text : colors.textSecondary }]}>
          {hasValue ? getOptionLabel(options, value) : placeholder}
        </Text>

        <Text style={[styles.chevron, { color: colors.primary }]}>{'\u25BE'}</Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        // Required on Android, otherwise the hardware back button closes the
        // whole screen instead of just the dropdown.
        onRequestClose={() => setIsOpen(false)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dropdown"
          style={styles.backdrop}
          onPress={() => setIsOpen(false)}>
          {/* Stops a tap on the card from bubbling up to the backdrop. */}
          <Pressable
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={(event) => event.stopPropagation()}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{label}</Text>

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}>
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => handleSelect(option)}
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && { backgroundColor: colors.primarySoft },
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: isSelected ? colors.primaryDark : colors.text },
                        isSelected && styles.optionLabelSelected,
                      ]}>
                      {option.label}
                    </Text>

                    {isSelected ? (
                      <Text style={[styles.check, { color: colors.primary }]}>{'\u2713'}</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              onPress={() => setIsOpen(false)}
              style={({ pressed }) => [
                styles.cancelButton,
                { borderTopColor: colors.border },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.cancelLabel, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  value: {
    flex: 1,
    ...AgriTypography.body,
  },
  chevron: {
    fontSize: 18,
    lineHeight: 22,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 15, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardTitle: {
    ...AgriTypography.label,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  list: {
    maxHeight: MAX_LIST_HEIGHT,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: AgriRadius.small,
  },
  optionLabel: {
    ...AgriTypography.body,
    flex: 1,
  },
  optionLabelSelected: {
    fontWeight: '700',
  },
  check: {
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    borderTopWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelLabel: {
    ...AgriTypography.label,
  },
});
