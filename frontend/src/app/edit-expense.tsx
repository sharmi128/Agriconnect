import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useExpenses } from '@/context/expense-context';
import {
  applyExpenseValues,
  EMPTY_EXPENSE_FORM,
  EXPENSE_CATEGORY_OPTIONS,
  formFromExpense,
  validateExpenseForm,
  type ExpenseFormValues,
} from '@/models/expenses';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Edit Expense screen, opened from ✏️ Edit on an entry in the Expenses list.
 *
 * The form starts from the entry's current values, so only what the farmer
 * actually changes is rewritten, and the entry keeps its id so the list and both
 * totals update in place rather than the entry appearing twice. Save validates,
 * applies the changes to the shared list, then returns to Expenses, which
 * re-reads the list and re-renders with the new values. Cancel simply goes back
 * and throws the typed values away.
 */
export default function EditExpenseScreen() {
  const { expenses, updateExpense, isHydrated } = useExpenses();
  const params = useLocalSearchParams<{ id?: string }>();

  const expense = expenses.find((entry) => entry.id === params.id);

  // The lazy initialiser runs once per mount, so the form keeps what the user
  // types while they look up a corrected amount.
  const [values, setValues] = useState<ExpenseFormValues>(() =>
    expense ? formFromExpense(expense) : EMPTY_EXPENSE_FORM
  );
  const [errors, setErrors] = useState<FieldErrors<ExpenseFormValues>>({});

  /** Updates one field and clears its error as soon as the user types. */
  function handleChange(key: keyof ExpenseFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSave() {
    if (!expense || !isHydrated) {
      router.back();
      return;
    }

    const nextErrors = validateExpenseForm(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    updateExpense(expense.id, applyExpenseValues(expense, values));

    router.back();
  }

  function handleCancel() {
    // No state is written, so the list still shows the old values.
    router.back();
  }

  if (!expense) {
    // The entry is gone (for example after it was deleted), so there is nothing
    // to edit. The farmer came here from the list, so Back returns them to it.
    return (
      <AuthScreen testID="edit-expense-missing-screen">
        <AuthHeader title="Edit Expense" onBack={handleCancel} />
        <Button
          label="Back to Expenses"
          onPress={() => router.replace('/expenses')}
          testID="edit-expense-missing-back"
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen testID="edit-expense-screen">
      <AuthHeader
        title="Edit Expense"
        subtitle="Correct what was recorded for this entry."
        onBack={handleCancel}
      />

      <View style={styles.form}>
        <SelectField
          label="\u{1F4B3} Category"
          value={values.category}
          options={EXPENSE_CATEGORY_OPTIONS}
          onChange={(value) => handleChange('category', value)}
          placeholder="What kind of spending is this"
          error={errors.category}
          testID="edit-select-expense-category"
        />

        <TextField
          label="\u{1F4D6} What was bought"
          placeholder="e.g. NPK 50:50:50, 50kg"
          value={values.title}
          onChangeText={(value) => handleChange('title', value)}
          error={errors.title}
          autoCapitalize="sentences"
          returnKeyType="next"
          testID="edit-input-expense-title"
        />

        <TextField
          label="\u{1F4B0} Amount (Rupees)"
          placeholder="e.g. 850"
          value={values.amount}
          onChangeText={(value) => handleChange('amount', value)}
          error={errors.amount}
          keyboardType="decimal-pad"
          returnKeyType="next"
          testID="edit-input-expense-amount"
        />

        <TextField
          label="\u{1F4C5} Date"
          placeholder="e.g. 24 Sep 2026"
          value={values.date}
          onChangeText={(value) => handleChange('date', value)}
          error={errors.date}
          autoCapitalize="words"
          returnKeyType="next"
          testID="edit-input-expense-date"
        />

        <TextField
          label="\u{1F4DD} Note (optional)"
          placeholder="e.g. Split across North and East Field"
          value={values.note}
          onChangeText={(value) => handleChange('note', value)}
          autoCapitalize="sentences"
          multiline
          returnKeyType="done"
          testID="edit-input-expense-note"
        />

        <View style={styles.actions}>
          <Button
            label="\u{1F4BE} Save Changes"
            onPress={handleSave}
            disabled={!isHydrated}
            testID="save-expense-changes"
          />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={handleCancel}
            testID="cancel-expense-changes"
          />
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
