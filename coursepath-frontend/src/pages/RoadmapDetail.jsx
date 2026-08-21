import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchRoadmap, fetchProgress, toggleStepProgress } from "../api/roadmaps";
import { useAuth } from "../context/AuthContext";

// Resource strings sometimes contain a trailing URL, e.g.
// "freeCodeCamp — https://youtube.com/...". Split it out so it renders
// as an actual link instead of plain text.
function ResourceLine({ resource }) {
  const match = resource.match(/(https?:\/\/\S+)/);
  if (!match) return <>{resource}</>;

  const url = match[0];
  const label = resource.slice(0, match.index).trim().replace(/[—-]\s*$/, "");

  return (
    <>
      {label && `${label} — `}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-amber-dark underline underline-offset-2 hover:text-ink"
      >
        {url}
      </a>
    </>
  );
}

export default function RoadmapDetail() {
  const { id: slug } = useParams(); // route param is still named :id, but holds the slug
  const { isAuthenticated } = useAuth();

  const [roadmap, setRoadmap] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingStepId, setPendingStepId] = useState(null); // disables the button mid-request

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const roadmapData = await fetchRoadmap(slug);
        if (cancelled) return;
        setRoadmap(roadmapData);

        if (isAuthenticated) {
          const completedIds = await fetchProgress(slug);
          if (!cancelled) setCompleted(new Set(completedIds));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? "Roadmap not found"
              : err.response?.data?.message || "Couldn't load this roadmap."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, isAuthenticated]);

  async function toggleStep(stepId) {
    if (!isAuthenticated || pendingStepId) return;

    // optimistic update so the checkmark feels instant
    setPendingStepId(stepId);
    const wasDone = completed.has(stepId);
    setCompleted((prev) => {
      const next = new Set(prev);
      wasDone ? next.delete(stepId) : next.add(stepId);
      return next;
    });

    try {
      const completedIds = await toggleStepProgress(slug, stepId);
      setCompleted(new Set(completedIds));
    } catch (err) {
      // roll back on failure
      setCompleted((prev) => {
        const next = new Set(prev);
        wasDone ? next.add(stepId) : next.delete(stepId);
        return next;
      });
    } finally {
      setPendingStepId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-sm text-ink/50">Loading...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-display text-2xl text-ink">
          {error || "Roadmap not found"}
        </p>
        <Link to="/" className="mt-4 inline-block text-sm text-amber-dark underline">
          Back to all roadmaps
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <Link to="/" className="font-mono text-xs text-ink/50 hover:text-ink">
        &larr; All roadmaps
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {roadmap.title}
      </h1>
      <p className="mt-2 text-ink/60">{roadmap.tagline}</p>

      {!isAuthenticated && (
        <div className="mt-6 rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-ink/70">
          <Link to="/login" className="font-medium text-amber-dark underline">
            Log in
          </Link>{" "}
          to track your progress on this roadmap.
        </div>
      )}

      {/* Vertical trail of waypoints */}
      <ol className="relative mt-10 border-l border-ink/15 pl-8">
        {roadmap.steps.map((step, i) => {
          const done = completed.has(step._id);
          const disabled = !isAuthenticated || pendingStepId === step._id;

          return (
            <li key={step._id} className="relative pb-10 last:pb-0">
              <button
                onClick={() => toggleStep(step._id)}
                disabled={disabled}
                className={`absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 font-mono text-[10px] transition ${
                  done
                    ? "border-teal bg-teal text-white"
                    : "border-ink/25 bg-paper text-ink/40"
                } ${isAuthenticated ? "cursor-pointer hover:border-ink/50" : "cursor-default"} ${
                  pendingStepId === step._id ? "opacity-50" : ""
                }`}
              >
                {done ? "✓" : i + 1}
              </button>

              <h3
                className={`font-display text-lg font-medium ${
                  done ? "text-ink/40 line-through" : "text-ink"
                }`}
              >
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-ink/55">
                <ResourceLine resource={step.resource} />
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}