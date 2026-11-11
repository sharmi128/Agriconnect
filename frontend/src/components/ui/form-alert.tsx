import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type FormAlertProps = {
  /** `error` for problems, `info` for neutral notes such as demo mode. */
  tone: 'error' | 'info';
  message: string;
  testID?: string;
};

/**
 * Banner shown above a form, used for backend errors and for the note that
 * appears when no backend URL has been configured yet.
 */
export function FormAlert({ tone, message, testID }: FormAlertProps) {
  const colors = useAgriTheme();
  const isError = tone === 'error';

  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          backgroundColor: isError ? colors.dangerSoft : colors.primarySoft,
          borderColor: isError ? colors.danger : colors.border,
        },
      ]}>
      <Text
        style={[
          styles.message,
          { color: isError ? colors.danger : colors.primaryDark },
        ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: AgriRadius.small,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  message: {
    ...AgriTypography.caption,
  },
});
