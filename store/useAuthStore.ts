import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    role?: "user" | "admin";
    squad?: number;
    batch?: number;
    defaultSeat?: number;
  } | null;
  setToken: (token: string) => void;
  setUser: (user: {
    id: string;
    email: string;
    name: string;
    role?: "user" | "admin";
    squad?: number;
    batch?: number;
    defaultSeat?: number;
  } | null) => void;
  clearToken: () => void;
  clearAuth: () => void;
  hydrated: boolean;
  setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clearToken: () => set({ token: null }),
      clearAuth: () => set({ token: null, user: null }),
      hydrated: false,
      setHydrated: (state) => set({ hydrated: state }),
    }),
    {
      name: "auth-token",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
