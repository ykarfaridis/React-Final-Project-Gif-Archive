import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Gateway", end: true },
  { to: "/archive", label: "Archive" },
];

const CONTACT = {
  email: "ykarfaridis@gmail.com",
  linkedin: "https://www.linkedin.com/in/yanni-karfaridis/",
};

function ContactButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="cosmic-nav-status cursor-pointer select-none transition-colors duration-150"
        style={open ? { borderColor: "rgba(192,64,255,0.6)", color: "var(--color-amber-300)" } : undefined}
        aria-expanded={open}
        aria-haspopup="true"
      >
        ✦ Contact the Architect
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 z-50 flex flex-col min-w-[220px]"
          style={{
            background: "linear-gradient(135deg, rgba(4,0,16,0.97) 0%, rgba(14,0,48,0.97) 100%)",
            border: "1px solid rgba(192,64,255,0.45)",
            boxShadow: "0 0 32px rgba(192,64,255,0.18), 0 8px 24px rgba(0,0,0,0.6)",
          }}
        >
          <p
            className="stamp text-[0.72rem] tracking-[0.2em] px-4 pt-3 pb-2"
            style={{ color: "rgba(192,64,255,0.6)", borderBottom: "1px solid rgba(192,64,255,0.15)" }}
          >
            Transmission Channels
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 group"
            style={{ borderBottom: "1px solid rgba(192,64,255,0.10)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(192,64,255,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            onClick={() => setOpen(false)}
          >
            <span style={{ color: "var(--color-sepia-400)", fontSize: "1rem" }}>✉</span>
            <span className="font-mono text-xs" style={{ color: "var(--color-parchment-200)" }}>
              {CONTACT.email}
            </span>
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 transition-colors duration-150"
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(192,64,255,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            onClick={() => setOpen(false)}
          >
            <span style={{ color: "var(--color-sepia-400)", fontSize: "1rem" }}>in</span>
            <span className="font-mono text-xs" style={{ color: "var(--color-parchment-200)" }}>
              yanni-karfaridis ↗
            </span>
          </a>
        </div>
      )}
    </div>
  );
}

export function CosmicNav() {
  return (
    <nav className="cosmic-nav px-4 sm:px-6">
      <div className="cosmic-nav-shell max-w-6xl mx-auto px-4 py-3 sm:px-5">

        {/* ── Mobile layout: brand row + nav row ── */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex items-center justify-between gap-4">
            <NavLink to="/" end className="cosmic-brand">
              <img src="/YK-logo-white.png" alt="YK Logo" className="cosmic-brand-logo logo-twinkle logo-twinkle" />
              <span>
                <span className="block serif text-lg font-black leading-none">The GIF Archive</span>
                <span className="stamp block text-[0.72rem] tracking-[0.24em] opacity-90">
                  Cosmic Navigation Relay
                </span>
              </span>
            </NavLink>
            <ContactButton />
          </div>
          <div className="flex items-center justify-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "cosmic-nav-link cosmic-nav-link-active" : "cosmic-nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ── Desktop layout: 3-column ── */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center">
          {/* Left: brand */}
          <NavLink to="/" end className="cosmic-brand justify-self-start">
            <img src="/YK-logo-white.png" alt="YK Logo" className="cosmic-brand-logo" />
            <span>
              <span className="block serif text-lg font-black leading-none">The GIF Archive</span>
              <span className="stamp block text-[0.72rem] tracking-[0.24em] opacity-90">
                Cosmic Navigation Relay
              </span>
            </span>
          </NavLink>

          {/* Centre: nav links + contact */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "cosmic-nav-link cosmic-nav-link-active" : "cosmic-nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
            <ContactButton />
          </div>

          {/* Right: twinkling logo */}
          <div className="justify-self-end">
            <img
              src="/YK-logo-white.png"
              alt="YK Logo"
              className="logo-twinkle"
              style={{ height: "4rem", width: "auto" }}
            />
          </div>
        </div>

      </div>
    </nav>
  );
}
