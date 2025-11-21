import express from "express";
import pkg from "bullmq";
const { Queue, QueueEvents } = pkg;

import { connection } from "../queues/redisClient.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

const taskQueue = new Queue("task-verification-queue", { connection });

const queueEvents = new QueueEvents("task-verification-queue", { connection });
queueEvents.on("completed", ({ jobId }) =>
  console.log(`Job ${jobId} completed`)
);
queueEvents.on("failed", ({ jobId, failedReason }) =>
  console.log(`Job ${jobId} failed: ${failedReason}`)
);

// GET failed jobs
router.get(
  "/failed",
  authenticateToken,
  authorizeRoles("admin", "techlead"),
  async (req, res) => {
    const failed = await taskQueue.getFailed();
    res.status(200).json({ failedCount: failed.length, failed });
  }
);

// GET pending jobs
router.get(
  "/pending",
  authenticateToken,
  authorizeRoles("admin", "techlead"),
  async (req, res) => {
    const waiting = await taskQueue.getWaiting();
    res.status(200).json({ pendingCount: waiting.length, waiting });
  }
);

// GET queue stats
router.get(
  "/stats",
  authenticateToken,
  authorizeRoles("admin", "techlead"),
  async (req, res) => {
    const counts = await taskQueue.getJobCounts();
    res.status(200).json({ counts });
  }
);

export default router;
