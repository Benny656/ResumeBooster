import type { AnalyzeRequest, GroqAnalysisResult } from "@/lib/ai/analysis";
import groqClient from "@/lib/ai/groq";
import { GROQ_MODEL, GROQ_MAX_TOKENS } from "@/config/ai";

// ─── Prompt Builders ───────────────────────────────────────────────────────────

/**
 * System prompt that instructs the model on its role and the exact JSON
 * contract it must honour.  Keeping this in a dedicated file makes it easy to
 * iterate on prompt engineering without touching route logic.
 */
export const SYSTEM_PROMPT = `You are a Senior Recruiter, ATS Specialist, and Hiring Manager with deep expertise in talent acquisition.

Responsibilities:
* ATS analysis
* Keyword matching
* Skills matching
* Experience evaluation
* Resume quality evaluation

Rules:
* Never fabricate information.
* Never create fake experience.
* Never create fake certifications.
* Never create fake companies.
* Preserve factual accuracy.
* Return structured JSON only.

Your task is to critically evaluate a candidate's resume against a job description.

You MUST respond with ONLY valid JSON — no markdown, no code fences, no prose outside the JSON object.

The JSON object must conform exactly to this schema:
{
  "keywordScore": <integer 0-40>,
  "skillsScore": <integer 0-25>,
  "experienceScore": <integer 0-20>,
  "structureScore": <integer 0-15>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "requiredMissingSkills": [<string>, ...],
  "preferredMissingSkills": [<string>, ...],
  "suggestions": [<string>, ...],
  "rewrittenResume": "<full rewritten resume as a single string>"
}

EVALUATION CRITERIA:
Evaluate ATS Compatibility, Keyword Alignment, Skill Match, Experience Relevance, Resume Structure, Industry Relevance, Missing Requirements, and Overall Competitiveness.

SCORING RULES (Strict Weighted Scoring):
- keywordScore (Max 40): Based on exact and semantic keyword alignment with the job description.
- skillsScore (Max 25): Based on presence and context of required/preferred skills.
- experienceScore (Max 20): Based on years of experience, relevance, and level of responsibility.
- structureScore (Max 15): Based on readability, formatting, and ATS-friendly layout.

ANALYSIS RULES:
- strengths: Must be highly specific (e.g., "Strong Next.js project experience aligned with frontend development roles", NOT "Good experience").
- weaknesses: Must be actionable (e.g., "Resume does not demonstrate Docker experience required by the job description", NOT "Missing skills").
- requiredMissingSkills: Critical skills mentioned in the job description but absent from the resume.
- preferredMissingSkills: "Nice to have" skills mentioned but absent.
- suggestions: Provide highly practical improvements (e.g., "Add quantified achievements", "Include measurable project outcomes", "Add technologies mentioned in the job description").

TEMPLATE-AWARE REWRITING:
Adapt your analysis and rewrite focus based on the requested template:
- Student Template: Focus on Education, Academic Projects, Certifications, Skills, Internships.
- Professional Template: Focus on Work Experience, Achievements, Career Progression, Skills.
- Tech Template: Focus on Technical Skills, Projects, Technologies, GitHub, Engineering Impact.
- Modern Template: Focus on Personal Brand, Portfolio, Creative Work, Design Presentation.
- Executive Template: Focus on Leadership, Business Impact, Team Management, Strategy, Revenue Impact.`;

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
    // Analysis uses low temperature (0.3) to ensure deterministic, consistent, and logical scoring without hallucination
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(request) },
    ],
    // JSON mode is used to guarantee valid JSON output from the model, preventing parsing failures
    response_format: { type: "json_object" },
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
    "requiredMissingSkills",
    "preferredMissingSkills",
    "suggestions",
  ] as const;

  for (const field of requiredArrayFields) {
    if (!isStringArray(obj[field])) {
      throw new Error(`Groq result has invalid or missing field: "${field}"`);
    }
  }

  if (typeof obj.keywordScore !== "number" || obj.keywordScore < 0 || obj.keywordScore > 40) {
    throw new Error('Groq result "keywordScore" must be a number between 0 and 40.');
  }
  if (typeof obj.skillsScore !== "number" || obj.skillsScore < 0 || obj.skillsScore > 25) {
    throw new Error('Groq result "skillsScore" must be a number between 0 and 25.');
  }
  if (typeof obj.experienceScore !== "number" || obj.experienceScore < 0 || obj.experienceScore > 20) {
    throw new Error('Groq result "experienceScore" must be a number between 0 and 20.');
  }
  if (typeof obj.structureScore !== "number" || obj.structureScore < 0 || obj.structureScore > 15) {
    throw new Error('Groq result "structureScore" must be a number between 0 and 15.');
  }

  if (typeof obj.rewrittenResume !== "string" || !obj.rewrittenResume.trim()) {
    throw new Error('Groq result "rewrittenResume" must be a non-empty string.');
  }

  return {
    keywordScore: obj.keywordScore,
    skillsScore: obj.skillsScore,
    experienceScore: obj.experienceScore,
    structureScore: obj.structureScore,
    strengths: obj.strengths as string[],
    weaknesses: obj.weaknesses as string[],
    requiredMissingSkills: obj.requiredMissingSkills as string[],
    preferredMissingSkills: obj.preferredMissingSkills as string[],
    suggestions: obj.suggestions as string[],
    rewrittenResume: obj.rewrittenResume,
  };
}
