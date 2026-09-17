"use client";

import { useRouter } from "next/navigation";
import { clearSessionMarker } from "@/api";
import { useAuthStore } from "@/store/authStore";

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  return async () => {
    clearSession();
    await clearSessionMarker();
    router.push("/");
  };
}
