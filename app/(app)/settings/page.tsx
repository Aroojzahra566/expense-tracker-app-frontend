import GradientCard from "@/components/GradientCard";
import { API_BASE } from "@/lib/api";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          App preferences and configuration
        </p>
      </div>

      <GradientCard className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">API Connection</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The frontend calls the FastAPI backend directly at{" "}
          <code className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
            {API_BASE}
          </code>
          . CORS is enabled for{" "}
          <code className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
            http://localhost:3000
          </code>
          .
        </p>
      </GradientCard>
    </div>
  );
}
