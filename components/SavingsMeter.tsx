"use client";

import { useState } from "react";
import { PiggyBank, Pencil, Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useFinanceSettings } from "@/lib/settings";
import GradientCard from "@/components/GradientCard";

interface SavingsMeterProps {
  totalExpenses: number;
}

export default function SavingsMeter({ totalExpenses }: SavingsMeterProps) {
  const { settings, update, hydrated } = useFinanceSettings();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const budget = settings.monthlyBudget;
  const savings = budget - totalExpenses;
  const savingsRate = budget > 0 ? (savings / budget) * 100 : 0;
  const clampedRate = Math.max(0, Math.min(100, savingsRate));
  const overspent = savings < 0;

  // Semicircle gauge geometry
  const size = 200;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const semiCircumference = Math.PI * radius;
  const dash = (clampedRate / 100) * semiCircumference;

  const meterColor = overspent
    ? "#EF4444"
    : savingsRate >= 50
      ? "#22C55E"
      : savingsRate >= 20
        ? "#F59E0B"
        : "#F97316";

  function startEdit() {
    setDraft(String(budget));
    setEditing(true);
  }

  function saveEdit() {
    const value = Number(draft);
    if (!Number.isNaN(value) && value >= 0) {
      update({ monthlyBudget: value });
    }
    setEditing(false);
  }

  return (
    <GradientCard delay={120} className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <PiggyBank className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Savings Meter
          </h2>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Pencil className="h-3.5 w-3.5" />
            Budget
          </button>
        )}
      </div>

      {editing && (
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
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
            aria-label="Save budget"
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
      )}

      <div className="mt-2 flex flex-col items-center">
        <svg
          viewBox={`0 0 ${size} ${size / 2 + 10}`}
          className="w-full max-w-[240px]"
        >
          {/* Track */}
          <path
            d={`M ${stroke / 2} ${cy} A ${radius} ${radius} 0 0 1 ${
              size - stroke / 2
            } ${cy}`}
            fill="none"
            className="stroke-slate-100 dark:stroke-slate-700"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Value */}
          <path
            d={`M ${stroke / 2} ${cy} A ${radius} ${radius} 0 0 1 ${
              size - stroke / 2
            } ${cy}`}
            fill="none"
            stroke={meterColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${semiCircumference}`}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="-mt-10 text-center">
          <p
            className="text-2xl font-bold"
            style={{ color: meterColor }}
          >
            {hydrated ? `${Math.round(savingsRate)}%` : "—"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {overspent ? "over budget" : "saved"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
          <p className="text-xs text-slate-500 dark:text-slate-400">Budget</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
            {formatCurrency(budget)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {overspent ? "Overspent" : "Savings"}
          </p>
          <p
            className={`mt-0.5 text-sm font-semibold ${
              overspent
                ? "text-red-500"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {formatCurrency(Math.abs(savings))}
          </p>
        </div>
      </div>
    </GradientCard>
  );
}
