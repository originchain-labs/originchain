import { Router } from "express";
import { getNonce, verify } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { nonceRequestSchema, verifyRequestSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/nonce", validate(nonceRequestSchema), getNonce);
router.post("/verify", validate(verifyRequestSchema), verify);

export default router;