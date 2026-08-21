import { Router } from "express";
import {
  getRoadmaps,
  getRoadmapBySlug,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} from "../controllers/roadmapController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", getRoadmaps);
router.get("/:slug", getRoadmapBySlug);

router.post("/", protect, adminOnly, createRoadmap);
router.put("/:slug", protect, adminOnly, updateRoadmap);
router.delete("/:slug", protect, adminOnly, deleteRoadmap);

export default router;
