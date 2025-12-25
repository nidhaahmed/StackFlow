import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import {
  createTask,
  getTasksForMilestone,
  completeTask,
  getTaskById,
  verifyTask,
  unverifyTask,
  undoCompleteTask,
  deleteTask,
} from "../controllers/taskController.js";
import { checkOrgAccess } from "../middlewares/checkOrgAccess.js";
import Task from "../models/Task.js";

const router = express.Router();

// Only TechLead can create tasks
router.post(
  "/create/:milestoneId",
  authenticateToken,
  authorizeRoles("techlead"),
  createTask
);

// Anyone in project can view tasks for a milestone
router.get(
  "/:milestoneId",
  authenticateToken,
  authorizeRoles("admin", "techlead", "teammate"),
  getTasksForMilestone
);

// Teammate marks task completed and enters redis queue
router.post(
  "/complete/:taskId",
  authenticateToken,
  authorizeRoles("teammate"),
  checkOrgAccess(Task),
  completeTask
);

// Techlead verifies task
router.post(
  "/verify/:taskId",
  authenticateToken,
  authorizeRoles("techlead"),
  verifyTask
);

// Techlead unverifies task
router.post(
  "/unverify/:taskId",
  authenticateToken,
  authorizeRoles("techlead"),
  unverifyTask
);

// Teammate undoes completed task
router.post(
  "/undo-complete/:taskId",
  authenticateToken,
  authorizeRoles("teammate"),
  undoCompleteTask
);

// Get task by ID with details
router.get(
  "/details/:taskId",
  authenticateToken,
  authorizeRoles("admin", "techlead", "teammate"),
  checkOrgAccess(Task),
  getTaskById
);

router.delete("/tasks/:taskId", authenticateToken, authorizeRoles("techlead", "admin"), checkOrgAccess(Task), deleteTask);


export default router;
