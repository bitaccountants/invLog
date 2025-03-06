import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "your-mongodb-connection-string-here";

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI is missing from environment variables.");
}

// Cached connection to avoid reconnecting in every request (for Next.js API routes)
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "paylog",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully!");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
