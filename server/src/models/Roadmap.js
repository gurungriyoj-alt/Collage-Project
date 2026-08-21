import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  resource: { type: String, required: true },
});
// Every step subdocument gets its own stable _id automatically —
// use that (not array index) as the identifier once this is wired
// up to the frontend, so reordering steps doesn't break progress.

const roadmapSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // e.g. "web-development" — matches the old mockRoadmaps `id` field
      // and is what the frontend route /roadmap/:id will look up by
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    steps: {
      type: [stepSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "A roadmap needs at least one step",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", roadmapSchema);
