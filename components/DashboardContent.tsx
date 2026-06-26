"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import SummaryCards from "@/components/SummaryCards";
import ExpenseOverview from "@/components/ExpenseOverview";
import RecentExpenses from "@/components/RecentExpenses";
import ExpensesTable from "@/components/ExpensesTable";
import ApiErrorState from "@/components/ApiErrorState";
import SavingsMeter from "@/components/SavingsMeter";
import SpendingGoal from "@/components/SpendingGoal";
import DashboardCharts from "@/components/DashboardCharts";
import { getDashboardData } from "@/lib/api";
import {
  buildCategoryBreakdown,
  buildCategoryTimeSeries,
  enrichRecentExpenses,
} from "@/lib/utils";
import type {
  CategorySummaryItem,
  DashboardSummary,
  Expense,
  RecentExpense,
} from "@/lib/types";

export default function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recent, setRecent] = useState<RecentExpense[]>([]);
  const [categorySummary, setCategorySummary] = useState<CategorySummaryItem[]>(
    []
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDashboardData();
      setSummary(data.summary);
      setRecent(data.recent);
      setCategorySummary(data.categorySummary);
      setExpenses(data.expenses);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardHeader showAddButton={false} />
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading dashboard from API...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="space-y-6">
        <DashboardHeader showAddButton={false} />
        <ApiErrorState message={error ?? undefined} />
      </div>
    );
  }

  const breakdown = buildCategoryBreakdown(
    categorySummary,
    summary.totalExpenses
  );
  const enrichedRecent = enrichRecentExpenses(recent, expenses);
  const timeSeries = buildCategoryTimeSeries(expenses);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <SummaryCards summary={summary} categorySummary={categorySummary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SavingsMeter totalExpenses={summary.totalExpenses} />
        <SpendingGoal totalExpenses={summary.totalExpenses} />
      </div>

      <DashboardCharts breakdown={breakdown} timeSeries={timeSeries} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ExpenseOverview
            breakdown={breakdown}
            totalExpenses={summary.totalExpenses}
          />
        </div>
        <div>
          <RecentExpenses expenses={enrichedRecent} />
        </div>
      </div>
      <ExpensesTable expenses={expenses} onExpenseDeleted={loadDashboard} />
    </div>
  );
}
