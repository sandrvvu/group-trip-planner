"use server";

import { cookies } from "next/headers";
import { SESSION_MARKER_COOKIE } from "@/lib/constants";

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

export async function markSessionActive(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_MARKER_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS,
  });
}

export async function clearSessionMarker(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_MARKER_COOKIE);
}
