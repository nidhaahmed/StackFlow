import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
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
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
