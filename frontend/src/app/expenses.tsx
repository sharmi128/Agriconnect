import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { CategoryBreakdownCard } from '@/components/expenses/category-breakdown-card';
import { ExpenseRow } from '@/components/expenses/expense-row';
import { ExpenseSummaryCard } from '@/components/expenses/expense-summary-card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useExpenses } from '@/context/expense-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { formatRupees, monthTotalExpenses, totalExpenses, type Expense } from '@/models/expenses';

/**
 * 💰 Expenses, opened from the Expenses card on the Home dashboard.
 *
 * The two figures at the top and the list underneath all read the same shared
 * list, so the totals can never disagree with the entries shown. Every entry
 * recorded here is written to the device, which is why the list is still the
 * same after the app is closed and opened again.
 *
 * Adding, editing and removing an entry are separate routes, so this screen only
 * decides when to open them. Removing asks first, because an entry that is gone
 * is a rupee figure the farmer may need for a loan application.
 */
export default function ExpensesScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const { expenses, isHydrated, deleteExpense } = useExpenses();

  // Held until the farmer answers, so the confirmation always names the entry it
  // is about to remove rather than whichever row was tapped last.
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);

  const total = useMemo(() => totalExpenses(expenses), [expenses]);
  const monthTotal = useMemo(() => monthTotalExpenses(expenses), [expenses]);

  function handleConfirmDelete() {
    if (!pendingDelete) return;

    deleteExpense(pendingDelete.id);
    setPendingDelete(null);
  }

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader title="Expenses" onBack={() => router.back()} />
          </View>
        </View>

        <ScrollView
          testID="expenses-screen"
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {isHydrated ? null : (
              <Text style={[styles.loadingNote, { color: colors.textSecondary }]}>
                Loading your saved expenses...
              </Text>
            )}

            <ExpenseSummaryCard
              total={total}
              monthTotal={monthTotal}
              entryCount={expenses.length}
            />

            <Button
              label="\u{1F4B8}  Add Expense"
              onPress={() => router.push('/add-expense')}
              testID="add-expense-button"
            />

            {expenses.length > 0 ? <CategoryBreakdownCard expenses={expenses} /> : null}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {expenses.length === 1 ? '1 entry' : `${expenses.length} entries`}
            </Text>

            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onEdit={() => router.push(`/edit-expense?id=${expense.id}`)}
                  onDelete={() => setPendingDelete(expense)}
                />
              ))
            ) : (
              <SectionCard title="Nothing recorded yet" testID="expenses-empty-card">
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Add what you have spent on seeds, fertilizer, machinery, labour,
                  irrigation, transport or anything else. Every entry adds up to the
                  two totals above, and stays on this device.
                </Text>
                <Button
                  label="Add your first expense"
                  onPress={() => router.push('/add-expense')}
                  testID="add-first-expense-button"
                />
              </SectionCard>
            )}
          </View>
        </ScrollView>

        <ConfirmDialog
          visible={pendingDelete !== null}
          title="Delete this expense?"
          message={
            pendingDelete
              ? `${pendingDelete.title} of ${formatRupees(
                  pendingDelete.amount
                )} will be taken off your totals. This cannot be undone.`
              : ''
          }
          confirmLabel="Delete"
          tone="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
          testID="delete-expense-dialog"
        />
      </View>
    </PaddyBackground>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  sectionTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  emptyText: {
    ...AgriTypography.body,
    fontWeight: '400',
    marginBottom: Spacing.two,
  },
  loadingNote: {
    ...AgriTypography.caption,
    textAlign: 'center',
  },
});
