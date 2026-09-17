import { create } from "zustand";
import type { PublicUser } from "@repo/shared";

type AuthStatus = "idle" | "authenticated" | "unauthenticated";

type AuthState = {
  user: PublicUser | null;
  accessToken: string | null;
  status: AuthStatus;
  setSession: (user: PublicUser, accessToken: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: "idle",
  setSession: (user, accessToken) => set({ user, accessToken, status: "authenticated" }),
  clearSession: () => set({ user: null, accessToken: null, status: "unauthenticated" }),
}));
