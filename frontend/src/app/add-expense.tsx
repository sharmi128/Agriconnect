import { router } from 'expo-router';
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
  buildExpense,
  EMPTY_EXPENSE_FORM,
  EXPENSE_CATEGORY_OPTIONS,
  formatToday,
  validateExpenseForm,
  type ExpenseFormValues,
} from '@/models/expenses';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/**
 * Add Expense screen, opened from 💰 Add Expense on the Expenses page.
 *
 * The date starts on today, because the common case is spending recorded on the
 * day it happened, but it is an ordinary field the farmer can change to
 * backdate an entry they are catching up on. Save validates, writes the entry to
 * the shared list, then returns to Expenses, which re-reads the list and
 * recomputes both totals. Cancel simply goes back and throws the typed values
 * away.
 *
 * Saving is held back while the saved entries are still being read, so an entry
 * recorded in that first moment cannot be overwritten by the load.
 */
export default function AddExpenseScreen() {
  const { addExpense, isHydrated } = useExpenses();

  // The lazy initialiser runs once per mount, so the form keeps what the user
  // types while they look up an amount. Today is read here rather than in the
  // shared blank form, so a form left open overnight does not save yesterday.
  const [values, setValues] = useState<ExpenseFormValues>(() => ({
    ...EMPTY_EXPENSE_FORM,
    date: formatToday(),
  }));
  const [errors, setErrors] = useState<FieldErrors<ExpenseFormValues>>({});

  /** Updates one field and clears its error as soon as the user types. */
  function handleChange(key: keyof ExpenseFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSave() {
    if (!isHydrated) return;

    const nextErrors = validateExpenseForm(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    addExpense(buildExpense(values));

    router.back();
  }

  function handleCancel() {
    // No state is written, so the list and the totals still show what they did.
    router.back();
  }

  return (
    <AuthScreen testID="add-expense-screen">
      <AuthHeader
        title="Add Expense"
        subtitle="Record what you spent so the totals add up."
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
          testID="add-select-expense-category"
        />

        <TextField
          label="\u{1F4D6} What was bought"
          placeholder="e.g. NPK 50:50:50, 50kg"
          value={values.title}
          onChangeText={(value) => handleChange('title', value)}
          error={errors.title}
          autoCapitalize="sentences"
          returnKeyType="next"
          testID="add-input-expense-title"
        />

        <TextField
          label="\u{1F4B0} Amount (Rupees)"
          placeholder="e.g. 850"
          value={values.amount}
          onChangeText={(value) => handleChange('amount', value)}
          error={errors.amount}
          keyboardType="decimal-pad"
          returnKeyType="next"
          testID="add-input-expense-amount"
        />

        <TextField
          label="\u{1F4C5} Date"
          placeholder="e.g. 24 Sep 2026"
          value={values.date}
          onChangeText={(value) => handleChange('date', value)}
          error={errors.date}
          autoCapitalize="words"
          returnKeyType="next"
          testID="add-input-expense-date"
        />

        <TextField
          label="\u{1F4DD} Note (optional)"
          placeholder="e.g. Split across North and East Field"
          value={values.note}
          onChangeText={(value) => handleChange('note', value)}
          autoCapitalize="sentences"
          multiline
          returnKeyType="done"
          testID="add-input-expense-note"
        />

        <View style={styles.actions}>
          <Button
            label="\u{1F4BE} Save Expense"
            onPress={handleSave}
            disabled={!isHydrated}
            testID="save-expense"
          />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={handleCancel}
            testID="cancel-expense"
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
