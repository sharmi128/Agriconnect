/**
 * Holds the farmer's expenses for the whole app.
 *
 * The Expenses screen, Add Expense and Edit Expense are three different routes,
 * so a new entry has to be written somewhere they can all read: the list shows it
 * and the two summary figures at the top are recomputed from the list, which is
 * why they can never disagree with what is underneath them. React Context does
 * that without any extra package, and the provider lives in the root layout, so
 * an entry survives navigating between screens and switching tabs.
 *
 * The list also survives an app restart. On start-up the provider reads the
 * AsyncStorage record the farmer's own saves wrote, and every change is written
 * straight back, so spending recorded today is still in the list tomorrow. That
 * is still frontend-only: the record lives on the device and the Spring Boot
 * backend is not involved.
 *
 * New entries go to the top of the list, because the entry a farmer has just
 * recorded is the one they are looking for. The list is also sorted by date on
 * the way out, so an entry backdated to last month lands in the right place
 * rather than at the top forever.
 *
 * When the backend is ready, replace the read below with a call to the API and
 * replace the `addExpense` and `updateExpense` writes with calls to it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DEMO_EXPENSES,
  sortExpensesByDate,
  type Expense,
} from '@/models/expenses';
import { loadExpenses, saveExpenses } from '@/services/expense-storage';

type ExpenseContextValue = {
  /** The farmer's expenses, newest first. */
  expenses: Expense[];
  /** False until the saved expenses have been read back from the device. */
  isHydrated: boolean;
  /** Called by Add Expense when the farmer saves. */
  addExpense: (expense: Expense) => void;
  /** Called by Edit Expense when the farmer saves changes. */
  updateExpense: (expenseId: string, nextExpense: Expense) => void;
  /** Called by 🗑 Delete after the farmer confirms. */
  deleteExpense: (expenseId: string) => void;
};

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(() => [...DEMO_EXPENSES]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read the saved entries once on start-up. The effect is not allowed to set
  // state synchronously, so the load is wrapped in a promise and cancelled on
  // unmount. The demo list renders first and is replaced a moment later, which
  // happens behind the start-up splash.
  useEffect(() => {
    let isActive = true;

    loadExpenses().then((saved) => {
      if (!isActive) return;

      setExpenses(sortExpensesByDate(saved));
      setIsHydrated(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  // Write the list back after every change, but not before the read has finished:
  // writing the demo list over the saved one during the first tick would undo
  // everything the farmer recorded on a previous run.
  useEffect(() => {
    if (!isHydrated) return;

    void saveExpenses(expenses);
  }, [expenses, isHydrated]);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((current) => sortExpensesByDate([expense, ...current]));
  }, []);

  const updateExpense = useCallback((expenseId: string, nextExpense: Expense) => {
    setExpenses((current) =>
      sortExpensesByDate(
        current.map((expense) => (expense.id === expenseId ? nextExpense : expense))
      )
    );
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses((current) => current.filter((expense) => expense.id !== expenseId));
  }, []);

  // Memoised so the screens only re-render when the list itself changes.
  const value = useMemo(
    () => ({ expenses, isHydrated, addExpense, updateExpense, deleteExpense }),
    [expenses, isHydrated, addExpense, updateExpense, deleteExpense]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

/** Reads the shared expenses. Throws if used outside the provider. */
export function useExpenses(): ExpenseContextValue {
  const value = useContext(ExpenseContext);

  if (!value) {
    throw new Error('useExpenses must be used inside an <ExpenseProvider />.');
  }

  return value;
}
