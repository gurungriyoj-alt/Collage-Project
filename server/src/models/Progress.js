import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    completedStepIds: {
      // stores the _id strings of completed step subdocuments
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// One progress document per (user, roadmap) pair
progressSchema.index({ user: 1, roadmap: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
