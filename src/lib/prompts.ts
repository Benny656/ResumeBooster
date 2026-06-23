import type { AnalyzeRequest, GroqAnalysisResult } from "@/types/analysis";
import groqClient, { GROQ_MODEL, GROQ_MAX_TOKENS } from "@/lib/groq";

// ─── Prompt Builders ───────────────────────────────────────────────────────────

/**
 * System prompt that instructs the model on its role and the exact JSON
 * contract it must honour.  Keeping this in a dedicated file makes it easy to
 * iterate on prompt engineering without touching route logic.
 */
export const SYSTEM_PROMPT = `You are an expert resume coach and career advisor with deep knowledge of applicant tracking systems (ATS), hiring practices, and industry-specific requirements.

Your task is to analyze a candidate's resume against a specific job description and provide structured, actionable feedback.

You MUST respond with ONLY valid JSON — no markdown, no code fences, no prose outside the JSON object.

The JSON object must conform exactly to this schema:
{
  "score": <integer 0-100, ATS + job-fit match score>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "missingSkills": [<string>, ...],
  "suggestions": [<string>, ...],
  "rewrittenResume": "<full rewritten resume as a single string>"
}

Guidelines:
- score: Holistic match score considering keywords, skills, experience, and formatting.
- strengths: 3-6 specific things the resume does well for this role.
- weaknesses: 3-6 specific gaps or problem areas.
- missingSkills: Concrete skills or tools mentioned in the JD that are absent from the resume.
- suggestions: 4-8 prioritised, actionable improvements the candidate can make immediately.
- rewrittenResume: A polished, ATS-optimised version of the resume tailored to the job description and using the specified template style. Preserve factual accuracy — do NOT invent experience.`;

/**
 * Builds the user-facing prompt that carries the actual resume data.
 */
export function buildUserPrompt({
  resume,
  jobDescription,
  industry,
  template,
}: AnalyzeRequest): string {
  return `
INDUSTRY: ${industry}
TEMPLATE STYLE: ${template}

--- JOB DESCRIPTION ---
${jobDescription.trim()}

--- CANDIDATE RESUME ---
${resume.trim()}

Analyze the resume against the job description and respond with the JSON object described in the system prompt.
`.trim();
}

// ─── Core Analysis Function ────────────────────────────────────────────────────

/**
 * Sends the resume + job description to Groq and returns the parsed analysis.
 *
 * @throws {Error} if the model returns malformed JSON or missing required fields.
 */
export async function analyzeResume(
  request: AnalyzeRequest
): Promise<GroqAnalysisResult> {
  console.log(`Using Groq model: ${GROQ_MODEL}`);
  const completion = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: GROQ_MAX_TOKENS,
    temperature: 0.3, // Lower temperature for more deterministic, structured output
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(request) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("Groq returned an empty response.");
  }

  // ── Parse & validate ──────────────────────────────────────────────────────
  let parsed: unknown;
  try {
    // Strip accidental markdown code fences the model might still add
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Groq response is not valid JSON. Raw: ${raw.slice(0, 200)}`);
  }

  return validateGroqResult(parsed);
}

// ─── Runtime Validation ────────────────────────────────────────────────────────

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((item) => typeof item === "string");
}

/**
 * Validates the parsed Groq payload and narrows its type.
 * Throws a descriptive error if any required field is missing or malformed.
 */
function validateGroqResult(raw: unknown): GroqAnalysisResult {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Groq result is not an object.");
  }

  const obj = raw as Record<string, unknown>;

  const requiredArrayFields = [
    "strengths",
    "weaknesses",
    "missingSkills",
    "suggestions",
  ] as const;

  for (const field of requiredArrayFields) {
    if (!isStringArray(obj[field])) {
      throw new Error(`Groq result has invalid or missing field: "${field}"`);
    }
  }

  if (typeof obj.score !== "number" || obj.score < 0 || obj.score > 100) {
    throw new Error('Groq result "score" must be a number between 0 and 100.');
  }

  if (typeof obj.rewrittenResume !== "string" || !obj.rewrittenResume.trim()) {
    throw new Error('Groq result "rewrittenResume" must be a non-empty string.');
  }

  return {
    score: obj.score,
    strengths: obj.strengths as string[],
    weaknesses: obj.weaknesses as string[],
    missingSkills: obj.missingSkills as string[],
    suggestions: obj.suggestions as string[],
    rewrittenResume: obj.rewrittenResume,
  };
}
