import { Router } from "express";
import { getHealth, getContracts } from "../controllers/ops.controller.js";
import { publicRateLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/health", publicRateLimiter, getHealth);
router.get("/contracts", publicRateLimiter, getContracts);

export default router;
