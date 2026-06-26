import {
  Car,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Tv,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface CategoryStyle {
  chart: string;
  bg: string;
  text: string;
  icon: string;
}

const PRESET_STYLES: Record<string, CategoryStyle> = {
  Food: {
    chart: "#3B82F6",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  Travel: {
    chart: "#22C55E",
    bg: "bg-green-50 dark:bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    icon: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  },
  Shopping: {
    chart: "#F59E0B",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  Bills: {
    chart: "#14B8A6",
    bg: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-600 dark:text-teal-400",
    icon: "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
  },
  Entertainment: {
    chart: "#EC4899",
    bg: "bg-pink-50 dark:bg-pink-500/10",
    text: "text-pink-600 dark:text-pink-400",
    icon: "bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400",
  },
  Healthcare: {
    chart: "#EF4444",
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    icon: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  },
  Education: {
    chart: "#8B5CF6",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
  },
};

const FALLBACK_CHART_COLORS = [
  "#6366F1",
  "#0EA5E9",
  "#F97316",
  "#84CC16",
  "#D946EF",
];

export function getCategoryStyle(category: string): CategoryStyle {
  if (PRESET_STYLES[category]) {
    return PRESET_STYLES[category];
  }

  const hash = category
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = FALLBACK_CHART_COLORS[hash % FALLBACK_CHART_COLORS.length];

  return {
    chart: color,
    bg: "bg-slate-50 dark:bg-slate-500/10",
    text: "text-slate-600 dark:text-slate-400",
    icon: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
  };
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Food: UtensilsCrossed,
  Travel: Car,
  Shopping: ShoppingBag,
  Bills: Zap,
  Entertainment: Tv,
  Healthcare: HeartPulse,
  Education: GraduationCap,
};

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category] ?? ShoppingBag;
}
