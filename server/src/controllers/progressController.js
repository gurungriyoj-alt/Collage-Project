import Progress from "../models/Progress.js";
import Roadmap from "../models/Roadmap.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/progress/:slug
// Returns { completedStepIds: [...] } for the logged-in user on this roadmap
export const getProgress = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ slug: req.params.slug });
  if (!roadmap) {
    res.status(404);
    throw new Error("Roadmap not found");
  }

  const progress = await Progress.findOne({
    user: req.user._id,
    roadmap: roadmap._id,
  });

  res.json({ completedStepIds: progress?.completedStepIds || [] });
});

// PUT /api/progress/:slug/steps/:stepId
// Toggles one step on/off. Creates the progress doc on first use.
export const toggleStep = asyncHandler(async (req, res) => {
  const { slug, stepId } = req.params;

  const roadmap = await Roadmap.findOne({ slug });
  if (!roadmap) {
    res.status(404);
    throw new Error("Roadmap not found");
  }

  const stepExists = roadmap.steps.some((s) => s._id.toString() === stepId);
  if (!stepExists) {
    res.status(404);
    throw new Error("Step not found on this roadmap");
  }

  let progress = await Progress.findOne({
    user: req.user._id,
    roadmap: roadmap._id,
  });

  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      roadmap: roadmap._id,
      completedStepIds: [stepId],
    });
  } else {
    const alreadyDone = progress.completedStepIds.includes(stepId);
    progress.completedStepIds = alreadyDone
      ? progress.completedStepIds.filter((id) => id !== stepId)
      : [...progress.completedStepIds, stepId];
    await progress.save();
  }

  res.json({ completedStepIds: progress.completedStepIds });
});
