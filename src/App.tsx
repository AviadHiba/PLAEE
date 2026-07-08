import { useState, useCallback, useEffect } from "react";
import { EventCard } from "./components/EventCard";
import type { SubMarket } from "./components/EventCard";
import "./App.css";
import getEvents from "./functions/getEvents";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
interface EventData {
  imageUrl?: string;
  title: string;
  markets: SubMarket[];
  volume?: string;
  liveLabel?: string;
  cat: string;
}
 
type FilterKey = "volume" | "active";
 
// ─── Static data ──────────────────────────────────────────────────────────────
 
const CATS: { label: string; live?: boolean }[] = [
  { label: "Trending" },
  { label: "Breaking" },
  { label: "New" },
  { label: "Politics" },
  { label: "Sports",       live: true },
  { label: "Crypto",       live: true },
  { label: "Esports",      live: true },
  { label: "Iran" },
  { label: "Finance" },
  { label: "Geopolitics" },
  { label: "Tech" },
  { label: "Culture" },
  { label: "Economy" },
  { label: "Weather" },
  { label: "Elections" },
];
 
// ─── PolymarketPage ───────────────────────────────────────────────────────────
 
export default function PolymarketPage() {
  const [activeCat,    setActiveCat]    = useState("Trending");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("volume");
  const [hideSports,   setHideSports]   = useState(false);
  const [hideCrypto,   setHideCrypto]   = useState(false);
  const [hideEarnings, setHideEarnings] = useState(false);
  const [toast,        setToast]        = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[] | null>(null);
 
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);
 
  const handleBuy = useCallback((side: "yes" | "no", label: string) => {
    showToast(`✓ Bought ${side.toUpperCase()} on "${label}"`);
  }, [showToast]);
 
  useEffect(() => {
      getEvents().then(setEvents);
  },[]);
  
  const visibleEvents = events?.filter(e => {
    if (activeCat !== "Trending" && e.cat !== activeCat) return false;
    if (hideSports  && e.cat === "Sports") return false;
    if (hideCrypto  && e.cat === "Crypto") return false;
    return true;
  });

 
  return (
    <div className="pm-page">
 
      {/* ── TOP NAV ── */}
      <header className="pm-nav" style={{width: '-webkit-fill-available'}}>
        <img className="pm-nav__logo"
        src={"src/assets/logo-black.png"}
        alt="Logo"
        style={{maxBlockSize: '50%'}}
        />
 
        {["Browse", "Topics"].map(label => (
          <button key={label} className="pm-nav__dropdown">
            {label}
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 6l4 4 4-4"/>
            </svg>
          </button>
        ))}
 
        <div className="pm-nav__right">
          <button className="pm-nav__search-btn" aria-label="Search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          <button className="pm-nav__btn-signin">Sign in</button>
          <button className="pm-nav__btn-signup">Sign up</button>
        </div>
      </header>
 
      {/* ── CATEGORY PILL STRIP ── */}
      <div className="pm-cat-wrap">
        <div className="pm-cat-strip">
          {CATS.map(c => (
            <button
              key={c.label}
              onClick={() => setActiveCat(c.label)}
              className={`pm-cat-pill${activeCat === c.label ? " pm-cat-pill--active" : ""}`}
            >
              {c.live && <span className="pm-cat-pill__live-dot" />}
              {c.label}
            </button>
          ))}
        </div>
      </div>
 
      {/* ── FILTER ROW ── */}
      <div className="pm-filter-row">
        <button className="pm-filter-row__icon-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filters
        </button>
 
        <div className="pm-filter-row__divider" />
 
        {(["volume", "active"] as FilterKey[]).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`pm-filter-chip${activeFilter === f ? " pm-filter-chip--active" : ""}`}
          >
            {f === "volume" ? "24hr Volume" : "Active"}
          </button>
        ))}
 
        <div className="pm-filter-row__divider" />
 
        <button
          onClick={() => setHideSports(v => !v)}
          className={`pm-filter-chip${hideSports ? " pm-filter-chip--active" : ""}`}
        >
          Hide sports
        </button>
        <button
          onClick={() => setHideCrypto(v => !v)}
          className={`pm-filter-chip${hideCrypto ? " pm-filter-chip--active" : ""}`}
        >
          Hide crypto
        </button>
        <button
          onClick={() => setHideEarnings(v => !v)}
          className={`pm-filter-chip${hideEarnings ? " pm-filter-chip--active" : ""}`}
        >
          Hide earnings
        </button>
      </div>
 
      {/* ── SECTION HEADER ── */}
      <div className="pm-section-header">All markets</div>
 
      {/* ── CARD GRID ── */}
      <div className="pm-grid">
        {visibleEvents?.length === 0 ? (
          <div className="pm-grid__empty">No markets in this category.</div>
        ) : (
          visibleEvents?.map((event, i) => (
            <EventCard
              key={i}
              imageUrl={event.imageUrl}
              title={event.title}
              markets={event.markets}
              volume={event.volume}
              liveLabel={event.liveLabel}
              onBuy={handleBuy}
              onClick={() => {/* navigate to event page */}}
            />
          ))
        )}
      </div>
 
      {/* ── TOAST ── */}
      {toast && <div className="pm-toast">{toast}</div>}
    </div>
  );
}