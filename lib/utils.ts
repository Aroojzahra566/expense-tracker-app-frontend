import type { CategoryTimeSeries } from "@/lib/types";

export function formatCurrency(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
  });
}

/** Compact currency for chart axes, e.g. PKR 12.5k */
export function formatCompactCurrency(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return `PKR ${(amount / 1000).toLocaleString("en-PK", {
      maximumFractionDigits: 1,
    })}k`;
  }
  return `PKR ${amount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

export function buildCategoryBreakdown(
  items: { category: string; total: number }[],
  totalExpenses: number
) {
  if (totalExpenses === 0) return [];

  return items.map((item) => ({
    category: item.category,
    amount: item.total,
    percentage: Math.round((item.total / totalExpenses) * 1000) / 10,
  }));
}

export function enrichRecentExpenses<
  T extends { id: number; title: string; amount: number },
>(
  recent: T[],
  allExpenses: { id: number; category: string; date: string }[]
) {
  return recent.map((item) => {
    const full = allExpenses.find((e) => e.id === item.id);
    return {
      ...item,
      category: full?.category ?? "—",
      date: full?.date ?? "",
    };
  });
}

/** Build a per-category daily spending series for the multi-line chart. */
export function buildCategoryTimeSeries(
  expenses: { category: string; date: string; amount: number }[]
): CategoryTimeSeries {
  const dates = Array.from(new Set(expenses.map((e) => e.date)))
    .filter(Boolean)
    .sort();
  const categories = Array.from(new Set(expenses.map((e) => e.category)));
  const dateIndex = new Map(dates.map((d, i) => [d, i]));

  const byCategory = categories.map((category) => {
    const values = new Array(dates.length).fill(0);
    for (const e of expenses) {
      if (e.category === category) {
        const idx = dateIndex.get(e.date);
        if (idx !== undefined) values[idx] += e.amount;
      }
    }
    return { category, values };
  });

  return { dates, byCategory };
}
