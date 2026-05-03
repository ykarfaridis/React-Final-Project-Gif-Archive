import { Link } from "react-router";
import type { Route } from "./+types/landing";
import { CosmicNav } from "../components/cosmic-nav";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The GIF Archive — Keeper of the Cosmic Record" },
    {
      name: "description",
      content:
        "A sacred repository of animated culture — catalogued across the cosmos and preserved for all who seek.",
    },
  ];
}

const glyphs = [
  {
    symbol: "☽",
    title: "Catalogued",
    body: "Every signal indexed with provenance, transmission date, and classification drawn from the primary cosmic source.",
  },
  {
    symbol: "✦",
    title: "Historical",
    body: "Acquisition stardates, orbital prominence records, and lineage preserved as a permanent log in the cosmic annals.",
  },
  {
    symbol: "◈",
    title: "Searchable",
    body: "Query the full stellar repository by subject, operator, or keyword. Each result is a dossier inscribed in light.",
  },
];

export default function Landing() {
  return (
    <div className="starfield min-h-screen flex flex-col overflow-x-hidden">
      <CosmicNav />

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center relative">

        {/* Outer sacred geometry rings */}
        <div className="absolute pointer-events-none" style={{ width: "700px", height: "700px", top: "50%", left: "50%", transform: "translate(-50%, -50%)", borderRadius: "50%", border: "1px solid rgba(192, 64, 255, 0.10)" }} />
        <div className="absolute pointer-events-none" style={{ width: "560px", height: "560px", top: "50%", left: "50%", transform: "translate(-50%, -50%)", borderRadius: "50%", border: "1px solid rgba(192, 64, 255, 0.16)" }} />
        <div className="absolute pointer-events-none" style={{ width: "420px", height: "420px", top: "50%", left: "50%", transform: "translate(-50%, -50%)", borderRadius: "50%", border: "1px solid rgba(192, 64, 255, 0.24)" }} />

        {/* Moon orb */}
        <div
          className="moon-glow absolute pointer-events-none"
          style={{ width: "340px", height: "340px", top: "50%", left: "50%", transform: "translate(-50%, -54%)" }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">

          <p className="stamp text-xs tracking-widest mb-8" style={{ color: "var(--color-sepia-400)", opacity: 0.75 }}>
            Coord. 00°00′00″ &nbsp;·&nbsp; Est. MMXXVI &nbsp;·&nbsp; Open Archive
          </p>

          {/* Rule with violet orb */}
          <div className="flex items-center gap-3 w-full mb-8">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(192,64,255,0.5))" }} />
            <div className="w-2 h-2 rounded-full fire-glow" style={{ background: "var(--color-amber-400)" }} />
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(192,64,255,0.5))" }} />
          </div>

          <h1
            className="serif font-black leading-none tracking-tight mb-1"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 6.5rem)",
              color: "#f0e4ff",
              textShadow: "0 0 60px rgba(192, 64, 255, 0.35), 0 0 120px rgba(64, 216, 255, 0.15), 0 2px 4px rgba(0,0,0,0.9)",
            }}
          >
            The GIF Archive
          </h1>

          <p
            className="serif italic mt-3 mb-8"
            style={{ fontSize: "clamp(1rem, 3vw, 1.4rem)", color: "var(--color-parchment-300)", letterSpacing: "0.04em" }}
          >
            Keeper of the Cosmic Record
          </p>

          {/* Rule with star */}
          <div className="flex items-center gap-3 w-full mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(192,64,255,0.5))" }} />
            <span style={{ color: "var(--color-amber-400)", fontSize: "1rem" }}>✦</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(192,64,255,0.5))" }} />
          </div>

          <p className="serif text-base md:text-lg leading-relaxed max-w-lg mb-12" style={{ color: "var(--color-parchment-200)" }}>
            As consciousness moves through the digital ether, animated images carry
            the memory of a civilisation. This archive exists to catalogue,
            contextualise, and preserve those transmissions — each one a glyph
            inscribed in the permanent cosmic record.
          </p>

          {/* CTA — violet orb style */}
          <Link
            to="/archive"
            className="stamp inline-flex items-center gap-3 px-6 sm:px-10 py-4 text-sm tracking-widest transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(192,64,255,0.15) 0%, rgba(120,0,200,0.10) 100%)",
              border: "1px solid rgba(192, 64, 255, 0.6)",
              color: "var(--color-amber-300)",
              boxShadow: "0 0 20px rgba(192, 64, 255, 0.20), inset 0 0 20px rgba(192, 64, 255, 0.05)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.boxShadow = "0 0 40px rgba(192, 64, 255, 0.50), 0 0 80px rgba(64, 216, 255, 0.20), inset 0 0 20px rgba(192, 64, 255, 0.10)";
              el.style.borderColor = "rgba(192, 64, 255, 0.95)";
              el.style.color = "#e090ff";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.boxShadow = "0 0 20px rgba(192, 64, 255, 0.20), inset 0 0 20px rgba(192, 64, 255, 0.05)";
              el.style.borderColor = "rgba(192, 64, 255, 0.6)";
              el.style.color = "var(--color-amber-300)";
            }}
          >
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--color-amber-400)", boxShadow: "0 0 8px 2px rgba(192, 64, 255, 0.9)" }} />
            Access the Archive
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--color-amber-400)", boxShadow: "0 0 8px 2px rgba(192, 64, 255, 0.9)" }} />
          </Link>
        </div>

        {/* ── Three Glyphs ── */}
        <div className="relative z-10 w-full max-w-3xl mt-24 grid grid-cols-1 md:grid-cols-3 gap-5">
          {glyphs.map((g) => (
            <div
              key={g.symbol}
              className="px-6 py-8 text-center flex flex-col items-center gap-3 transition-all duration-300"
              style={{
                background: "rgba(8, 0, 28, 0.75)",
                border: "1px solid rgba(192, 64, 255, 0.20)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(192, 64, 255, 0.55)";
                el.style.boxShadow = "0 0 30px rgba(192, 64, 255, 0.12)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(192, 64, 255, 0.20)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1"
                style={{
                  background: "radial-gradient(circle, rgba(192,64,255,0.20) 0%, transparent 70%)",
                  border: "1px solid rgba(192, 64, 255, 0.40)",
                  color: "var(--color-amber-300)",
                }}
              >
                {g.symbol}
              </div>
              <h3 className="serif text-base font-bold tracking-wide" style={{ color: "var(--color-parchment-100)" }}>
                {g.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-parchment-300)" }}>
                {g.body}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="text-center py-6 stamp text-xs tracking-widest relative z-10"
        style={{ color: "var(--color-parchment-300)", borderTop: "1px solid rgba(192, 64, 255, 0.20)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <img src="/YK-logo-white.png" alt="YK Logo" className="yk-logo logo-twinkle" />
          <p className="stamp text-xs" style={{ color: "var(--color-amber-300)", opacity: 0.75 }}>© 2026 YK</p>
          <p>
            The GIF Archive &nbsp;·&nbsp; Powered by{" "}
            <a href="https://giphy.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-sepia-400)" }}>
              Giphy
            </a>{" "}
            &nbsp;·&nbsp; All transmissions public domain
          </p>
        </div>
      </footer>
    </div>
  );
}
