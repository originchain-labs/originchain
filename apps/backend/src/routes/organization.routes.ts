import { Router } from "express";
import { create, get, getMine, update } from "../controllers/organization.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { publicRateLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/", requireAuth, create);
router.get("/mine", requireAuth, getMine);
router.get("/:id", publicRateLimiter, get);
router.patch("/:id", requireAuth, update);

export default router;
