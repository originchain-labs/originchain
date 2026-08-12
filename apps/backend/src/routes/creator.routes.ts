import { Router } from "express";
import { createProfile, getProfile, getPublicProfile, updateProfile, getReputation, getInsights } from "../controllers/creator.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createCreatorSchema, updateCreatorSchema } from "../validators/creator.validator.js";
import { publicRateLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/", requireAuth, validate(createCreatorSchema), createProfile);
router.get("/:id", publicRateLimiter, getPublicProfile);
router.get("/wallet/:walletAddress", getProfile);
router.patch("/:id", requireAuth, validate(updateCreatorSchema), updateProfile);
router.get("/:id/reputation", publicRateLimiter, getReputation);
router.get("/:id/insights", requireAuth, getInsights);

export default router;