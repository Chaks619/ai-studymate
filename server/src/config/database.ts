import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
};