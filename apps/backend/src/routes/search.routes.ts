import { Router } from "express";
import { search } from "../controllers/search.controller.js";
import { publicRateLimiter } from "../middleware/rateLimit.js";

const router = Router();
router.get("/", publicRateLimiter, search);
export default router;