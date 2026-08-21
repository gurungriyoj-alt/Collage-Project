// Run with: npm run seed          (loads sample roadmaps)
//           npm run seed:destroy  (wipes the roadmaps collection)
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Roadmap from "../models/Roadmap.js";

// Same content as the frontend's src/data/mockRoadmaps.js,
// reshaped slightly: `id` -> `slug` to match the Roadmap model.
const roadmaps = [
  {
    slug: "react-fundamentals",
    title: "React Fundamentals",
    tagline: "From JSX to shipping your first component library",
    category: "Frontend",
    difficulty: "Beginner",
    steps: [
      { title: "JSX & Components", resource: "React docs: Describing the UI" },
      { title: "State & Props", resource: "useState + prop drilling basics" },
      { title: "Hooks (useEffect, useContext)", resource: "Rules of Hooks" },
      { title: "Routing", resource: "react-router-dom v6" },
      { title: "Talking to an API", resource: "axios + async/await patterns" },
    ],
  },
  {
    slug: "node-express-api",
    title: "Node.js & Express APIs",
    tagline: "Build REST APIs that don't fall over in production",
    category: "Backend",
    difficulty: "Intermediate",
    steps: [
      { title: "HTTP & REST basics", resource: "MDN: HTTP overview" },
      { title: "Express routing & middleware", resource: "Express docs" },
      { title: "MongoDB + Mongoose", resource: "Schema design & validation" },
      { title: "Auth with JWT", resource: "jsonwebtoken + bcrypt" },
      { title: "Error handling & logging", resource: "Centralized error middleware" },
    ],
  },
  {
    slug: "web-development",
    title: "Web Development Fundamentals",
    tagline: "HTML, CSS, and JavaScript — the foundation before you touch a framework",
    category: "Frontend",
    difficulty: "Beginner",
    steps: [
      {
        title: "HTML & CSS Full Course",
        resource: "freeCodeCamp — https://www.youtube.com/watch?v=G3e-cpL7ofc",
      },
      {
        title: "Responsive Design (Flexbox & Grid)",
        resource:
          "Kevin Powell, Learn Flexbox the Easy Way — https://www.youtube.com/watch?v=u044iM9xsWU",
      },
      {
        title: "JavaScript Fundamentals",
        resource:
          "freeCodeCamp, Full Course for Beginners — https://www.youtube.com/watch?v=PkZNo7MFNFg",
      },
      {
        title: "DOM Manipulation & Events",
        resource: "Practice building interactive UI without a framework first",
      },
      {
        title: "Deploying Your First Site",
        resource: "Deploy a static site to Vercel — https://www.youtube.com/watch?v=nbNY3cT0dU0",
      },
    ],
  },
  {
    slug: "numerical-methods",
    title: "Numerical Methods",
    tagline: "Root-finding, interpolation, and linear systems for exams",
    category: "Coursework",
    difficulty: "Beginner",
    steps: [
      { title: "Bisection & Regula Falsi", resource: "Root-finding intro" },
      { title: "Newton-Raphson", resource: "Convergence & iteration" },
      { title: "Newton's Forward Difference", resource: "Interpolation unit" },
      { title: "Gauss Elimination", resource: "Linear systems" },
    ],
  },
  {
    slug: "git-github",
    title: "Git & GitHub Workflows",
    tagline: "Branch, merge, rebase, and stop fearing conflicts",
    category: "Tooling",
    difficulty: "Beginner",
    steps: [
      { title: "Init, add, commit", resource: "Local basics" },
      { title: "Branching & merging", resource: "Feature branch workflow" },
      { title: "Resolving merge conflicts", resource: "Conflict markers explained" },
      { title: "Rebasing", resource: "Rebase vs merge" },
      { title: "SSH keys & remotes", resource: "GitHub SSH setup" },
    ],
  },
];

async function run() {
  await connectDB();

  if (process.argv.includes("--destroy")) {
    await Roadmap.deleteMany();
    console.log("Roadmaps collection cleared.");
  } else {
    await Roadmap.deleteMany(); // avoid duplicate slugs on re-run
    await Roadmap.insertMany(roadmaps);
    console.log(`Seeded ${roadmaps.length} roadmaps.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
