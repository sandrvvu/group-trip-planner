export const APP_NAME = "group-trip-planner";

export type HealthStatus = {
  status: "ok" | "error";
  db: "up" | "down";
};

export type ApiError = {
  statusCode: number;
  message: string | string[];
  error: string;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
};

export function greet(name: string): string {
  return `${APP_NAME}: ${name}`;
}
