import { Router } from "express";
import { submit } from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { submitReviewSchema } from "../validators/review.validator.js";
import { reviewRateLimiter } from "../middleware/rateLimit.js";

const router = Router();
router.post("/", requireAuth, reviewRateLimiter, validate(submitReviewSchema), submit);
export default router;