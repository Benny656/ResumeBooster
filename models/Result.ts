import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResult extends Document {
  email: string;
  resumeText: string;
  jobDescription: string;
  industry: string;
  rewrittenOutput: string;
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  email: { type: String, index: true },
  resumeText: { type: String },
  jobDescription: { type: String },
  industry: { type: String },
  rewrittenOutput: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model re-compilation during Next.js hot reloads
export const Result: Model<IResult> =
  (mongoose.models.Result as Model<IResult>) ||
  mongoose.model<IResult>('Result', ResultSchema);
