import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { createTask, getTasksForMilestone, completeTask, verifyNextTask, getQueueStatus } from "../controllers/taskController.js";

const router = express.Router();

// Only TechLead can create tasks
router.post(
  "/create/:milestoneId",
  authenticateToken,
  authorizeRoles("techlead"),
  createTask
);

// Anyone in project can view tasks
router.get(
  "/:milestoneId",
  authenticateToken,
  authorizeRoles("admin", "techlead", "teammate"),
  getTasksForMilestone
);

// Teammate marks task completed → queue
router.post(
  "/complete/:taskId",
  authenticateToken,
  authorizeRoles("teammate"),
  completeTask
);

// Tech lead verifies next queued task
router.post(
  "/verify/next",
  authenticateToken,
  authorizeRoles("techlead"),
  verifyNextTask
);

// Tech lead views queue status
router.get(
  "/queue/status",
  authenticateToken,
  authorizeRoles("techlead"),
  getQueueStatus
);

// Get task by ID with details
router.get(
  "/details/:taskId",
  authenticateToken,
  authorizeRoles("admin", "techlead", "teammate"),
  getTaskById
);


export default router;
