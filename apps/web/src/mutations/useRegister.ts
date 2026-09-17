"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { markSessionActive, registerRequest } from "@/api";
import type { RegisterInput } from "@/types";

export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: RegisterInput) => registerRequest(input),
    onSuccess: async (data) => {
      setSession(data.user, data.accessToken);
      await markSessionActive();
      router.push("/main");
    },
  });
}
