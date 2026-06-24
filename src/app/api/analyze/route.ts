import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/database/mongodb";
import { analyzeResume } from "@/lib/ai/prompts";
import { GROQ_MODEL } from "@/config/ai";
import ResumeAnalysisModel from "@/models/ResumeAnalysis";
import type { AnalyzeRequest, AnalyzeResponse, ApiError } from "@/lib/ai/analysis";

// ─── Runtime ───────────────────────────────────────────────────────────────────
// Keep on Node.js runtime so Mongoose / native crypto work correctly.
export const runtime = "nodejs";

// ─── POST /api/analyze ─────────────────────────────────────────────────────────

export async function POST(
  req: NextRequest
): Promise<NextResponse<AnalyzeResponse | ApiError>> {
  try {
    console.log("STEP 1: Request received");
    // ── 1. Parse & validate body ────────────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { resume, jobDescription, industry, template } =
      (body ?? {}) as Partial<AnalyzeRequest>;

    const missing: string[] = [];
    if (!resume?.trim()) missing.push("resume");
    if (!jobDescription?.trim()) missing.push("jobDescription");
    if (!industry?.trim()) missing.push("industry");
    if (!template?.trim()) missing.push("template");

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
          details: `The following fields are required: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const analysisRequest: AnalyzeRequest = {
      resume: resume!.trim(),
      jobDescription: jobDescription!.trim(),
      industry: industry!.trim(),
      template: template!.trim(),
    };

    // ── 2. Resolve userId ───────────────────────────────────────────────────
    // TODO: Replace with real auth (e.g. NextAuth / Clerk session) once
    //       the auth layer is wired up.
    const userId = req.headers.get("x-user-id") ?? "anonymous";

    console.log("STEP 2: Request validated");

    // ── 3. Run AI analysis ──────────────────────────────────────────────────
    console.log("STEP 3: Starting AI analysis");
    const result = await analyzeResume(analysisRequest);

    console.log("STEP 4: AI analysis complete");

    // ── 4. Compute legacy values & total score ──────────────────────────────
    const totalScore =
      result.keywordScore +
      result.skillsScore +
      result.experienceScore +
      result.structureScore;

    const mergedMissingSkills = [
      ...result.requiredMissingSkills,
      ...result.preferredMissingSkills,
    ];

    console.log("STEP 5: Connecting to MongoDB");
    await connectDB();
    console.log("STEP 6: MongoDB connected");
    console.log("STEP 7: Saving analysis");
    const doc = await ResumeAnalysisModel.create({
      userId,
      ...analysisRequest,
      ...result,
      totalScore,
      score: totalScore,
      missingSkills: mergedMissingSkills,
      modelUsed: GROQ_MODEL,
      promptVersion: "v2.0",
    });
    console.log("STEP 8: Analysis saved");

    // ── 5. Return response ──────────────────────────────────────────────────
    console.log("STEP 9: Returning response");
    const response: AnalyzeResponse = {
      id: doc._id.toString(),
      score: totalScore,
      totalScore,
      keywordScore: result.keywordScore,
      skillsScore: result.skillsScore,
      experienceScore: result.experienceScore,
      structureScore: result.structureScore,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      missingSkills: mergedMissingSkills,
      requiredMissingSkills: result.requiredMissingSkills,
      preferredMissingSkills: result.preferredMissingSkills,
      suggestions: result.suggestions,
      rewrittenResume: result.rewrittenResume,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("ANALYZE ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Unknown error",
      },
      { status: 500 }
    );
  }
}
