import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { getInviteCode, joinOrganization } from "../controllers/orgController.js";

const router = express.Router();

router.get("/invite", authenticateToken, getInviteCode);
router.post("/join", authenticateToken, joinOrganization);

export default router;
