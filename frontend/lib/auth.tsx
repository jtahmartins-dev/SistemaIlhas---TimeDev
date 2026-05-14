"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "./api";
import type { UserPublic } from "./types";

interface AuthState {
  user: UserPublic | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<UserPublic>;
  register: (body: {
    nome: string;
    email: string;
    senha: string;
    role: string;
    ilha_slug?: string | null;
  }) => Promise<UserPublic>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, senha: string) => {
    const r = await api.login(email, senha);
    localStorage.setItem("token", r.access_token);
    setUser(r.user);
    return r.user;
  };

  const register = async (body: {
    nome: string;
    email: string;
    senha: string;
    role: string;
    ilha_slug?: string | null;
  }) => {
    const r = await api.register(body);
    localStorage.setItem("token", r.access_token);
    setUser(r.user);
    return r.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fora do AuthProvider");
  return ctx;
}
