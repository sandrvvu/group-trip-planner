import type { PublicUser } from "@/types";
import { httpClient } from "./httpClient";

export async function fetchCurrentUser(): Promise<PublicUser> {
  const { data } = await httpClient.get<PublicUser>("/users/me");
  return data;
}
