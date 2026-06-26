"use client";

import { useCallback, useEffect, useState } from "react";

export interface FinanceSettings {
  /** Monthly budget / income used to compute savings. */
  monthlyBudget: number;
  /** Target spending limit for the period. */
  spendingGoal: number;
}

const STORAGE_KEY = "expensetrac:finance-settings";

const DEFAULT_SETTINGS: FinanceSettings = {
  monthlyBudget: 50000,
  spendingGoal: 30000,
};

function readSettings(): FinanceSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<FinanceSettings>;
    return {
      monthlyBudget:
        typeof parsed.monthlyBudget === "number"
          ? parsed.monthlyBudget
          : DEFAULT_SETTINGS.monthlyBudget,
      spendingGoal:
        typeof parsed.spendingGoal === "number"
          ? parsed.spendingGoal
          : DEFAULT_SETTINGS.spendingGoal,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useFinanceSettings() {
  const [settings, setSettings] = useState<FinanceSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
    setHydrated(true);
  }, []);

  const update = useCallback((partial: Partial<FinanceSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore write errors (e.g. private mode) */
      }
      return next;
    });
  }, []);

  return { settings, update, hydrated };
}
