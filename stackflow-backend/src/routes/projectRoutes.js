import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { createProject, getAllProjects, getProjectById } from "../controllers/projectController.js";
import { checkOrgAccess } from "../middlewares/checkOrgAccess.js";
import Project from "../models/Project.js";

const router = express.Router();

// Admin only route
router.post(
  "/create",
  authenticateToken,
  authorizeRoles("admin"),
  createProject
);

// Techlead or Admin can verify tasks
router.post(
  "/verify",
  authenticateToken,
  authorizeRoles("admin", "techlead"),
  (req, res) => {
    res.json({ message: "Task verified successfully!" });
  }
);

// All roles (including teammate) can view tasks
router.get(
  "/tasks",
  authenticateToken,
  authorizeRoles("admin", "techlead", "teammate"),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.role}! Here are your tasks.` });
  }
);

// Get project by ID with milestones and tasks
router.get(
  "/details/:projectId",
  authenticateToken,
  authorizeRoles("admin", "techlead", "teammate"),
  checkOrgAccess(Project),
  getProjectById
);

router.get("/", authenticateToken, getAllProjects);

export default router;
