// Temporary local data so the UI is browsable before /api/roadmaps exists.
// Swap useRoadmaps() in src/api/roadmaps.js to hit the real endpoint later.

export const mockRoadmaps = [
  {
    id: "react-fundamentals",
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
    id: "node-express-api",
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
    id: "numerical-methods",
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
    id: "git-github",
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
