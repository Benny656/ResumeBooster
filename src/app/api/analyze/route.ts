import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/database/mongodb";
import { analyzeResume } from "@/lib/ai/prompts";
import { GROQ_MODEL } from "@/config/ai";
import ResumeAnalysisModel from "@/models/ResumeAnalysis";
import type { AnalyzeRequest, AnalyzeResponse, ApiError } from "@/lib/ai/analysis";
import { auth } from "@/auth";

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

    // ── Input length guardrails ─────────────────────────────────────────────
    const RESUME_MAX = 15000;
    const JD_MAX = 5000;

    if ((resume?.length ?? 0) > RESUME_MAX) {
      return NextResponse.json(
        { error: `Resume is too long. Please keep it under ${RESUME_MAX.toLocaleString()} characters.` },
        { status: 400 }
      );
    }
    if ((jobDescription?.length ?? 0) > JD_MAX) {
      return NextResponse.json(
        { error: `Job description is too long. Please keep it under ${JD_MAX.toLocaleString()} characters.` },
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
    const session = await auth();
    const userId = session?.user?.id ?? "anonymous";

    // ── 3. Run AI analysis ──────────────────────────────────────────────────
    const result = await analyzeResume(analysisRequest);

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

    await connectDB();
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

    // ── 5. Return response ──────────────────────────────────────────────────
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
    console.error("[/api/analyze POST] Error:", error);

    // Friendly rate-limit message
    const msg = error instanceof Error ? error.message : "Unknown error";
    const isRateLimit = msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("429");

    return NextResponse.json(
      {
        error: isRateLimit
          ? "Our AI service is currently busy. Please wait a moment and try again."
          : msg,
      },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
