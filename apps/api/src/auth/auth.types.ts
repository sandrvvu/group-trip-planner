import type { AuthResponse } from "@repo/shared";

export const REFRESH_TOKEN_COOKIE = "refresh_token";

export type JwtPayload = {
  sub: string;
  email: string;
};

export type RefreshJwtPayload = {
  sub: string;
  jti: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

export type RefreshAuthUser = {
  id: string;
  refreshToken: string;
};

export type AuthResult = AuthResponse & {
  refreshToken: string;
};
