import { AlertCircle } from "lucide-react";
import GradientCard from "@/components/GradientCard";

interface ApiErrorStateProps {
  message?: string;
}

export default function ApiErrorState({
  message = "Could not connect to the API. Make sure the backend is running: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload",
}: ApiErrorStateProps) {
  return (
    <GradientCard className="p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/20">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          Unable to load data
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    </GradientCard>
  );
}
