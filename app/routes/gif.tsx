import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import type { Route } from "./+types/gif";
import { CosmicNav } from "../components/cosmic-nav";
import { MIN_SKELETON_MS } from "../constants/loading";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

interface GifDetail {
  id: string;
  title: string;
  rating: string;
  import_datetime: string;
  trending_datetime: string;
  source: string;
  source_tld: string;
  source_post_url: string;
  username: string;
  url: string;
  user?: {
    display_name: string;
    description: string;
    avatar_url: string;
    profile_url: string;
    website_url: string;
    instagram_url: string;
    twitter: string;
    is_verified: boolean;
  };
  images: {
    original: { url: string; width: string; height: string };
    fixed_width: { url: string };
  };
}

export function meta({ params }: Route.MetaArgs) {
  return [{ title: "Stellar Record — The GIF Archive" }];
}

function formatDate(dateStr: string) {
  if (!dateStr || dateStr === "0000-00-00 00:00:00") return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function ratingLabel(rating: string) {
  const map: Record<string, string> = {
    g: "G — General Audiences",
    pg: "PG — Parental Guidance",
    "pg-13": "PG-13 — Parents Strongly Cautioned",
    r: "R — Restricted",
  };
  return map[rating?.toLowerCase()] ?? rating?.toUpperCase();
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="px-4 py-3"
      style={{
        background: "var(--color-ink-800)",
        border: "1px solid var(--color-ink-700)",
      }}
    >
      <dt
        className="stamp text-xs tracking-widest mb-1"
        style={{ color: "var(--color-amber-300)" }}
      >
        {label}
      </dt>
      <dd className="text-sm font-mono" style={{ color: "var(--color-parchment-200)" }}>
        {value}
      </dd>
    </div>
  );
}

export default function GifPage() {
  const { id } = useParams<{ title: string; id: string }>();
  const [gif, setGif] = useState<GifDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!gif) return;
    navigator.clipboard.writeText(gif.images.original.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    const fetchGif = async () => {
      setLoading(true);
      setError(null);
      const startedAt = Date.now();
      try {
        const res = await fetch(
          `https://api.giphy.com/v1/gifs/${id}?api_key=${API_KEY}`
        );
        if (!res.ok) throw new Error("GIF not found");
        const data = await res.json();
        setGif(data.data);
      } catch {
        setError("This record could not be retrieved from the archive.");
      } finally {
        const remainingTime = Math.max(0, MIN_SKELETON_MS - (Date.now() - startedAt));
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
        setLoading(false);
      }
    };
    if (id) fetchGif();
  }, [id]);

  if (loading) {
    return (
      <div className="starfield starfield-detail min-h-screen flex flex-col">
        <CosmicNav />

        {/* Skeleton header bar */}
        <header style={{ background: "rgba(4, 0, 16, 0.78)", borderBottom: "1px solid var(--color-amber-600)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
            <div className="skeleton h-4 w-32 rounded-none" />
            <div className="skeleton h-6 w-24 rounded-none" />
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          {/* Record header skeleton */}
          <div
            className="mb-6 sm:mb-8 px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-3"
            style={{
              border: "1px solid var(--color-amber-600)",
              boxShadow: "inset 0 0 0 4px var(--color-ink-900), inset 0 0 0 5px var(--color-amber-600)",
              background: "var(--color-ink-800)",
            }}
          >
            <div className="skeleton h-3 w-48 rounded-none" />
            <div className="skeleton h-8 w-3/4 rounded-none" />
            <div className="skeleton h-3 w-36 rounded-none" />
          </div>

          {/* Two-column layout skeleton */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left: image + buttons */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div
                className="skeleton w-full"
                style={{
                  width: "100%",
                  maxWidth: "32rem",
                  height: "280px",
                  border: "1px solid var(--color-amber-600)",
                  boxShadow: "4px 4px 0 var(--color-ink-950)",
                }}
              />
              <div className="skeleton w-full max-w-sm md:max-w-lg h-9 rounded-none" />
              <div className="skeleton w-full max-w-sm md:max-w-lg h-9 rounded-none" />
            </div>

            {/* Right: dossier fields */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Transmission log skeleton */}
              <div className="flex flex-col gap-4">
                <div className="skeleton h-3 w-40 rounded-none" />
                <div className="flex flex-col gap-4 pl-6" style={{ borderLeft: "2px solid var(--color-ink-700)" }}>
                  {[1, 2].map((n) => (
                    <div key={n} className="flex flex-col gap-2">
                      <div className="skeleton h-2.5 w-28 rounded-none" />
                      <div className="skeleton h-4 w-48 rounded-none" />
                      <div className="skeleton h-2.5 w-64 rounded-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Classification fields skeleton */}
              <div className="flex flex-col gap-4">
                <div className="skeleton h-3 w-44 rounded-none" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="px-4 py-3 flex flex-col gap-2"
                      style={{ background: "var(--color-ink-800)", border: "1px solid var(--color-ink-700)" }}
                    >
                      <div className="skeleton h-2.5 w-20 rounded-none" />
                      <div className="skeleton h-4 w-36 rounded-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !gif) {
    return (
      <div
        className="starfield starfield-detail min-h-screen flex flex-col items-center justify-center gap-4"
      >
        <CosmicNav />
        <p className="stamp text-sm tracking-widest" style={{ color: "#c0392b" }}>
          {error ?? "Record not found."}
        </p>
        <Link
          to="/archive"
          className="stamp text-xs tracking-widest transition-colors"
          style={{ color: "var(--color-sepia-400)" }}
        >
          ← Stellar Catalogue
        </Link>
      </div>
    );
  }

  const importedDate = formatDate(gif.import_datetime);
  const trendingDate = formatDate(gif.trending_datetime);

  return (
    <div className="starfield starfield-detail min-h-screen flex flex-col">
      <CosmicNav />

      {/* ── Header ── */}
      <header
        style={{
          background: "rgba(4, 0, 16, 0.78)",
          borderBottom: "1px solid var(--color-amber-600)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <Link to="/archive" className="stamp text-xs tracking-widest transition-colors hover:opacity-80" style={{ color: "var(--color-sepia-400)" }}>
              ← Stellar Catalogue
            </Link>
            <span
              className="stamp text-xs tracking-widest px-3 py-1"
              style={{
                background: "var(--color-amber-400)",
                color: "var(--color-parchment-100)",
              }}
            >
              Stellar Record
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Record Header ── */}
        <div
          className="mb-6 sm:mb-8 px-4 sm:px-6 py-4 sm:py-6"
          style={{
            border: "1px solid var(--color-amber-600)",
            boxShadow: "inset 0 0 0 4px var(--color-ink-900), inset 0 0 0 5px var(--color-amber-600)",
            background: "var(--color-ink-800)",
          }}
        >
          <p
            className="stamp text-xs tracking-widest mb-2"
            style={{ color: "var(--color-amber-300)" }}
          >
            Record ID: {gif.id}
          </p>
          <h1
            className="serif text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-2"
            style={{ color: "var(--color-parchment-100)" }}
          >
            {gif.title || "Untitled Record"}
          </h1>
          {gif.username && (
            <p className="stamp text-xs tracking-widest" style={{ color: "var(--color-parchment-300)" }}>
              Submitted by: @{gif.username}
            </p>
          )}
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* Left: Image exhibit */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div
              className="overflow-hidden"
              style={{
                border: "1px solid var(--color-amber-600)",
                boxShadow: "4px 4px 0 var(--color-ink-950)",
              }}
            >
              <img
                src={gif.images.original.url}
                alt={gif.title}
                className="w-full max-w-sm md:max-w-lg block"
              />
            </div>

            {/* Exhibit label */}
            <div
              className="w-full max-w-sm md:max-w-lg px-3 py-2 text-center"
              style={{
                background: "var(--color-ink-800)",
                border: "1px solid var(--color-ink-700)",
              }}
            >
              {gif.images.original.width && (
                <p className="stamp text-xs" style={{ color: "var(--color-amber-300)" }}>
                  Exhibit dimensions: {gif.images.original.width} × {gif.images.original.height} px
                </p>
              )}
            </div>

            <a
              href={gif.url}
              target="_blank"
              rel="noopener noreferrer"
              className="stamp w-full max-w-sm md:max-w-lg text-center py-3 text-xs tracking-widest transition-colors block"
              style={{
                background: "var(--color-amber-400)",
                color: "var(--color-parchment-100)",
                border: "1px solid var(--color-amber-300)",
              }}
            >
              View Primary Source ↗
            </a>

            <button
              onClick={handleCopy}
              className="stamp w-full max-w-sm md:max-w-lg text-center py-3 text-xs tracking-widest transition-colors block cursor-pointer"
              style={{
                background: copied ? "var(--color-ink-700)" : "var(--color-ink-800)",
                color: copied ? "var(--color-amber-300)" : "var(--color-parchment-200)",
                border: "1px solid var(--color-ink-700)",
              }}
            >
              {copied ? "✓ URL Copied" : "Copy GIF URL"}
            </button>
          </div>

          {/* Right: Dossier */}
          <div className="flex-1 flex flex-col gap-8">

            {/* ── Historical Record / Timeline ── */}
            <section>
              <h2
                className="stamp text-xs tracking-widest mb-4 pb-2"
                style={{
                  color: "var(--color-sepia-400)",
                  borderBottom: "1px solid var(--color-ink-700)",
                }}
              >
                Transmission Log
              </h2>

              <ol className="relative space-y-6 pl-6" style={{ borderLeft: "2px solid var(--color-ink-700)" }}>
                {importedDate && (
                  <li className="relative">
                    <div
                      className="absolute -left-[1.4rem] w-3 h-3 rounded-full"
                      style={{
                        background: "var(--color-amber-400)",
                        border: "3px solid var(--color-ink-900)",
                        top: "2px",
                      }}
                    />
                    <p className="stamp text-xs mb-1" style={{ color: "var(--color-amber-300)" }}>
                      {importedDate}
                    </p>
                    <p className="serif font-semibold text-sm" style={{ color: "var(--color-parchment-100)" }}>
                      Transmitted to Archive
                    </p>
                    {gif.source_tld && (
                      <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--color-parchment-300)" }}>
                        Original source:{" "}
                        {gif.source_post_url ? (
                          <a
                            href={gif.source_post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--color-amber-400)" }}
                          >
                            {gif.source_tld}
                          </a>
                        ) : (
                          gif.source_tld
                        )}
                      </p>
                    )}
                  </li>
                )}

                {trendingDate && (
                  <li className="relative">
                    <div
                      className="absolute -left-[1.4rem] w-3 h-3 rounded-full"
                      style={{
                        background: "var(--color-sepia-400)",
                        border: "3px solid var(--color-ink-900)",
                        top: "2px",
                      }}
                    />
                    <p className="stamp text-xs mb-1" style={{ color: "var(--color-amber-300)" }}>
                      {trendingDate}
                    </p>
                    <p className="serif font-semibold text-sm" style={{ color: "var(--color-parchment-100)" }}>
                      Achieved Orbital Prominence
                    </p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--color-parchment-300)" }}>
                      Achieved widespread circulation across the digital cosmos.
                    </p>
                  </li>
                )}

                {!importedDate && !trendingDate && (
                  <li
                    className="serif italic text-sm"
                    style={{ color: "var(--color-parchment-300)" }}
                  >
                    No transmission log data available for this stellar record.
                  </li>
                )}
              </ol>
            </section>

            {/* ── Classification Details ── */}
            <section>
              <h2
                className="stamp text-xs tracking-widest mb-4 pb-2"
                style={{
                  color: "var(--color-sepia-400)",
                  borderBottom: "1px solid var(--color-ink-700)",
                }}
              >
                Mission Classification
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gif.rating && (
                  <Field label="Content Rating" value={ratingLabel(gif.rating)} />
                )}
                <Field label="Stellar ID" value={gif.id} />
                {gif.username && <Field label="Submitted By" value={`@${gif.username}`} />}
              </dl>
            </section>

            {/* ── Creator File ── */}
            {gif.user && (
              <section>
                <h2
                  className="stamp text-xs tracking-widest mb-4 pb-2"
                  style={{
                    color: "var(--color-sepia-400)",
                    borderBottom: "1px solid var(--color-ink-700)",
                  }}
                >
                  Operator Dossier
                </h2>
                <div
                  className="flex gap-4 items-start p-5"
                  style={{
                    background: "var(--color-ink-800)",
                    border: "1px solid var(--color-ink-700)",
                  }}
                >
                  {gif.user.avatar_url && (
                    <img
                      src={gif.user.avatar_url}
                      alt={gif.user.display_name}
                      className="w-14 h-14 object-cover flex-shrink-0"
                      style={{ border: "1px solid var(--color-amber-600)" }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p
                        className="serif font-bold"
                        style={{ color: "var(--color-parchment-100)" }}
                      >
                        {gif.user.display_name}
                      </p>
                      {gif.user.is_verified && (
                        <span
                          className="stamp text-xs px-2 py-0.5"
                          style={{
                            background: "var(--color-amber-400)",
                            color: "var(--color-parchment-100)",
                            fontSize: "0.6rem",
                          }}
                        >
                          Verified
                        </span>
                      )}
                    </div>
                    {gif.user.description && (
                      <p
                        className="text-xs leading-relaxed mb-2"
                        style={{ color: "var(--color-parchment-300)" }}
                      >
                        {gif.user.description}
                      </p>
                    )}
                    <div className="flex gap-4 flex-wrap">
                      {gif.user.profile_url && (
                        <a
                          href={gif.user.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="stamp text-xs tracking-widest transition-colors"
                          style={{ color: "var(--color-amber-400)" }}
                        >
                          Giphy Profile ↗
                        </a>
                      )}
                      {gif.user.website_url && (
                        <a
                          href={gif.user.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="stamp text-xs tracking-widest transition-colors"
                          style={{ color: "var(--color-amber-400)" }}
                        >
                          Website ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
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

