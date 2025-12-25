import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import {
  getInviteCode,
  joinOrganization,
} from "../controllers/orgController.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/invite", authenticateToken, getInviteCode);
router.post("/join", authenticateToken, joinOrganization);
// router.get("/me", authenticateToken, async (req, res) => {
//   try {
//     if (!req.user.orgId) {
//       return res.status(404).json({ message: "User not in any organization" });
//     }

//     const org = await Organization.findById(req.user.orgId);

//     if (!org) {
//       return res.status(404).json({ message: "Organization not found" });
//     }

//     res.status(200).json({ org });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
router.get("/me", authenticateToken, async (req, res) => {
  try {
    if (!req.user.orgId) {
      return res.status(404).json({ message: "User not in any organization" });
    }

    const org = await Organization.findById(req.user.orgId).populate(
      "members",
      "name email role"
    );

    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    res.status(200).json({ org });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Only admin can remove users
router.post(
  "/remove-user",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const org = await Organization.findById(user.orgId);
      if (!org) return res.status(404).json({ message: "Org not found" });

      org.members = org.members.filter((m) => m.toString() !== userId);
      await org.save();

      user.orgId = null;
      await user.save();

      res.json({ message: "User removed" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

export default router;
