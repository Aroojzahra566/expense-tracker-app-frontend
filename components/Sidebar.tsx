"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Tags,
  BarChart3,
  Settings,
  Moon,
  Sun,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getDashboardSummary } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Add Expense", href: "/expenses/add", icon: PlusCircle },
  { label: "Categories", href: "/categories", icon: Tags },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, isLoading, openAuthModal, logout } = useAuth();
  const [totalBalance, setTotalBalance] = useState<number | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then((data) => setTotalBalance(data.totalExpenses))
      .catch(() => setTotalBalance(null));
  }, [pathname]);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#13132b] text-white transition-colors duration-300">
      <Link href="/" className="flex items-center gap-3 px-6 py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/slazzer-preview-mki50.png"
          alt="Spendora logo"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 object-contain"
        />
        <span className="text-lg font-bold tracking-tight">Spendora</span>
      </Link>

      <nav className="mt-2 flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-4 px-4 pb-6">
        {!isLoading && (
          <div className="rounded-2xl bg-[#1e1e3f] p-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {user.email}
                    </p>
                    <p className="text-xs text-slate-400">Signed in</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-indigo-600"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-[#1e1e3f] p-4 transition-transform duration-300 hover:scale-[1.02]">
          <p className="text-xs font-medium text-slate-400">Total Balance</p>
          <p className="mt-1 text-2xl font-bold">
            {totalBalance !== null ? formatCurrency(totalBalance) : "—"}
          </p>
          <div className="mt-4 h-12 overflow-hidden">
            <svg viewBox="0 0 200 48" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 40 Q 25 35, 50 30 T 100 20 T 150 15 T 200 8 L 200 48 L 0 48 Z"
                fill="url(#balanceGradient)"
              />
              <path
                d="M0 40 Q 25 35, 50 30 T 100 20 T 150 15 T 200 8"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl px-2 py-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            data-active={isDark}
            onClick={toggleTheme}
            className="theme-toggle relative h-6 w-11 rounded-full bg-slate-700"
          >
            <span className="theme-toggle-thumb absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow" />
          </button>
        </div>
      </div>
    </aside>
  );
}
