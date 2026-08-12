import { Router } from "express";
import { adminAnalytics } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.get("/analytics", requireAuth, requireAdmin, adminAnalytics);

export default router;
