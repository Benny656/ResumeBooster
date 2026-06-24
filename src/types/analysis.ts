// ─── Domain Types ─────────────────────────────────────────────────────────────

/** Persisted document shape (mirrors the Mongoose schema). */
export interface ResumeAnalysis {
  _id?: string;
  userId: string;

  resume: string;
  jobDescription: string;
  industry: string;
  template: string;

  score: number;
  totalScore?: number;
  keywordScore?: number;
  skillsScore?: number;
  experienceScore?: number;
  structureScore?: number;

  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  requiredMissingSkills?: string[];
  preferredMissingSkills?: string[];
  suggestions: string[];
  rewrittenResume: string;

  modelUsed?: string;
  promptVersion?: string;

  createdAt: Date;
}

// ─── API Contracts ─────────────────────────────────────────────────────────────

/** Body accepted by POST /api/analyze */
export interface AnalyzeRequest {
  resume: string;
  jobDescription: string;
  industry: string;
  template: string;
}

/** Body returned by POST /api/analyze */
export interface AnalyzeResponse {
  score: number;
  totalScore?: number;
  keywordScore?: number;
  skillsScore?: number;
  experienceScore?: number;
  structureScore?: number;

  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  requiredMissingSkills?: string[];
  preferredMissingSkills?: string[];
  suggestions: string[];
  rewrittenResume: string;
}

// ─── Groq / AI Internals ───────────────────────────────────────────────────────

/**
 * The raw JSON structure that the Groq model must return.
 * Validated at runtime before being persisted or returned to the client.
 */
export interface GroqAnalysisResult {
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  structureScore: number;

  strengths: string[];
  weaknesses: string[];
  requiredMissingSkills: string[];
  preferredMissingSkills: string[];
  suggestions: string[];
  rewrittenResume: string;
}

// ─── Shared Error Shape ────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  details?: string;
}
