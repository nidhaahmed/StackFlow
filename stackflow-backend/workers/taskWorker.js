import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve path to the real .env in project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
console.log("DB_URI:", process.env.DB_URI);

import mongoose from "mongoose";
import { Worker } from "bullmq";
import { connection } from "../src/queues/redisClient.js";
import Task from "../src/models/Task.js";
import Milestone from "../src/models/Milestone.js";
import Project from "../src/models/Project.js";

await mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const worker = new Worker(
  "task-verification-queue",

  async (job) => {
    console.log(`Processing job ${job.id}...`);

    const { taskId } = job.data;

    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    // Verify task
    task.status = "verified";
    await task.save();

    console.log(`Task ${taskId} verified`);

    // Update milestone progress
    const milestone = await Milestone.findById(task.milestoneId);
    const total = milestone.tasks.length;

    const verified = await Task.countDocuments({
      milestoneId: milestone._id,
      status: "verified",
    });

    milestone.progress = Math.round((verified / total) * 100);
    await milestone.save();

    console.log(
      `Milestone ${milestone._id} progress updated to ${milestone.progress}%`
    );

    // Update project progress
    const project = await Project.findById(milestone.projectId);
    const milestones = await Milestone.find({ projectId: project._id });

    let sum = 0;
    milestones.forEach((m) => (sum += m.progress));
    project.progress = Math.round(sum / milestones.length);
    await project.save();

    console.log(
      `Project ${project._id} progress updated to ${project.progress}%`
    );

    return { taskId };
  },

  { connection, concurrency: 5 } // Process up to 5 jobs concurrently
);

// Worker event listeners
worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} failed:`, err));
