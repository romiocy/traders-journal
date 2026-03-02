"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CryptoQuote {
  symbol: string;
  price: number;
  change24h: number;
}

const FALLBACK_DATA: CryptoQuote[] = [
  { symbol: "BTC/USD", price: 87420.0, change24h: 2.4 },
  { symbol: "ETH/USD", price: 3182.5, change24h: -1.1 },
  { symbol: "SOL/USD", price: 185.3, change24h: 5.2 },
  { symbol: "BNB/USD", price: 500.2, change24h: 0.8 },
  { symbol: "DOGE/USD", price: 0.184, change24h: 3.1 },
  { symbol: "XRP/USD", price: 2.34, change24h: -0.7 },
  { symbol: "ADA/USD", price: 0.892, change24h: 1.9 },
  { symbol: "AVAX/USD", price: 42.15, change24h: -2.3 },
];

const COINGECKO_IDS = [
  "bitcoin", "ethereum", "solana", "binancecoin",
  "dogecoin", "ripple", "cardano", "avalanche-2",
];

const SYMBOL_MAP: Record<string, string> = {
  bitcoin: "BTC/USD", ethereum: "ETH/USD", solana: "SOL/USD",
  binancecoin: "BNB/USD", dogecoin: "DOGE/USD", ripple: "XRP/USD",
  cardano: "ADA/USD", "avalanche-2": "AVAX/USD",
};

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

function getMarketStatus(quotes: CryptoQuote[]) {
  const avgChange = quotes.reduce((s, q) => s + q.change24h, 0) / quotes.length;
  const vol = Math.sqrt(quotes.reduce((s, q) => s + Math.pow(q.change24h - avgChange, 2), 0) / quotes.length);
  if (vol > 4) return { label: "HIGH VOLATILITY", color: "#f87171" };
  if (vol > 2) return { label: "VOLATILE", color: "#fb923c" };
  if (avgChange > 2) return { label: "BULLISH", color: "#34d399" };
  if (avgChange < -2) return { label: "BEARISH", color: "#f87171" };
  return { label: "NEUTRAL", color: "#94a3b8" };
}

function getAnomalyZone(quotes: CryptoQuote[]) {
  const max = Math.max(...quotes.map((q) => Math.abs(q.change24h)));
  if (max > 8) return { label: "EXTREME MOVES", color: "#f87171" };
  if (max > 5) return { label: "HIGH VOLATILITY", color: "#fb923c" };
  if (max > 3) return { label: "MODERATE", color: "#facc15" };
  return { label: "LOW RISK", color: "#34d399" };
}

export function CryptoTicker() {
  const [quotes, setQuotes] = useState<CryptoQuote[]>(FALLBACK_DATA);
  const [isLive, setIsLive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const speedRef = useRef(0.5); // pixels per frame

  const fetchPrices = useCallback(async () => {
    try {
      const ids = COINGECKO_IDS.join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const newQuotes: CryptoQuote[] = COINGECKO_IDS.map((id) => ({
        symbol: SYMBOL_MAP[id],
        price: data[id]?.usd ?? 0,
        change24h: data[id]?.usd_24h_change ?? 0,
      })).filter((q) => q.price > 0);
      if (newQuotes.length > 0) {
        setQuotes(newQuotes);
        setIsLive(true);
      }
    } catch {
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // RequestAnimationFrame-based scrolling for guaranteed smooth motion
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const animate = () => {
      if (!isPaused && el.firstElementChild) {
        const halfWidth = el.firstElementChild.scrollWidth;
        posRef.current -= speedRef.current;
        if (Math.abs(posRef.current) >= halfWidth) {
          posRef.current = 0;
        }
        el.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPaused, quotes]);

  const ms = getMarketStatus(quotes);
  const az = getAnomalyZone(quotes);

  const sep = <span style={{ color: "#334155", margin: "0 10px", fontSize: 11 }}>{"//"}  </span>;

  const renderQuotes = () => (
    <div style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap", paddingRight: 40 }}>
      {quotes.map((q, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#94a3b8", fontWeight: 600, fontSize: 12 }}>{q.symbol}</span>
          <span style={{ color: "#e2e8f0", fontFamily: "monospace", fontSize: 12 }}>{formatPrice(q.price)}</span>
          <span style={{ color: q.change24h >= 0 ? "#34d399" : "#f87171", fontWeight: 600, fontSize: 11 }}>
            {q.change24h >= 0 ? "▲" : "▼"}{q.change24h >= 0 ? "+" : ""}{q.change24h.toFixed(1)}%
          </span>
          {sep}
        </span>
      ))}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#64748b", fontWeight: 600, fontSize: 11, letterSpacing: 1 }}>MARKET STATUS:</span>
        <span style={{ color: ms.color, fontWeight: 700, fontSize: 11 }}>{ms.label}</span>
        {sep}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#64748b", fontWeight: 600, fontSize: 11, letterSpacing: 1 }}>ANOMALY ZONE:</span>
        <span style={{ color: az.color, fontWeight: 700, fontSize: 11 }}>{az.label}</span>
        {sep}
      </span>
      {!isLive && (
        <span style={{ color: "#475569", fontStyle: "italic", fontSize: 11 }}>
          DEMO DATA{sep}
        </span>
      )}
    </div>
  );

  return (
    <div
      style={{
        background: "#080a0f",
        borderBottom: "1px solid rgba(30, 41, 59, 0.8)",
        overflow: "hidden",
        position: "relative",
        height: 34,
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left fade */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 40,
        background: "linear-gradient(to right, #080a0f, transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />
      {/* Right fade */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 40,
        background: "linear-gradient(to left, #080a0f, transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />
      {/* Live dot */}
      <div style={{
        position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
        zIndex: 3, display: "flex", alignItems: "center", gap: 4,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: isLive ? "#34d399" : "#64748b",
          boxShadow: isLive ? "0 0 6px #34d399" : "none",
          display: "inline-block",
        }} />
      </div>

      {/* Scrolling track */}
      <div
        ref={scrollRef}
        style={{ display: "inline-flex", willChange: "transform" }}
      >
        {renderQuotes()}
        {renderQuotes()}
      </div>
    </div>
  );
}
