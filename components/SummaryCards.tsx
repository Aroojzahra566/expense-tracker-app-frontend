import { Wallet, CreditCard, TrendingUp, PieChart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CategorySummaryItem, DashboardSummary } from "@/lib/types";
import GradientCard from "@/components/GradientCard";

interface SummaryCardsProps {
  summary: DashboardSummary;
  categorySummary?: CategorySummaryItem[];
}

export default function SummaryCards({
  summary,
  categorySummary = [],
}: SummaryCardsProps) {
  const topCategoryTotal =
    categorySummary.find((c) => c.category === summary.topCategory)?.total ?? 0;
  const topCategoryPercentage =
    summary.totalExpenses > 0
      ? Math.round((topCategoryTotal / summary.totalExpenses) * 1000) / 10
      : 0;

  const cards = [
    {
      title: "Total Expenses",
      value: formatCurrency(summary.totalExpenses),
      icon: Wallet,
      iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
      iconColor: "text-indigo-500",
    },
    {
      title: "Total Transactions",
      value: String(summary.totalTransactions),
      icon: CreditCard,
      iconBg: "bg-green-100 dark:bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      title: "Average Expense",
      value: formatCurrency(summary.averageExpense),
      icon: TrendingUp,
      iconBg: "bg-amber-100 dark:bg-amber-500/20",
      iconColor: "text-amber-500",
    },
    {
      title: "Top Category",
      value: summary.topCategory || "—",
      subtitle:
        summary.topCategory && topCategoryTotal > 0
          ? `${formatCurrency(topCategoryTotal)} / ${topCategoryPercentage}%`
          : undefined,
      icon: PieChart,
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <GradientCard key={card.title} delay={index * 80} className="p-5">
          <div className="flex items-start justify-between">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
            >
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            {card.title}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {card.value}
          </p>
          {card.subtitle && (
            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              {card.subtitle}
            </p>
          )}
        </GradientCard>
      ))}
    </div>
  );
}
