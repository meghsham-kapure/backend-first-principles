import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Todo = mongoose.model("Todo", todoSchema);
