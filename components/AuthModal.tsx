"use client";

import { useEffect, useState, useTransition } from "react";
import { LogIn, UserPlus, X } from "lucide-react";
import { useAuth, getApiErrorMessage } from "@/components/AuthProvider";

function AuthModalForm() {
  const {
    authMode,
    switchAuthMode,
    handleLogin,
    handleSignUp,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    startTransition(async () => {
      try {
        if (authMode === "login") {
          await handleLogin(trimmedEmail, password);
        } else {
          await handleSignUp(trimmedEmail, password);
        }
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    });
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20";

  return (
    <>
      <div className="mb-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => switchAuthMode("login")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            authMode === "login"
              ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <LogIn className="h-4 w-4" />
          Login
        </button>
        <button
          type="button"
          onClick={() => switchAuthMode("signup")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            authMode === "signup"
              ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="auth-email"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={
              authMode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
            disabled={isPending}
          />
          {authMode === "signup" && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Must be at least 6 characters
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all hover:bg-indigo-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Please wait..."
            : authMode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>
    </>
  );
}

export default function AuthModal() {
  const { isModalOpen, authMode, modalKey, closeAuthModal } = useAuth();

  useEffect(() => {
    if (!isModalOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuthModal();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen, closeAuthModal]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close authentication modal"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="animate-fade-in-up relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#16162e]"
      >
        <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 px-6 py-8 text-white">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/slazzer-preview-mki50.png"
              alt="Spendora logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div>
              <h2 id="auth-modal-title" className="text-xl font-bold">
                {authMode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="mt-0.5 text-sm text-indigo-100">
                {authMode === "login"
                  ? "Sign in to your Spendora account"
                  : "Start tracking your expenses today"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AuthModalForm key={modalKey} />
        </div>
      </div>
    </div>
  );
}
