import type { AuthResponse, LoginInput, RegisterInput } from "@/types";
import { httpClient } from "./httpClient";

export async function registerRequest(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>("/auth/register", input);
  return data;
}

export async function loginRequest(input: LoginInput): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>("/auth/login", input);
  return data;
}
