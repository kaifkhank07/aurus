import mongoose from "mongoose";

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Database connection error: MONGODB_URI environment variable is not defined."
    );
  }

  // Determine database name based on NODE_ENV
  const isProduction = process.env.NODE_ENV?.trim() === "production";
  const dbName = isProduction
    ? process.env.MONGODB_PRO_DB || "production"
    : process.env.MONGODB_DEV_DB || "development";

  // If already connected, reuse existing connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
    });
    console.log(`[MongoDB] Connected to database: "${dbName}" (${isProduction ? "production" : "development"})`);
    return conn;
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    throw new Error("Unable to connect to the database.");
  }
}

export default connectToDatabase;
