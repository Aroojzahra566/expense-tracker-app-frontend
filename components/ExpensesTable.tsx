"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { deleteExpense, getApiErrorMessage } from "@/lib/api";
import { getCategoryStyle } from "@/lib/category-styles";
import { formatCurrency, formatDisplayDate } from "@/lib/utils";
import type { Expense } from "@/lib/types";
import GradientCard from "@/components/GradientCard";

interface ExpensesTableProps {
  expenses?: Expense[];
  title?: string;
  showFilters?: boolean;
  showDescription?: boolean;
  onExpenseDeleted?: () => void;
}

export default function ExpensesTable({
  expenses: initialExpenses = [],
  title = "All Expenses",
  showFilters = true,
  showDescription = false,
  onExpenseDeleted,
}: ExpensesTableProps) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const expenses = useMemo(() => {
    if (!search.trim()) return initialExpenses;
    const query = search.toLowerCase();
    return initialExpenses.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
    );
  }, [initialExpenses, search]);

  async function handleDelete(id: number, expenseTitle: string) {
    if (!confirm(`Delete "${expenseTitle}"? This cannot be undone.`)) return;

    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteExpense(id);
      onExpenseDeleted?.();
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <GradientCard delay={560} className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search expenses..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-200 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 sm:w-56"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {deleteError && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {deleteError}
        </p>
      )}

      <div className="mt-6 overflow-x-auto">
        {expenses.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {search ? "No expenses match your search." : "No expenses found."}
          </p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400 dark:border-slate-700/50">
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Title</th>
                {showDescription && (
                  <th className="pb-3 pr-4 font-medium">Description</th>
                )}
                <th className="pb-3 pr-4 font-medium">Category</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
              {expenses.map((expense, index) => {
                const colors = getCategoryStyle(expense.category);
                return (
                  <tr
                    key={expense.id}
                    className="group animate-fade-in-up transition-colors duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                    style={{ animationDelay: `${600 + index * 50}ms` }}
                  >
                    <td className="py-4 pr-4 text-slate-500 dark:text-slate-400">
                      {formatDisplayDate(expense.date)}
                    </td>
                    <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-white">
                      {expense.title}
                    </td>
                    {showDescription && (
                      <td className="max-w-xs py-4 pr-4 text-slate-600 dark:text-slate-300">
                        {expense.description || "—"}
                      </td>
                    )}
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/expenses/${expense.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-500 transition-all duration-200 hover:scale-110 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                          aria-label={`Edit ${expense.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === expense.id}
                          onClick={() => handleDelete(expense.id, expense.title)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-all duration-200 hover:scale-110 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
                          aria-label={`Delete ${expense.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </GradientCard>
  );
}
