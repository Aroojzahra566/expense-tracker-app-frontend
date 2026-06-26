"use client";

import { useMemo, useState } from "react";
import { BarChart3, LineChart } from "lucide-react";
import { getCategoryStyle } from "@/lib/category-styles";
import {
  formatCompactCurrency,
  formatCurrency,
  formatShortDate,
} from "@/lib/utils";
import type { CategoryBreakdownItem, CategoryTimeSeries } from "@/lib/types";
import GradientCard from "@/components/GradientCard";

type ChartTab = "bar" | "line";

interface DashboardChartsProps {
  breakdown: CategoryBreakdownItem[];
  timeSeries: CategoryTimeSeries;
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundedTopBar(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.max(0, Math.min(r, w / 2, h));
  return `M ${x} ${y + h} L ${x} ${y + radius} Q ${x} ${y} ${x + radius} ${y} L ${
    x + w - radius
  } ${y} Q ${x + w} ${y} ${x + w} ${y + radius} L ${x + w} ${y + h} Z`;
}

function smoothLinePath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-transparent"
            style={{
              backgroundColor: item.color,
              boxShadow: `0 0 0 1px ${hexToRgba(item.color, 0.3)}`,
            }}
          />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function BarChartView({ breakdown }: { breakdown: CategoryBreakdownItem[] }) {
  const width = 560;
  const height = 300;
  const padding = { top: 24, right: 16, bottom: 52, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...breakdown.map((b) => b.amount), 1);
  const ticks = 4;
  const slot = chartW / breakdown.length;
  const barW = Math.min(slot * 0.5, 56);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {breakdown.map((item, i) => {
          const color = getCategoryStyle(item.category).chart;
          return (
            <linearGradient
              key={item.category}
              id={`bar-grad-${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={color} stopOpacity="0.55" />
            </linearGradient>
          );
        })}
      </defs>

      {/* Y grid + labels */}
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const value = (maxVal / ticks) * i;
        const y = padding.top + chartH - (chartH / ticks) * i;
        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              className="stroke-slate-200/70 dark:stroke-slate-700/50"
              strokeWidth={1}
              strokeDasharray={i === 0 ? "0" : "4 4"}
            />
            <text
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              className="fill-slate-400 text-[10px]"
            >
              {formatCompactCurrency(value)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {breakdown.map((item, i) => {
        const barH = (item.amount / maxVal) * chartH;
        const x = padding.left + slot * i + (slot - barW) / 2;
        const y = padding.top + chartH - barH;
        return (
          <g key={item.category}>
            <path
              d={roundedTopBar(x, y, barW, barH, 8)}
              fill={`url(#bar-grad-${i})`}
              className="transition-all duration-500"
            >
              <title>
                {item.category}: {formatCurrency(item.amount)}
              </title>
            </path>
            <text
              x={x + barW / 2}
              y={y - 8}
              textAnchor="middle"
              className="fill-slate-600 text-[10px] font-semibold dark:fill-slate-300"
            >
              {formatCompactCurrency(item.amount)}
            </text>
            <text
              x={x + barW / 2}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="fill-slate-500 text-[10px] font-medium dark:fill-slate-400"
            >
              {item.category.length > 9
                ? `${item.category.slice(0, 8)}…`
                : item.category}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChartView({ timeSeries }: { timeSeries: CategoryTimeSeries }) {
  const { dates, byCategory } = timeSeries;
  const width = 560;
  const height = 320;
  const padding = { top: 24, right: 20, bottom: 52, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...byCategory.flatMap((c) => c.values), 1);
  const ticks = 4;

  const xFor = (i: number) =>
    dates.length === 1
      ? padding.left + chartW / 2
      : padding.left + (chartW / (dates.length - 1)) * i;
  const yFor = (v: number) => padding.top + chartH - (v / maxVal) * chartH;
  const baseline = padding.top + chartH;

  return (
    <div className="space-y-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {byCategory.map((cat, i) => {
            const color = getCategoryStyle(cat.category).chart;
            return (
              <linearGradient
                key={cat.category}
                id={`line-area-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            );
          })}
        </defs>

        {/* Y grid + labels */}
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const value = (maxVal / ticks) * i;
          const y = padding.top + chartH - (chartH / ticks) * i;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                className="stroke-slate-200/70 dark:stroke-slate-700/50"
                strokeWidth={1}
                strokeDasharray={i === 0 ? "0" : "4 4"}
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[10px]"
              >
                {formatCompactCurrency(value)}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {dates.map((d, i) => (
          <text
            key={d}
            x={xFor(i)}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            className="fill-slate-500 text-[10px] font-medium dark:fill-slate-400"
          >
            {formatShortDate(d)}
          </text>
        ))}

        {/* Lines + area per category */}
        {byCategory.map((cat, i) => {
          const color = getCategoryStyle(cat.category).chart;
          const pts = cat.values.map((v, idx) => ({
            x: xFor(idx),
            y: yFor(v),
          }));
          const linePath = smoothLinePath(pts);

          return (
            <g key={cat.category}>
              {pts.length > 1 && (
                <>
                  <path
                    d={`${linePath} L ${pts[pts.length - 1].x} ${baseline} L ${
                      pts[0].x
                    } ${baseline} Z`}
                    fill={`url(#line-area-${i})`}
                    className="transition-all duration-500"
                  />
                  <path
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                  />
                </>
              )}
              {pts.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill="var(--card-bg, #fff)"
                  stroke={color}
                  strokeWidth={2.5}
                >
                  <title>
                    {cat.category} · {formatShortDate(dates[idx])}:{" "}
                    {formatCurrency(cat.values[idx])}
                  </title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>

      <Legend
        items={byCategory.map((c) => ({
          label: c.category,
          color: getCategoryStyle(c.category).chart,
        }))}
      />
    </div>
  );
}

const TABS: { id: ChartTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "bar", label: "Bar", icon: BarChart3 },
  { id: "line", label: "Line", icon: LineChart },
];

export default function DashboardCharts({
  breakdown,
  timeSeries,
}: DashboardChartsProps) {
  const [tab, setTab] = useState<ChartTab>("bar");

  const hasCategoryData = breakdown.length > 0;
  const hasTimeData = timeSeries.dates.length > 0;

  const description = useMemo(() => {
    switch (tab) {
      case "bar":
        return "Total spending compared across categories";
      case "line":
        return "Daily spending trend — one colored line per category";
    }
  }, [tab]);

  return (
    <GradientCard delay={280} className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Spending Analytics
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/60">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {tab === "bar" &&
          (hasCategoryData ? (
            <BarChartView breakdown={breakdown} />
          ) : (
            <EmptyChart />
          ))}
        {tab === "line" &&
          (hasTimeData ? (
            <LineChartView timeSeries={timeSeries} />
          ) : (
            <EmptyChart />
          ))}
      </div>
    </GradientCard>
  );
}

function EmptyChart() {
  return (
    <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
      No data yet. Add expenses to see this chart.
    </p>
  );
}
