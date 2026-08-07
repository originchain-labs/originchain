import { Router } from "express";
import { createProfile, getProfile } from "../controllers/creator.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createCreatorSchema } from "../validators/creator.validator.js";

const router = Router();

router.post("/", requireAuth, validate(createCreatorSchema), createProfile);
router.get("/:walletAddress", getProfile);

export default router;