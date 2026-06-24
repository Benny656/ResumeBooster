import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ResumeAnalysisModel from "@/models/ResumeAnalysis";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id") ?? "anonymous";
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    await connectDB();

    const analysis = await ResumeAnalysisModel.findOne({
      _id: id,
      userId,
    }).lean();

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: analysis }, { status: 200 });
  } catch (err) {
    console.error("[/api/analyze/[id] GET] Unhandled error:", err);

    return NextResponse.json(
      { error: "Failed to retrieve analysis." },
      { status: 500 }
    );
  }
}
