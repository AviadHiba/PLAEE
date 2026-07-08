/**
 * Navbar.tsx
 * Pixel-faithful replica of the Polymarket top navigation bar.
 * Styles live in Navbar.css.
 */

import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

// ─── Dropdown data (from live site) ──────────────────────────────────────────

const BROWSE_LINKS = [
  { label: "New",          href: "/predictions?_sort=newest" },
  { label: "Trending",     href: "/predictions" },
  { label: "Popular",      href: "/predictions?_sort=volume" },
  { label: "Liquid",       href: "/predictions?_sort=liquidity" },
  { label: "Ending Soon",  href: "/predictions?_sort=ending_soon" },
  { label: "Competitive",  href: "/predictions?_sort=competitive" },
];

const TOPIC_LINKS = [
  { label: "Live Crypto",  href: "/crypto/live",        icon: "🔴" },
  { label: "Politics",     href: "/predictions/politics",icon: "🏛️" },
  { label: "Middle East",  href: "/predictions/middle-east", icon: "🌍" },
  { label: "Crypto",       href: "/predictions/crypto",  icon: "₿" },
  { label: "Sports",       href: "/sports/live",         icon: "⚽" },
  { label: "Pop Culture",  href: "/predictions/pop-culture", icon: "🎬" },
  { label: "Tech",         href: "/predictions/tech",    icon: "💻" },
  { label: "AI",           href: "/predictions/ai",      icon: "🤖" },
];

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function Dropdown({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="nav-dropdown-wrap" ref={ref}>
      <button
        className={`nav-dropdown-btn${open ? " nav-dropdown-btn--open" : ""}`}
        onClick={() => setOpen(v => !v)}
      >
        {label}
        <svg
          className={`nav-dropdown-caret${open ? " nav-dropdown-caret--open" : ""}`}
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="nav-dropdown-panel" onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  return (
    <header className="navbar">
      {/* ── Left: logo + nav items ── */}
      <div className="navbar__left">
        {/* Logo */}
        <a href="/" className="navbar__logo" aria-label="Polymarket home">
          <svg className="navbar__logo-icon" viewBox="0 0 32 32" fill="none"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#0091EA"/>
            <path d="M8 22V10h7.5c2.485 0 4.5 2.015 4.5 4.5S17.985 19 15.5 19H12v3H8z"
              fill="white"/>
            <circle cx="21" cy="20" r="3" fill="white"/>
          </svg>
          <span className="navbar__logo-text">Polymarket</span>
        </a>

        {/* Slash separator */}
        <span className="navbar__slash">/</span>

        {/* Browse dropdown */}
        <Dropdown label="Browse">
          <div className="nav-dropdown-section">
            {BROWSE_LINKS.map(l => (
              <a key={l.label} href={l.href} className="nav-dropdown-item">
                {l.label}
              </a>
            ))}
          </div>
        </Dropdown>

        {/* Topics dropdown */}
        <Dropdown label="Topics">
          <div className="nav-dropdown-section nav-dropdown-section--grid">
            {TOPIC_LINKS.map(l => (
              <a key={l.label} href={l.href} className="nav-dropdown-item nav-dropdown-item--topic">
                <span className="nav-dropdown-item__icon">{l.icon}</span>
                {l.label}
              </a>
            ))}
          </div>
        </Dropdown>
      </div>

      {/* ── Right: actions ── */}
      <div className="navbar__right">
        {/* Search */}
        <button className="navbar__icon-btn" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>

        {/* Portfolio */}
        <a href="/portfolio" className="navbar__text-link">
          Portfolio
        </a>

        {/* Sign in */}
        <button className="navbar__btn navbar__btn--ghost">
          Sign in
        </button>

        {/* Sign up */}
        <button className="navbar__btn navbar__btn--primary">
          Sign up
        </button>
      </div>
    </header>
  );
}
