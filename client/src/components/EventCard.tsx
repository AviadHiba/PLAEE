import { useState } from "react";
import "./EventCard.css";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
export interface SubMarket {
  label: string;
  yesChance: number;
  noChance?: number;
}
 
export interface EventCardProps {
  imageUrl?: string;
  title: string;
  markets: SubMarket[];
  volume?: string;
  liveLabel?: string;
  onBuy?: (side: "yes" | "no", marketLabel: string) => void;
  onClick?: () => void;
}
 
// ─── ActionButton ─────────────────────────────────────────────────────────────
 
function ActionButton({
  label,
  chance,
  side,
  onPress,
}: {
  label: "Yes" | "No";
  chance: number;
  side: "yes" | "no";
  onPress: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      className={`action-btn action-btn--${side}`}
      onClick={onPress}
    >
      <span className="action-btn__label">{label}</span>
      <span className="action-btn__pct">{Math.round(chance)}%</span>
    </button>
  );
}
 
// ─── MarketRow ────────────────────────────────────────────────────────────────
 
function MarketRow({
  market,
  onBuy,
}: {
  market: SubMarket;
  onBuy?: (side: "yes" | "no", label: string) => void;
}) {
  const noChance = market.noChance ?? 100 - market.yesChance;
 
  return (
    <div className="market-row">
      <div className="market-row__label-group">
        <span className="market-row__label">{market.label}</span>
      </div>
      <div className="market-row__buttons">
        <span className="market-row__pct">{(market.yesChance).toFixed(1).replace(/\.0$/, "")}%</span>
        <ActionButton
          label="Yes"
          chance={market.yesChance}
          side="yes"
          onPress={(e) => { e.stopPropagation(); onBuy?.("yes", market.label); }}
        />
        <ActionButton
          label="No"
          chance={noChance}
          side="no"
          onPress={(e) => { e.stopPropagation(); onBuy?.("no", market.label); }}
        />
      </div>
    </div>
  );
}
 
// ─── EventCard ────────────────────────────────────────────────────────────────
 
export function EventCard({
  imageUrl,
  title,
  markets,
  volume,
  liveLabel,
  onBuy,
  onClick,
}: EventCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const visibleMarkets = markets.slice(0, 2);
  // const extraDots = Math.min(markets.length, 4);
  return (
    <article className="event-card" onClick={onClick}>
 
      <div style={{display: 'flex', alignItems: 'center', paddingTop: '12px', paddingInline: '12px'}}>
      {imageUrl && !imgErr && (
        <div className="event-card__image-wrap">
          <img
            className="event-card__image"
            src={imageUrl}
            alt=""
            onError={() => setImgErr(true)}
          />
          {liveLabel && (
            <div className="event-card__live-badge">
              <span className="event-card__live-dot" />
              <span className="event-card__live-text">{liveLabel}</span>
            </div>
          )}
        </div>
      )}
        <h3 className="event-card__title">{title}</h3>
      </div>
 
      {/* Card body */}
      <div className="event-card__body">
 
        <div className="event-card__divider" />
 
        <div className="event-card__markets">
          {visibleMarkets.map((m, i) => (
            <div key={i}>
              <MarketRow market={m} onBuy={onBuy} />
              {i < visibleMarkets.length - 1 && (
                <div className="event-card__row-divider" />
              )}
            </div>
          ))}
        </div>
 
        <div className="event-card__divider--footer" />
 
        <div className="event-card__footer">
          { volume && <span className="event-card__volume">{`$${(Number(volume.replace(/,/g, ""))/1000000).toFixed(1)}M`}</span>}
          {/* { volume && <span className="event-card__volume">{ '$' + volume + 'M'}</span>} */}
 
          {/* Carousel dots for events with >2 markets */}
          {/* {markets.length > 2 && (
            <div className="event-card__dots">
              {Array.from({ length: extraDots }).map((_, i) => (
                <div
                  key={i}
                  className={`event-card__dot ${i === 0 ? "event-card__dot--active" : "event-card__dot--inactive"}`}
                />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </article>
  );
}
