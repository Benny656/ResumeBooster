import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/database/mongodb";
import ResumeAnalysisModel from "@/models/ResumeAnalysis";
import type { ApiError } from "@/lib/ai/analysis";

// ─── Runtime ───────────────────────────────────────────────────────────────────
export const runtime = "nodejs";

// ─── GET /api/history ──────────────────────────────────────────────────────────
// Returns a paginated list of past analyses for the authenticated user.
//
// Query params:
//   page   – page number, 1-indexed (default: 1)
//   limit  – results per page (default: 10, max: 50)

export async function GET(
  req: NextRequest
): Promise<NextResponse> {
  try {
    // ── 1. Resolve userId ───────────────────────────────────────────────────
    // TODO: Replace with real auth session lookup.
    const userId = req.headers.get("x-user-id") ?? "anonymous";

    // ── 2. Parse pagination params ──────────────────────────────────────────
    const { searchParams } = req.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    );
    const skip = (page - 1) * limit;

    // ── 3. Query DB ─────────────────────────────────────────────────────────
    await connectDB();

    const [analyses, total] = await Promise.all([
      ResumeAnalysisModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        // Exclude heavy text fields from the list view for performance
        .select("-resume -jobDescription -rewrittenResume")
        .lean(),
      ResumeAnalysisModel.countDocuments({ userId }),
    ]);

    return NextResponse.json(
      {
        data: analyses,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/history GET] Unhandled error:", err);

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    return NextResponse.json<ApiError>(
      { error: "Failed to retrieve history.", details: message },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/history ───────────────────────────────────────────────────────
// Deletes a single analysis by ID for the authenticated user.
//
// Query params:
//   id – MongoDB _id of the analysis to delete (required)

export async function DELETE(
  req: NextRequest
): Promise<NextResponse> {
  try {
    // ── 1. Resolve userId ───────────────────────────────────────────────────
    const userId = req.headers.get("x-user-id") ?? "anonymous";

    // ── 2. Validate id param ────────────────────────────────────────────────
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json<ApiError>(
        { error: "Missing required query parameter: id" },
        { status: 400 }
      );
    }

    // ── 3. Delete (scoped to userId to prevent unauthorised deletion) ───────
    await connectDB();

    const deleted = await ResumeAnalysisModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return NextResponse.json<ApiError>(
        {
          error: "Analysis not found.",
          details:
            "No analysis with that ID exists for your account.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Analysis deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/history DELETE] Unhandled error:", err);

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    return NextResponse.json<ApiError>(
      { error: "Failed to delete analysis.", details: message },
      { status: 500 }
    );
  }
}
