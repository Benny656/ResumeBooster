import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Document Interface ────────────────────────────────────────────────────────

export interface IResumeAnalysis extends Document {
  userId: string;

  resume: string;
  jobDescription: string;
  industry: string;
  template: string;

  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  rewrittenResume: string;

  createdAt: Date;
}

// ─── Schema ────────────────────────────────────────────────────────────────────

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    userId: {
      type: String,
      required: [true, "userId is required"],
      index: true,
    },

    resume: {
      type: String,
      required: [true, "resume is required"],
    },
    jobDescription: {
      type: String,
      required: [true, "jobDescription is required"],
    },
    industry: {
      type: String,
      required: [true, "industry is required"],
      trim: true,
    },
    template: {
      type: String,
      required: [true, "template is required"],
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    rewrittenResume: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// ─── Hot-reload Guard ──────────────────────────────────────────────────────────
// Next.js dev mode reloads modules repeatedly. Without this guard every reload
// would re-register the model, causing a "Cannot overwrite model" error.

const ResumeAnalysisModel: Model<IResumeAnalysis> =
  (mongoose.models.ResumeAnalysis as Model<IResumeAnalysis>) ??
  mongoose.model<IResumeAnalysis>("ResumeAnalysis", ResumeAnalysisSchema);

export default ResumeAnalysisModel;
