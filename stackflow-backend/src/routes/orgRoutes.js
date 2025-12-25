import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { getInviteCode, joinOrganization } from "../controllers/orgController.js";
import Organization from "../models/Organization.js";

const router = express.Router();

router.get("/invite", authenticateToken, getInviteCode);
router.post("/join", authenticateToken, joinOrganization);
router.get("/me", authenticateToken, async (req, res) => {
  try {
    if (!req.user.orgId) {
      return res.status(404).json({ message: "User not in any organization" });
    }

    const org = await Organization.findById(req.user.orgId);

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ org });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
