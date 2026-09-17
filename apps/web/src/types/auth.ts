export type { PublicUser, AuthResponse, ApiError } from "@repo/shared";

export type RegisterInput = {
  email: string;
  name: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
