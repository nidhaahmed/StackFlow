// src/routes/authRoutes.js
import express from "express";
import { register, loginUser, logoutUser, refreshAccessToken } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// GET 
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully 🚀",
    user: req.user,
  });
});

router.get("/projects", authenticateToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.role}!`,
    data: "Here are your projects",
  });
});

router.get("/refresh", refreshAccessToken);

export default router;