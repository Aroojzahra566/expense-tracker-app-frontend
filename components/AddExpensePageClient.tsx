"use client";

import { useEffect, useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ApiErrorState from "@/components/ApiErrorState";
import { getCategories } from "@/lib/api";

export default function AddExpensePageClient() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data ?? []))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load categories")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (error || categories.length === 0) {
    return <ApiErrorState message={error ?? undefined} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Add Expense
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Record a new transaction
        </p>
      </div>
      <ExpenseForm categories={categories} />
    </div>
  );
}
