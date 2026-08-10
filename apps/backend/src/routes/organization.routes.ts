import { Router } from "express";
import { create, get, update } from "../controllers/organization.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, create);
router.get("/:id", get);
router.patch("/:id", requireAuth, update);

export default router;
