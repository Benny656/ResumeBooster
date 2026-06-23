import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Result } from '@/models/Result';

/**
 * POST /api/results
 * Body: { email, resumeText, jobDescription, industry, rewrittenOutput }
 * Saves a new Result document to MongoDB Atlas.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, resumeText, jobDescription, industry, rewrittenOutput } = body;

    if (rewrittenOutput === undefined) {
      return Response.json(
        { error: 'rewrittenOutput is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const doc = await Result.create({
      email: email ?? '',
      resumeText: resumeText ?? '',
      jobDescription: jobDescription ?? '',
      industry: industry ?? '',
      rewrittenOutput,
    });

    return Response.json({ success: true, id: doc._id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/results]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/results?email=user@example.com
 * Returns all results for the given email, newest first.
 * If no email is provided, returns the 20 most recent results.
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    await connectDB();

    const filter = email ? { email } : {};
    const results = await Result.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return Response.json({ results });
  } catch (err) {
    console.error('[GET /api/results]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
