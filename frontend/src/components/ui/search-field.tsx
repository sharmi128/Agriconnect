import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  /**
   * Turns the field into a launcher rather than an input. The Marketplace tab
   * has no listings of its own to filter, so its bar opens the search screen
   * instead of typing into it: the input stops being editable and the whole
   * field becomes one tap target.
   */
  onPress?: () => void;
  testID?: string;
};

/**
 * Rounded search input with a magnifier icon and a clear button.
 *
 * The clear button only appears once there is something to clear, so the field
 * looks the same as the rest of the app until the farmer starts typing.
 */
export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search',
  accessibilityLabel = 'Search',
  onPress,
  testID,
}: SearchFieldProps) {
  const colors = useAgriTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isLauncher = onPress !== undefined;

  const field = (
    <View
      style={[
        styles.container,
        // The field lifts slightly while focused, so typing feels responsive.
        isFocused ? AgriShadows.raised : AgriShadows.card,
        {
          backgroundColor: colors.surface,
          borderColor: isFocused ? colors.primary : colors.border,
          borderWidth: isFocused ? 2 : 1,
        },
      ]}>
      <Text style={styles.searchEmoji}>{'\u{1F50D}'}</Text>

      <TextInput
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        value={value}
        onChangeText={onChangeText}
        editable={!isLauncher}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { color: colors.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
          onPress={() => onChangeText('')}>
          <Text style={[styles.clear, { color: colors.textSecondary }]}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );

  /**
   * The launcher wraps the field in one tap target, so the whole bar opens the
   * search screen. A real search field is left as a plain view, so nothing sits
   * between it and the keyboard.
   */
  if (!isLauncher) {
    return field;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}>
      {field}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: AgriRadius.large,
  },
  searchEmoji: {
    fontSize: 15,
    lineHeight: 20,
  },
  input: {
    flex: 1,
    ...AgriTypography.body,
    paddingVertical: 0,
  },
  clear: {
    ...AgriTypography.label,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});
