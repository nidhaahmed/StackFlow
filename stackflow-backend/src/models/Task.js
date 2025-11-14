import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Teammate
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "verified"],
      default: "pending",
    },
    verificationQueue: {
      type: Boolean,
      default: false, // true if waiting for Tech Lead verification
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
