import { Suspense } from "react";
import ExpensesPageClient from "@/components/ExpensesPageClient";

export default function ExpensesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-slate-500">
          Loading expenses...
        </div>
      }
    >
      <ExpensesPageClient />
    </Suspense>
  );
}
