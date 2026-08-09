import { Router } from "express";
import { submit } from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { submitReviewSchema } from "../validators/review.validator.js";

const router = Router();
router.post("/", requireAuth, validate(submitReviewSchema), submit);
export default router;