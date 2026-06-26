"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createExpense, getApiErrorMessage, updateExpense } from "@/lib/api";
import type { Expense, ExpenseInput } from "@/lib/types";
import GradientCard from "@/components/GradientCard";

interface ExpenseFormProps {
  categories: string[];
  expense?: Expense;
}

export default function ExpenseForm({ categories, expense }: ExpenseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(expense);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const data: ExpenseInput = {
      title: String(form.get("title") ?? "").trim(),
      amount: Number(form.get("amount")),
      category: String(form.get("category") ?? ""),
      date: String(form.get("date") ?? ""),
      description: String(form.get("description") ?? "").trim(),
    };

    if (!data.title) {
      setError("Title is required.");
      return;
    }
    if (!data.category) {
      setError("Category is required.");
      return;
    }
    if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      setError("Date is required and must be in YYYY-MM-DD format.");
      return;
    }
    if (!data.amount || data.amount <= 0) {
      setError("Amount is required and must be greater than 0.");
      return;
    }

    try {
      if (isEdit && expense) {
        await updateExpense(expense.id, data);
      } else {
        await createExpense(data);
      }
      startTransition(() => {
        router.push("/expenses");
        router.refresh();
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20";

  return (
    <GradientCard className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {isEdit ? "Edit Expense" : "Add New Expense"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={expense?.title}
            placeholder="e.g. Lunch"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount (PKR) <span className="text-red-500">*</span>
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              required
              min="0.01"
              step="0.01"
              defaultValue={expense?.amount}
              placeholder="500"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Date (YYYY-MM-DD) <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={expense?.date ?? new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={expense?.category ?? categories[0]}
            className={inputClass}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={expense?.description}
            placeholder="Optional notes..."
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-600 disabled:opacity-60"
          >
            {isPending ? "Saving..." : isEdit ? "Update Expense" : "Save Expense"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </GradientCard>
  );
}
