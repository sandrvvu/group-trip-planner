import { NextResponse, type NextRequest } from "next/server";
import { SESSION_MARKER_COOKIE } from "@/lib/constants";

const GUEST_ONLY_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_MARKER_COOKIE);
  const { pathname } = request.nextUrl;

  if (!hasSession && pathname.startsWith("/main")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && GUEST_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/main/:path*", "/login", "/register"],
};
