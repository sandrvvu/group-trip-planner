import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { clearSessionMarker } from "./session";
import { useAuthStore } from "@/store/authStore";
import type { AuthResponse } from "@/types";

const AUTH_PATHS = ["/auth/register", "/auth/login", "/auth/refresh"];

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

function isAuthPath(url: string | undefined): boolean {
  return !!url && AUTH_PATHS.some((path) => url.startsWith(path));
}

httpClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && !isAuthPath(config.url)) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  refreshPromise ??= httpClient
    .post<AuthResponse>("/auth/refresh")
    .then(({ data }) => {
      useAuthStore.getState().setSession(data.user, data.accessToken);
      return data.accessToken;
    })
    .catch(() => {
      useAuthStore.getState().clearSession();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

let redirectingToLogin = false;

async function redirectToLogin(): Promise<void> {
  if (
    redirectingToLogin ||
    typeof window === "undefined" ||
    window.location.pathname === "/login"
  ) {
    return;
  }
  redirectingToLogin = true;
  await clearSessionMarker();
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- outside the React tree, no router access
  window.location.href = "/login";
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !config ||
      config._retried ||
      isAuthPath(config.url) ||
      redirectingToLogin
    ) {
      throw error;
    }

    config._retried = true;
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      await redirectToLogin();
      throw error;
    }

    config.headers.set("Authorization", `Bearer ${newAccessToken}`);
    return httpClient(config);
  },
);
