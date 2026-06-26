import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex min-h-screen transition-colors duration-300">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
