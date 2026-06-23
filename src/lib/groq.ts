import Groq from "groq-sdk";

// ─── Environment validation ────────────────────────────────────────────────────

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is not defined in .env.local. AI features will fail at runtime.");
} else {
  console.log("GROQ_API_KEY exists.");
}

// ─── Singleton client ──────────────────────────────────────────────────────────

/**
 * A single, reusable Groq client instance.
 *
 * Usage:
 * ```ts
 * import groqClient from "@/lib/groq";
 * const completion = await groqClient.chat.completions.create({ ... });
 * ```
 */
console.log("Groq API initialization...");
const groqClient = new Groq({ apiKey: GROQ_API_KEY || "dummy" });

export default groqClient;

// ─── Model constants ───────────────────────────────────────────────────────────

/** Default model used for resume analysis. Swap here to change globally. */
export const GROQ_MODEL = "llama-3.3-70b-versatile" as const;

/** Maximum tokens allocated for the analysis response. */
export const GROQ_MAX_TOKENS = 4096 as const;
