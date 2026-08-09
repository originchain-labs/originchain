import { Router } from "express";
import multer from "multer";
import { prepare, finalize, confirm, getCertificate, list, getOne, verify } from "../controllers/asset.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { finalizeMetadataSchema, confirmAssetSchema } from "../validators/asset.validator.js";


const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB, matching API_SPECIFICATION.md
});

const router = Router();

router.post("/prepare", requireAuth, upload.single("file"), prepare);
router.post("/finalize-metadata", requireAuth, validate(finalizeMetadataSchema), finalize);
router.post("/confirm", requireAuth, validate(confirmAssetSchema), confirm);
router.get("/", list);
router.get("/verify", verify);
router.get("/:id", getOne);
router.get("/:id/certificate", getCertificate);

export default router;