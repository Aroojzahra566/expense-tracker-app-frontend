import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

interface DashboardHeaderProps {
  showAddButton?: boolean;
}

export default function DashboardHeader({
  showAddButton = true,
}: DashboardHeaderProps) {
  return (
    <header className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Welcome Arooj ! <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s what&apos;s happening with your finances today.
        </p>
      </div>

      {showAddButton && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            {new Date().toLocaleDateString("en-PK", {
              month: "short",
              year: "numeric",
            })}
          </button>
          <Link
            href="/expenses/add"
            className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Link>
        </div>
      )}
    </header>
  );
}
