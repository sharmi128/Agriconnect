import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  /** Label on the button that goes ahead. */
  confirmLabel: string;
  cancelLabel?: string;
  /** `danger` for actions that lose data, such as signing out. */
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
};

/**
 * A yes/no popup built from React Native's own `Modal`.
 *
 * Written by hand rather than pulled from a package, the same way the shared
 * `SelectField` dropdown is, so it needs no native module and behaves the same on
 * iOS, Android and the web. The confirm button is the one the farmer most often
 * wants to tap deliberately, never the destructive one, so cancelling is always
 * the safe default.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
  testID,
}: ConfirmDialogProps) {
  const colors = useAgriTheme();
  const isDanger = tone === 'danger';
  const confirmColor = isDanger ? colors.danger : colors.primary;
  const onConfirmColor = isDanger ? colors.surface : colors.onPrimary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      // Required on Android, otherwise the hardware back button closes the whole
      // screen instead of just the popup.
      onRequestClose={onCancel}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={styles.backdrop}
        onPress={onCancel}>
        {/* Stops a tap on the card from bubbling up to the backdrop. */}
        <Pressable
          testID={testID}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={(event) => event.stopPropagation()}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              testID={testID ? `${testID}-cancel` : undefined}
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.buttonSecondary,
                { borderColor: colors.borderStrong },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.buttonLabel, { color: colors.primary }]}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              testID={testID ? `${testID}-confirm` : undefined}
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: confirmColor },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.buttonLabel, { color: onConfirmColor }]}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  message: {
    ...AgriTypography.body,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.75,
  },
  buttonLabel: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
});
