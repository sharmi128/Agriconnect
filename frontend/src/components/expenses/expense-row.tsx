import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatRupees, getCategory, type Expense } from '@/models/expenses';

type ExpenseRowProps = {
  expense: Expense;
  /** Opens Edit Expense for this entry. */
  onEdit: () => void;
  /** Asks the screen to show the delete confirmation for this entry. */
  onDelete: () => void;
};

/**
 * One entry in the expense list: the category, what was bought, the date, the
 * note and the amount.
 *
 * The row itself opens Edit Expense, because tapping a line to correct it is the
 * obvious thing to try. 🗑 Delete is a separate button rather than a swipe, since
 * a delete here loses a real rupee figure the farmer may need for a claim, and it
 * is always followed by a confirmation.
 *
 * The amount is the loudest thing in the row and is the only part that is not
 * truncated, because it is the one value the farmer scans the list for.
 */
export function ExpenseRow({ expense, onEdit, onDelete }: ExpenseRowProps) {
  const colors = useAgriTheme();
  const category = getCategory(expense.category);

  return (
    <View
      testID={`expense-row-${expense.id}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${expense.title}, ${formatRupees(expense.amount)}`}
        onPress={onEdit}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}>
        <View style={[styles.emojiBox, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>

        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {expense.title}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
              {`${category.label} · ${expense.date}`}
            </Text>
          </View>

          {expense.note ? (
            <Text
              style={[styles.note, { color: colors.textSecondary }]}
              numberOfLines={2}>
              {expense.note}
            </Text>
          ) : null}
        </View>

        <Text style={[styles.amount, { color: colors.text }]} numberOfLines={1}>
          {formatRupees(expense.amount)}
        </Text>
      </Pressable>

      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <Pressable
          testID={`expense-edit-${expense.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${expense.title}`}
          onPress={onEdit}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={[styles.actionLabel, { color: colors.primary }]}>
            {'\u270F\uFE0F  Edit'}
          </Text>
        </Pressable>

        <Pressable
          testID={`expense-delete-${expense.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${expense.title}`}
          onPress={onDelete}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={[styles.actionLabel, { color: colors.danger }]}>
            {'\u{1F5D1}\uFE0F  Delete'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  main: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  emojiBox: {
    width: 40,
    height: 40,
    borderRadius: AgriRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...AgriTypography.body,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    ...AgriTypography.caption,
  },
  note: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  amount: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  actionLabel: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
});
