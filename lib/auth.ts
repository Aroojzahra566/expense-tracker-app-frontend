import type { AuthResponse, AuthUser } from "@/lib/types";

const TOKEN_KEY = "access_token";
const USER_ID_KEY = "user_id";
const EMAIL_KEY = "email";
const AUTH_CHANGE_EVENT = "auth-change";

function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function subscribeAuth(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const userId = localStorage.getItem(USER_ID_KEY);
  const email = localStorage.getItem(EMAIL_KEY);

  if (!userId || !email) return null;

  return {
    user_id: Number(userId),
    email,
  };
}

export function saveAuthSession(data: AuthResponse): AuthUser {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_ID_KEY, String(data.user_id));
  localStorage.setItem(EMAIL_KEY, data.email);
  notifyAuthChange();

  return { user_id: data.user_id, email: data.email };
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(EMAIL_KEY);
  notifyAuthChange();
}
