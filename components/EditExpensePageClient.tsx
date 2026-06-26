"use client";

import { useEffect, useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ApiErrorState from "@/components/ApiErrorState";
import { ApiError, getApiErrorMessage, getCategories, getExpense } from "@/lib/api";
import type { Expense } from "@/lib/types";

interface EditExpensePageClientProps {
  expenseId: number;
}

export default function EditExpensePageClient({
  expenseId,
}: EditExpensePageClientProps) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([getExpense(expenseId), getCategories()])
      .then(([expenseData, categoryData]) => {
        setExpense(expenseData);
        setCategories(categoryData ?? []);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(getApiErrorMessage(err));
        }
      })
      .finally(() => setLoading(false));
  }, [expenseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (notFound) {
    return <ApiErrorState message="Expense not found." />;
  }

  if (error || !expense || categories.length === 0) {
    return <ApiErrorState message={error ?? undefined} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Edit Expense
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update transaction details
        </p>
      </div>
      <ExpenseForm categories={categories} expense={expense} />
    </div>
  );
}
