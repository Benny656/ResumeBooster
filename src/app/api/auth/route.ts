import { NextRequest, NextResponse } from "next/server";
import type { ApiError } from "@/types/analysis";

// ─── Runtime ───────────────────────────────────────────────────────────────────
export const runtime = "nodejs";

// ─── Placeholder Auth Route ────────────────────────────────────────────────────
// This file is a scaffold for the authentication layer.
//
// Recommended next steps:
//   Option A – NextAuth.js  : install `next-auth`, add `authOptions`, and
//              replace this file with a [...nextauth]/route.ts handler.
//   Option B – Clerk        : install `@clerk/nextjs`, add the middleware,
//              and use `currentUser()` / `auth()` in API routes.
//   Option C – Custom JWT   : implement sign-in / sign-up logic here and
//              issue short-lived JWTs stored in HttpOnly cookies.
//
// Until auth is implemented every route reads `x-user-id` from request headers
// and falls back to "anonymous".

// ─── GET /api/auth ─────────────────────────────────────────────────────────────
// Returns the current session / auth status.

export async function GET(
  _req: NextRequest
): Promise<NextResponse> {
  // TODO: Decode real session (JWT cookie / provider token) and return user info.
  return NextResponse.json(
    {
      authenticated: false,
      user: null,
      message:
        "Auth not yet implemented. See app/api/auth/route.ts for setup instructions.",
    },
    { status: 200 }
  );
}

// ─── POST /api/auth ────────────────────────────────────────────────────────────
// Sign-in placeholder.

export async function POST(
  req: NextRequest
): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiError>(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  // TODO: Validate credentials, look up user in DB, issue session token.
  console.log("[/api/auth POST] Sign-in placeholder called with:", body);

  return NextResponse.json(
    {
      message:
        "Auth not yet implemented. See app/api/auth/route.ts for setup instructions.",
    },
    { status: 501 }
  );
}

// ─── DELETE /api/auth ──────────────────────────────────────────────────────────
// Sign-out placeholder.

export async function DELETE(
  _req: NextRequest
): Promise<NextResponse> {
  // TODO: Invalidate session / clear cookie.
  return NextResponse.json(
    {
      message: "Sign-out not yet implemented.",
    },
    { status: 501 }
  );
}
