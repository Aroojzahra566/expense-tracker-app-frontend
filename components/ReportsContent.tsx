"use client";

import { useEffect, useState } from "react";
import ExpenseOverview from "@/components/ExpenseOverview";
import ApiErrorState from "@/components/ApiErrorState";
import { getCategorySummary, getDashboardSummary } from "@/lib/api";
import { buildCategoryBreakdown, formatCurrency } from "@/lib/utils";
import { getCategoryStyle } from "@/lib/category-styles";
import GradientCard from "@/components/GradientCard";
import type { CategorySummaryItem, DashboardSummary } from "@/lib/types";

export default function ReportsContent() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummaryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getDashboardSummary(), getCategorySummary()])
      .then(([summaryData, categoryData]) => {
        setSummary(summaryData);
        setCategorySummary(categoryData ?? []);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load reports")
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

  if (error || !summary) {
    return <ApiErrorState message={error ?? undefined} />;
  }

  const breakdown = buildCategoryBreakdown(
    categorySummary,
    summary.totalExpenses
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Reports
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Spending analytics by category
        </p>
      </div>

      <ExpenseOverview
        breakdown={breakdown}
        totalExpenses={summary.totalExpenses}
      />

      <GradientCard className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Category Breakdown
        </h2>
        {categorySummary.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            No data available yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {categorySummary.map((item) => {
              const style = getCategoryStyle(item.category);
              const percentage =
                summary.totalExpenses > 0
                  ? Math.round((item.total / summary.totalExpenses) * 1000) /
                    10
                  : 0;

              return (
                <div key={item.category}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(item.total)} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: style.chart,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GradientCard>
    </div>
  );
}
