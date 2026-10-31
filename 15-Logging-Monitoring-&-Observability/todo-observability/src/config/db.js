import mongoose from "mongoose";
import { logger } from "./logger.js";

export async function connectDb() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/todos";
  logger.info("Connecting to database");
  await mongoose.connect(uri);
  logger.info("Database connected");
}
