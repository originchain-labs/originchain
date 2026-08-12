import { Router } from "express";
import multer from "multer";
import { prepare, finalize, confirm, getCertificate, list, getOne, verify } from "../controllers/asset.controller.js";
import { listForAsset } from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { finalizeMetadataSchema, confirmAssetSchema } from "../validators/asset.validator.js";
import { aiRateLimiter, publicRateLimiter } from "../middleware/rateLimit.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB, matching API_SPECIFICATION.md
});

const router = Router();

router.post("/prepare", requireAuth, aiRateLimiter, upload.single("file"), prepare);
router.post("/finalize-metadata", requireAuth, validate(finalizeMetadataSchema), finalize);
router.post("/confirm", requireAuth, validate(confirmAssetSchema), confirm);
router.get("/", publicRateLimiter, list);
router.get("/verify", publicRateLimiter, verify);
router.get("/:id", publicRateLimiter, getOne);
router.get("/:id/reviews", publicRateLimiter, listForAsset);
router.get("/:id/certificate", publicRateLimiter, getCertificate);

export default router;