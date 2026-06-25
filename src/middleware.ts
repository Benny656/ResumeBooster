import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED = ["/dashboard", "/history", "/results"];
// Routes only for unauthenticated users
const AUTH_ONLY = ["/login"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const path = nextUrl.pathname;

  const isProtected = PROTECTED.some((route) => path.startsWith(route));
  const isAuthOnly = AUTH_ONLY.some((route) => path.startsWith(route));

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from the login page
  if (isAuthOnly && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all routes except Next.js internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
