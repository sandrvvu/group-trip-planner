"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { markSessionActive, loginRequest } from "@/api";
import type { LoginInput } from "@/types";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => loginRequest(input),
    onSuccess: async (data) => {
      setSession(data.user, data.accessToken);
      await markSessionActive();
      router.push("/main");
    },
  });
}
