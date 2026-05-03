import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { CosmicNav } from "../components/cosmic-nav";
import { MIN_SKELETON_MS } from "../constants/loading";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const BASE_URL = "https://api.giphy.com/v1/gifs";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "gif";
}

interface Gif {
  id: string;
  title: string;
  import_datetime?: string;
  trending_datetime?: string;
  images: {
    fixed_width: {
      url: string;
      width: string;
      height: string;
    };
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stellar Catalogue — The GIF Archive" },
    { name: "description", content: "Browse and search the deep space GIF catalogue." },
  ];
}

export default function Home() {
  type SortOption = "default" | "title-asc" | "title-desc" | "oldest" | "newest";
  type FilterOption = "all" | "titled" | "untitled";

  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [randomizing, setRandomizing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const navigate = useNavigate();

  const getChronologicalTimestamp = (gif: Gif) => {
    const rawDate = gif.import_datetime || gif.trending_datetime;
    if (!rawDate || rawDate.startsWith("0000") || rawDate.startsWith("1970")) return 0;
    const normalized = rawDate.includes("T") ? rawDate : `${rawDate.replace(" ", "T")}Z`;
    const parsed = Date.parse(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const visibleGifs = [...gifs]
    .filter((gif) => {
      if (filterBy === "titled") return Boolean(gif.title?.trim());
      if (filterBy === "untitled") return !gif.title?.trim();
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title-asc") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "title-desc") return (b.title || "").localeCompare(a.title || "");
      if (sortBy === "oldest") return getChronologicalTimestamp(a) - getChronologicalTimestamp(b);
      if (sortBy === "newest") return getChronologicalTimestamp(b) - getChronologicalTimestamp(a);
      return 0;
    });

  const fetchGifs = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    const startedAt = Date.now();
    try {
      const endpoint = searchQuery
        ? `${BASE_URL}/search?api_key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=24&rating=g`
        : `${BASE_URL}/trending?api_key=${API_KEY}&limit=24&rating=g`;

      const res = await fetch(endpoint);
      if (!res.ok) {
        if (res.status === 429) throw new Error("rate_limit");
        throw new Error("fetch_error");
      }
      const data = await res.json();
      setGifs(data.data);
    } catch (err: any) {
      if (err?.message === "rate_limit") {
        setError("Transmission limit reached — the cosmic relay needs a moment. Please try again shortly.");
      } else {
        setError("The archive is temporarily unavailable. Please try again.");
      }
    } finally {
      const remainingTime = Math.max(0, MIN_SKELETON_MS - (Date.now() - startedAt));
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifs("");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    fetchGifs(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("");
    fetchGifs("");
  };

  const handleRandom = async () => {
    setRandomizing(true);
    try {
      const res = await fetch(`${BASE_URL}/random?api_key=${API_KEY}&rating=g`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const gif = data.data;
      const slug = gif.title
        ? gif.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-") || "gif"
        : "gif";
      navigate(`/gif/${slug}/${gif.id}`);
    } catch {
      setRandomizing(false);
    }
  };

  return (
    <div className="starfield starfield-archive min-h-screen flex flex-col">
      <CosmicNav />

      {/* ── Header ── */}
      <header style={{ background: "rgba(4, 0, 16, 0.78)", borderBottom: "1px solid rgba(192,64,255,0.4)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h1
              className="serif text-4xl md:text-5xl font-black tracking-tight"
              style={{ color: "var(--color-parchment-100)" }}
            >
              GIF Catalog
            </h1>
            <p
              className="serif italic mt-1 text-sm"
              style={{ color: "var(--color-parchment-300)" }}
            >
              Query the stellar collection by subject or browse live transmissions
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="archive-search-form flex flex-wrap gap-2 max-w-3xl mx-auto">
            <div className="archive-query-wrap flex-1 relative">
              <span
                className="stamp absolute left-3 top-1/2 -translate-y-1/2 text-xs tracking-widest pointer-events-none"
                style={{ color: "var(--color-sepia-400)" }}
              >
                QUERY:
              </span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. cats, celebration, 1990s..."
                className="w-full pl-20 pr-4 py-3 text-sm font-mono focus:outline-none transition-colors"
                style={{
                  background: "var(--color-ink-800)",
                  border: "1px solid rgba(192,64,255,0.45)",
                  color: "var(--color-parchment-100)",
                }}
              />
            </div>
            <button
              type="submit"
              className="archive-action-btn stamp px-6 py-3 text-xs tracking-widest transition-colors"
              style={{
                background: "var(--color-amber-400)",
                color: "var(--color-parchment-100)",
                border: "1px solid var(--color-amber-300)",
              }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleRandom}
              disabled={randomizing}
              className="archive-action-btn archive-action-btn-random stamp px-4 py-3 text-xs tracking-widest transition-colors flex items-center gap-2"
              style={{
                background: randomizing ? "var(--color-ink-700)" : "rgba(64,216,255,0.12)",
                color: randomizing ? "var(--color-parchment-400)" : "var(--color-sepia-400)",
                border: "1px solid rgba(64,216,255,0.35)",
                cursor: randomizing ? "not-allowed" : "pointer",
              }}
              title="Ask the Magic 8-Ball for a random GIF"
            >
              <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{randomizing ? "🎱" : "🎱"}</span>
              <span>{randomizing ? "Consulting…" : "Magic 8-Ball"}</span>
            </button>
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="archive-action-btn stamp px-4 py-3 text-xs tracking-widest transition-colors"
                style={{
                  background: "var(--color-ink-700)",
                  color: "var(--color-parchment-300)",
                  border: "1px solid var(--color-ink-600)",
                }}
              >
                Clear
              </button>
            )}
          </form>

          <div className="archive-sort-filter max-w-3xl mx-auto mt-3 flex flex-wrap items-center justify-end gap-2">
            <label className="archive-control-label stamp text-xs tracking-widest" style={{ color: "var(--color-sepia-400)" }}>
              Filter:
            </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="archive-control-select stamp text-xs px-2 py-2"
              style={{
                background: "var(--color-ink-800)",
                color: "var(--color-parchment-200)",
                border: "1px solid rgba(64,216,255,0.35)",
              }}
            >
              <option value="all">All</option>
              <option value="titled">Titled</option>
              <option value="untitled">Untitled</option>
            </select>

            <label className="archive-control-label stamp text-xs tracking-widest" style={{ color: "var(--color-sepia-400)" }}>
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="archive-control-select stamp text-xs px-2 py-2"
              style={{
                background: "var(--color-ink-800)",
                color: "var(--color-parchment-200)",
                border: "1px solid rgba(64,216,255,0.35)",
              }}
            >
              <option value="default">Default</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="oldest">Oldest to Newest</option>
              <option value="newest">Newest to Oldest</option>
            </select>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Status bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-y-1 mb-6 px-4 py-2"
          style={{
            background: "var(--color-ink-800)",
            border: "1px solid var(--color-ink-700)",
          }}
        >
          <p className="stamp text-xs tracking-widest" style={{ color: "var(--color-amber-300)" }}>
            {query
              ? `Search Results: "${query}"`
              : "Live Transmissions — Currently Trending"}
          </p>
          {!loading && (
            <p className="stamp text-xs" style={{ color: "var(--color-amber-300)" }}>
              {visibleGifs.length} of {gifs.length} Signals Acquired
            </p>
          )}
        </div>

        {error && (
          <div className="text-center py-10 stamp text-sm" style={{ color: "#c0392b" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="skeleton break-inside-avoid"
                style={{
                  height: `${[160, 200, 140, 220, 180, 160, 240, 180, 200, 160, 220, 190][i % 12]}px`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {visibleGifs.length === 0 ? (
              <p
                className="serif italic text-center py-20"
                style={{ color: "var(--color-parchment-300)" }}
              >
                No transmissions found. Please refine your query.
              </p>
            ) : (
              visibleGifs.map((gif, index) => (
                <Link
                  to={`/gif/${slugify(gif.title)}/${gif.id}`}
                  key={gif.id}
                  className="break-inside-avoid group relative overflow-hidden block"
                  style={{ border: "1px solid var(--color-ink-700)" }}
                >
                  <img
                    src={gif.images.fixed_width.url}
                    alt={gif.title}
                    className="w-full transition-all duration-300 group-hover:opacity-80"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2"
                    style={{ background: "linear-gradient(to top, rgba(14,11,4,0.9) 40%, transparent)" }}
                  >
                    <span
                      className="stamp text-xs self-end px-1.5 py-0.5"
                      style={{
                        background: "var(--color-amber-400)",
                        color: "var(--color-parchment-100)",
                        fontSize: "0.68rem",
                      }}
                    >
                      #{String(index + 1).padStart(4, "0")}
                    </span>
                    <p
                      className="stamp text-xs truncate"
                      style={{ color: "var(--color-parchment-200)", fontSize: "0.74rem" }}
                    >
                      {gif.title || "Untitled Record"}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        className="py-5 stamp text-xs tracking-widest"
        style={{
          color: "var(--color-amber-300)",
          borderTop: "1px solid var(--color-ink-700)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <img src="/YK-logo-white.png" alt="YK Logo" className="yk-logo logo-twinkle" />
          <p className="stamp text-xs" style={{ color: "var(--color-amber-300)", opacity: 0.75 }}>© 2026 YK</p>
          <p>
            The GIF Archive &nbsp;·&nbsp; Powered by{" "}
            <a
              href="https://giphy.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-amber-400)" }}
            >
              Giphy
            </a>{" "}
            &nbsp;·&nbsp; All transmissions public domain
          </p>
        </div>
      </footer>
    </div>
  );
}

