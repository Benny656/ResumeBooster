import mongoose from "mongoose";

// ─── Environment validation ────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
} else {
  console.log("MONGODB_URI exists.");
}

// ─── Connection cache ──────────────────────────────────────────────────────────
// The cached object is stored on the Node.js global so it survives hot reloads
// in Next.js development mode.  In production a new Lambda/Edge instance starts
// fresh, so the cache simply holds the single connection for that instance.

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.__mongooseCache ?? {
  conn: null,
  promise: null,
};

global.__mongooseCache = cached;

// ─── Connect helper ────────────────────────────────────────────────────────────

/**
 * Returns a cached Mongoose connection, creating one if needed.
 *
 * Usage inside any API route or server action:
 * ```ts
 * import connectDB from "@/lib/mongodb";
 * await connectDB();
 * ```
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log("MongoDB connection: using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("MongoDB connection: attempting new connection...");
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connection: success");
  } catch (err) {
    console.log("MongoDB connection: failed", err);
    // Reset so the next call retries the connection
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDB;
