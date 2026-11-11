import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';

import { FieldWrapper, fieldRowStyle } from '@/components/ui/field-wrapper';
import { AgriTypography } from '@/constants/agri-theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /** Message from validation. When set, the border turns red. */
  error?: string;
  /** Hides the text and adds a Show / Hide toggle. */
  secureTextEntry?: boolean;
  /**
   * Renders a taller box that grows over several lines, for longer text such as
   * a crop journal note. Defaults to a single line, which is what every existing
   * form uses.
   */
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  testID?: string;
};

/**
 * Labelled text input with built-in error display, used by every form in the
 * app. All spacing, colors and radii come from the shared AgriConnect theme.
 */
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  multiline = false,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  testID,
}: TextFieldProps) {
  const colors = useAgriTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = Boolean(error);
  // The toggle only makes sense when the field is a password field.
  const showToggle = secureTextEntry;
  const inputIsSecure = secureTextEntry && !isPasswordVisible;

  let borderColor: string = colors.border;
  if (hasError) {
    borderColor = colors.danger;
  } else if (isFocused) {
    borderColor = colors.primary;
  }

  return (
    <FieldWrapper label={label} error={error}>
      <View
        style={[
          fieldRowStyle,
          { backgroundColor: colors.surface, borderColor, borderWidth: isFocused ? 2 : 1 },
          // A multi-line box aligns its text to the top instead of centring it.
          multiline && styles.rowMultiline,
        ]}>
        <TextInput
          testID={testID}
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }, multiline && styles.inputMultiline]}
          secureTextEntry={inputIsSecure}
          multiline={multiline}
          // Android needs this explicitly, otherwise the caret starts mid-box.
          textAlignVertical={multiline ? 'top' : undefined}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {showToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            hitSlop={8}
            onPress={() => setIsPasswordVisible((visible) => !visible)}>
            <Text style={[styles.toggle, { color: colors.primary }]}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    ...AgriTypography.body,
    paddingVertical: 12,
  },
  rowMultiline: {
    // The row grows with the text instead of centring a single line in it.
    alignItems: 'flex-start',
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 88,
    paddingTop: 12,
  },
  toggle: {
    ...AgriTypography.label,
    paddingLeft: 12,
  },
});
