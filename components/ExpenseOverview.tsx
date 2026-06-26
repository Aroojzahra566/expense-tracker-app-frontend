import { getCategoryStyle } from "@/lib/category-styles";
import { formatCurrency } from "@/lib/utils";
import type { CategoryBreakdownItem } from "@/lib/types";
import GradientCard from "@/components/GradientCard";

interface DonutChartProps {
  breakdown: CategoryBreakdownItem[];
  totalExpenses: number;
}

function DonutChart({ breakdown, totalExpenses }: DonutChartProps) {
  const size = 200;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let offset = 0;

  const segments = breakdown.map((item) => {
    const dash = (item.percentage / 100) * circumference;
    const segment = {
      ...item,
      dash,
      offset,
      color: getCategoryStyle(item.category).chart,
    };
    offset += dash;
    return segment;
  });

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90 animate-fade-in">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-slate-100 dark:stroke-slate-700"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg) => (
          <circle
            key={seg.category}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="butt"
            className="transition-all duration-500"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          {formatCurrency(totalExpenses)}
        </p>
      </div>
    </div>
  );
}

interface ExpenseOverviewProps {
  breakdown: CategoryBreakdownItem[];
  totalExpenses: number;
}

export default function ExpenseOverview({
  breakdown,
  totalExpenses,
}: ExpenseOverviewProps) {
  return (
    <GradientCard delay={320} className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Expense Overview
      </h2>
      {breakdown.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          No expense data yet. Add your first expense to see the breakdown.
        </p>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          <DonutChart breakdown={breakdown} totalExpenses={totalExpenses} />
          <ul className="w-full space-y-4 lg:max-w-xs">
            {breakdown.map((item, index) => (
              <li
                key={item.category}
                className="flex animate-fade-in-up items-center justify-between gap-4"
                style={{ animationDelay: `${400 + index * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: getCategoryStyle(item.category).chart,
                    }}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(item.amount)}
                  </p>
                  <p className="text-xs text-slate-400">{item.percentage}%</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GradientCard>
  );
}
