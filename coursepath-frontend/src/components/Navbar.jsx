import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            CoursePath
          </span>
        </Link>

        <div className="flex items-center gap-6 font-body text-sm">
          <Link to="/" className="text-ink/70 transition hover:text-ink">
            Roadmaps
          </Link>

          {isAuthenticated ? (
            <>
              <span className="hidden font-mono text-xs text-ink/50 sm:inline">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-ink/20 px-4 py-1.5 text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink/70 transition hover:text-ink">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-ink px-4 py-1.5 text-paper transition hover:bg-ink-soft"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
