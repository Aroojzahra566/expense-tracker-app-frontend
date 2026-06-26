import Link from "next/link";
import { getCategoryIcon, getCategoryStyle } from "@/lib/category-styles";
import { formatCurrency, formatDisplayDate } from "@/lib/utils";
import type { EnrichedRecentExpense } from "@/lib/types";
import GradientCard from "@/components/GradientCard";

interface RecentExpensesProps {
  expenses: EnrichedRecentExpense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <GradientCard delay={400} className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent Expenses
        </h2>
        <Link
          href="/expenses"
          className="text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View All
        </Link>
      </div>

      {expenses.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          No recent expenses yet.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-slate-100 dark:divide-slate-700/50">
          {expenses.map((expense, index) => {
            const Icon = getCategoryIcon(expense.category);
            const colors = getCategoryStyle(expense.category);

            return (
              <li
                key={expense.id}
                className="flex animate-fade-in-up items-center justify-between gap-3 py-4 transition-colors duration-200 first:pt-0 last:pb-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                style={{ animationDelay: `${480 + index * 70}ms` }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {expense.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {expense.category}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </p>
                  {expense.date && (
                    <p className="text-xs text-slate-400">
                      {formatDisplayDate(expense.date)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </GradientCard>
  );
}
