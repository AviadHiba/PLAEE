import type { SubMarket } from "../components/EventCard";

export interface EventData {
  imageUrl?: string;
  title: string;
  markets: SubMarket[];
  volume?: string;
  liveLabel?: string;
  cat: string;
}

interface PolymarketMarket {
  question: string;
  outcomes: string;
  outcomePrices: string;
}

interface PolymarketEvent {
  title: string;
  image?: string;
  category?: string;
  volume?: number;
  live?: boolean;
  markets: PolymarketMarket[];
}

export function mapEvents(events: PolymarketEvent[]): EventData[] {
    // console.log(events[0]?.markets)
  return events.map(event => ({
    imageUrl: event.image,
    title: event.title,
    volume: event.volume?.toLocaleString(),
    liveLabel: event.live ? "LIVE" : undefined,
    cat: event.category ?? "",
    markets: event.markets.map(mapMarket),
  }));
}

function mapMarket(market: PolymarketMarket): SubMarket {
  let outcomes: string[] = [];
  let prices: number[] = [];

  try {
    //   console.log({outcomes: market.outcomes})
      outcomes = JSON.parse(market.outcomes);
      // console.log({prices:market.outcomePrices})
      prices = JSON.parse(market.outcomePrices).map((price: string) => Number(price)*100);
      // console.log({outcomes,prices})
  } catch {
    // console.log('faild')
    return {
      label: market.question,
      yesChance: 0,
    };
  }

  const yesIndex = outcomes.findIndex(
    o => o.toLowerCase() === "yes"
  );

  const noIndex = outcomes.findIndex(
    o => o.toLowerCase() === "no"
  );

  return {
    label: market.question,
    yesChance: yesIndex >= 0 ? prices[yesIndex] : 0,
    noChance: noIndex >= 0 ? prices[noIndex] : undefined,
  };
}
const getEvents = async () => {
    const response = await fetch(
    "https://gamma-api.polymarket.com/events?active=true&closed=false&limit=12"
    );

    const events = await response.json();
    // console.log(events)
    return mapEvents(events);
}

export default getEvents;