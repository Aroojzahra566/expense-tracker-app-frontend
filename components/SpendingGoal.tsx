"use client";

import { useState } from "react";
import { Target, Pencil, Check, X, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useFinanceSettings } from "@/lib/settings";
import GradientCard from "@/components/GradientCard";

interface SpendingGoalProps {
  totalExpenses: number;
}

export default function SpendingGoal({ totalExpenses }: SpendingGoalProps) {
  const { settings, update, hydrated } = useFinanceSettings();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const goal = settings.spendingGoal;
  const progress = goal > 0 ? (totalExpenses / goal) * 100 : 0;
  const clamped = Math.max(0, Math.min(100, progress));
  const remaining = goal - totalExpenses;

  const status =
    progress >= 100
      ? { label: "Limit exceeded", color: "#EF4444", bar: "bg-red-500" }
      : progress >= 80
        ? { label: "Near limit", color: "#F59E0B", bar: "bg-amber-500" }
        : { label: "On track", color: "#22C55E", bar: "bg-emerald-500" };

  function startEdit() {
    setDraft(String(goal));
    setEditing(true);
  }

  function saveEdit() {
    const value = Number(draft);
    if (!Number.isNaN(value) && value >= 0) {
      update({ spendingGoal: value });
    }
    setEditing(false);
  }

  return (
    <GradientCard delay={200} className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Spending Goal
          </h2>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Pencil className="h-3.5 w-3.5" />
            Goal
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              PKR
            </span>
            <input
              type="number"
              min="0"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            />
          </div>
          <button
            type="button"
            onClick={saveEdit}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
            aria-label="Save goal"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <span
          className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: `${status.color}1a`, color: status.color }}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {status.label}
        </span>
      )}

      <div className="mt-5">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            of {formatCurrency(goal)}
          </p>
        </div>

        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full ${status.bar} transition-all duration-700 ease-out`}
            style={{ width: `${hydrated ? clamped : 0}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-medium" style={{ color: status.color }}>
            {hydrated ? `${Math.round(progress)}% used` : "—"}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {remaining >= 0
              ? `${formatCurrency(remaining)} left`
              : `${formatCurrency(Math.abs(remaining))} over`}
          </span>
        </div>
      </div>
    </GradientCard>
  );
}
