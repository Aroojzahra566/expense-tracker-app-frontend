import { notFound } from "next/navigation";
import EditExpensePageClient from "@/components/EditExpensePageClient";

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = await params;
  const expenseId = Number(id);

  if (Number.isNaN(expenseId)) {
    notFound();
  }

  return <EditExpensePageClient expenseId={expenseId} />;
}
