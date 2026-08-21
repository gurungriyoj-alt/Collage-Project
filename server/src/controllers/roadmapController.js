import Roadmap from "../models/Roadmap.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/roadmaps
// Optional query params: ?category=Frontend&search=react
export const getRoadmaps = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category && category !== "All") filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };

  const roadmaps = await Roadmap.find(filter).sort({ createdAt: -1 });
  res.json(roadmaps);
});

// GET /api/roadmaps/:slug
export const getRoadmapBySlug = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ slug: req.params.slug });
  if (!roadmap) {
    res.status(404);
    throw new Error("Roadmap not found");
  }
  res.json(roadmap);
});

// POST /api/roadmaps  (admin only)
export const createRoadmap = asyncHandler(async (req, res) => {
  const { slug, title, tagline, category, difficulty, steps } = req.body;

  const roadmap = await Roadmap.create({
    slug,
    title,
    tagline,
    category,
    difficulty,
    steps,
    createdBy: req.user._id,
  });

  res.status(201).json(roadmap);
});

// PUT /api/roadmaps/:slug  (admin only)
export const updateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ slug: req.params.slug });
  if (!roadmap) {
    res.status(404);
    throw new Error("Roadmap not found");
  }

  const editableFields = [
    "title",
    "tagline",
    "category",
    "difficulty",
    "steps",
  ];
  for (const field of editableFields) {
    if (req.body[field] !== undefined) roadmap[field] = req.body[field];
  }

  const updated = await roadmap.save();
  res.json(updated);
});

// DELETE /api/roadmaps/:slug  (admin only)
export const deleteRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOneAndDelete({ slug: req.params.slug });
  if (!roadmap) {
    res.status(404);
    throw new Error("Roadmap not found");
  }
  res.json({ message: "Roadmap deleted" });
});
