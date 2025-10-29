// src/routes/authRoutes.js
import express from "express";
import { register, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);
router.post("/login", loginUser);

// GET 
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully 🚀",
    user: req.user,
  });
});

export default router;