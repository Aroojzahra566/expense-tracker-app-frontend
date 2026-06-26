"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import ExpensesTable from "@/components/ExpensesTable";
import ApiErrorState from "@/components/ApiErrorState";
import GradientCard from "@/components/GradientCard";
import { getCategories, getExpenses } from "@/lib/api";
import type { Expense } from "@/lib/types";

export default function ExpensesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [date, setDate] = useState(searchParams.get("date") ?? "");

  useEffect(() => {
    const paramCategory = searchParams.get("category") ?? "";
    const paramDate = searchParams.get("date") ?? "";
    setCategory(paramCategory);
    setDate(paramDate);
  }, [searchParams]);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [expenseData, categoryData] = await Promise.all([
        getExpenses({
          category: category || undefined,
          date: date || undefined,
        }),
        getCategories(),
      ]);

      setExpenses(expenseData ?? []);
      setCategories(categoryData ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load expenses"
      );
    } finally {
      setLoading(false);
    }
  }, [category, date]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  function applyFilters() {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (date) params.set("date", date);
    const qs = params.toString();
    router.push(qs ? `/expenses?${qs}` : "/expenses");
  }

  function clearFilters() {
    setCategory("");
    setDate("");
    router.push("/expenses");
  }

  if (error) {
    return <ApiErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage all your transactions
          </p>
        </div>
        <Link
          href="/expenses/add"
          className="flex items-center gap-2 self-start rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Link>
      </div>

      <GradientCard className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              Apply
            </button>
            <button
              type="button"
              onClick={clearFilters}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </div>
        </div>
      </GradientCard>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <ExpensesTable
          expenses={expenses}
          showFilters={false}
          showDescription
          onExpenseDeleted={loadExpenses}
        />
      )}
    </div>
  );
}
