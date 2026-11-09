import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.dbUrl, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error("[MongoDB Connection Error]:", error);
    // Keep app alive in dev or retry
    if (config.nodeEnv === "production") {
      process.exit(1);
    }
  }
};

