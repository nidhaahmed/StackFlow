import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { createMilestone, getMilestonesForProject, getMilestoneById } from "../controllers/milestoneController.js";

const router = express.Router();

// Admin + TechLead can create milestones
router.post(
  "/create/:projectId",
  authenticateToken,
  authorizeRoles("admin", "techlead"),
  createMilestone
);

// View milestones for a project
router.get(
  "/:projectId",
  authenticateToken,
  authorizeRoles("admin", "techlead", "teammate"),
  getMilestonesForProject
);

// Get milestone by ID with tasks
router.get(
  "/details/:milestoneId",
  authenticateToken,
  authorizeRoles("admin", "techlead", "teammate"),
  getMilestoneById
);

export default router;
