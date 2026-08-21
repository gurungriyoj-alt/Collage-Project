import { Router } from "express";
import { getProgress, toggleStep } from "../controllers/progressController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect); // every route below requires a logged-in user

router.get("/:slug", getProgress);
router.put("/:slug/steps/:stepId", toggleStep);

export default router;
