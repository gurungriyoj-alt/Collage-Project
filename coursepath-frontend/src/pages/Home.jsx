import { useState, useEffect, useMemo } from "react";
import { fetchRoadmaps } from "../api/roadmaps";
import RoadmapCard from "../components/RoadmapCard";

export default function Home() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchRoadmaps();
        if (!cancelled) setRoadmaps(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Couldn't load roadmaps. Is the API running?"
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
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(roadmaps.map((r) => r.category))],
    [roadmaps]
  );

  const filtered = roadmaps.filter((r) => {
    const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || r.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      {/* Hero: a literal winding trail connecting subject waypoints */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-ink px-6 py-20 text-paper">
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-40"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C 200,40 350,160 550,90 S 900,20 1200,80"
            fill="none"
            stroke="#e8a33d"
            strokeWidth="2"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber">
            Pick a path, follow the waypoints
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Curated roadmaps for what you're actually trying to learn.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-paper/70">
            No more fifty open tabs. Each roadmap is an ordered set of
            waypoints — free resources, in the right order, so you always
            know the next step.
          </p>
        </div>
      </section>

      {/* Browse */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roadmaps..."
            className="w-full rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink/40 sm:w-72"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition ${
                  category === c
                    ? "bg-ink text-paper"
                    : "bg-ink/5 text-ink/60 hover:bg-ink/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="py-16 text-center font-mono text-sm text-ink/50">
            Loading roadmaps...
          </p>
        ) : error ? (
          <p className="py-16 text-center text-sm text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-ink/50">
            No roadmaps match that search. Try a different term.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <RoadmapCard key={r._id} roadmap={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}