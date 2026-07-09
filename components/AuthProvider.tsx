"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import {
  clearAuthSession,
  getStoredUser,
  saveAuthSession,
  subscribeAuth,
} from "@/lib/auth";
import { login, signUp } from "@/lib/api";
import type { AuthUser } from "@/lib/types";
import AuthModal from "@/components/AuthModal";

type AuthMode = "login" | "signup";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isModalOpen: boolean;
  authMode: AuthMode;
  modalKey: number;
  openAuthModal: (mode?: AuthMode) => void;
  switchAuthMode: (mode: AuthMode) => void;
  closeAuthModal: () => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    subscribeAuth,
    getStoredUser,
    () => null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [modalKey, setModalKey] = useState(0);

  const openAuthModal = useCallback((mode: AuthMode = "login") => {
    setAuthMode(mode);
    setModalKey((key) => key + 1);
    setIsModalOpen(true);
  }, []);

  const switchAuthMode = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const data = await login(email, password);
    saveAuthSession(data);
    setIsModalOpen(false);
  }, []);

  const handleSignUp = useCallback(async (email: string, password: string) => {
    const data = await signUp(email, password);
    saveAuthSession(data);
    setIsModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading: false,
        isModalOpen,
        authMode,
        modalKey,
        openAuthModal,
        switchAuthMode,
        closeAuthModal,
        handleLogin,
        handleSignUp,
        logout,
      }}
    >
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export { getApiErrorMessage } from "@/lib/api";
