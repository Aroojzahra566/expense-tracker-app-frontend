"use client";

import { useEffect, useState } from "react";
import { getCategoryIcon, getCategoryStyle } from "@/lib/category-styles";
import ApiErrorState from "@/components/ApiErrorState";
import GradientCard from "@/components/GradientCard";
import { getCategories } from "@/lib/api";

export default function CategoriesContent() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data ?? []))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load categories")
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

  if (error) {
    return <ApiErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Available expense categories for your transactions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const style = getCategoryStyle(category);
          const Icon = getCategoryIcon(category);

          return (
            <GradientCard key={category} delay={index * 60} className="p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.icon}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {category}
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
                  >
                    Active
                  </span>
                </div>
              </div>
            </GradientCard>
          );
        })}
      </div>
    </div>
  );
}
