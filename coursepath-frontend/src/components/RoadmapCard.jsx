import { Link } from "react-router-dom";

const difficultyColor = {
  Beginner: "text-teal bg-teal-soft",
  Intermediate: "text-amber-dark bg-amber/15",
  Advanced: "text-ink bg-ink/10",
};

export default function RoadmapCard({ roadmap }) {
  return (
    <Link
      to={`/roadmap/${roadmap.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-white/60 p-6 transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lg hover:shadow-ink/5"
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-ink/40">
            {roadmap.category}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
              difficultyColor[roadmap.difficulty] || "bg-ink/10 text-ink/60"
            }`}
          >
            {roadmap.difficulty}
          </span>
        </div>

        <h3 className="font-display text-xl font-semibold text-ink">
          {roadmap.title}
        </h3>
        <p className="mt-1.5 text-sm text-ink/60">{roadmap.tagline}</p>
      </div>

      {/* waypoint trail preview */}
      <div className="mt-6 flex items-center gap-1">
        {roadmap.steps.slice(0, 5).map((_, i) => (
          <span key={i} className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            {i < Math.min(roadmap.steps.length, 5) - 1 && (
              <span className="h-px w-4 bg-ink/15" />
            )}
          </span>
        ))}
        <span className="ml-2 font-mono text-[11px] text-ink/40">
          {roadmap.steps.length} waypoints
        </span>
      </div>
    </Link>
  );
}