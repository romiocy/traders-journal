"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Trade } from "@/types/trade";
import { getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";

interface PerformanceMetrics {
  totalTrades: number;
  closedTrades: number;
  openTrades: number;
  winRate: number;
  totalProfit: number;
  bestTrade: number;
  worstTrade: number;
  avgProfit: number;
  profitFactor: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  maxDrawdown: number;
  totalVolume: number;
}

interface MonthlyPerformance {
  month: string;
  trades: number;
  profit: number;
  winRate: number;
}

interface SymbolPerformance {
  symbol: string;
  trades: number;
  wins: number;
  profit: number;
  winRate: number;
}

export default function PerformanceReviewPage() {
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalTrades: 0,
    closedTrades: 0,
    openTrades: 0,
    winRate: 0,
    totalProfit: 0,
    bestTrade: 0,
    worstTrade: 0,
    avgProfit: 0,
    profitFactor: 0,
    consecutiveWins: 0,
    consecutiveLosses: 0,
    maxDrawdown: 0,
    totalVolume: 0,
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [symbolData, setSymbolData] = useState<SymbolPerformance[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [drawdownData, setDrawdownData] = useState<any[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    const headers = { "x-user-id": user.id };

    fetch("/api/trades", { headers })
      .then((res) => res.json())
      .then((data) => {
        const trades: Trade[] = data.trades || [];
        calculateMetrics(trades);
      })
      .catch((err) => console.error("Failed to fetch trades:", err));
  }, []);

  const calculateMetrics = (trades: Trade[]) => {
    const closedTrades = trades.filter((t) => t.status === "CLOSED");
    const openTrades = trades.filter((t) => t.status === "OPEN");

    // Basic metrics
    const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const winTrades = closedTrades.filter((t) => (t.profit || 0) > 0);
    const lossTrades = closedTrades.filter((t) => (t.profit || 0) <= 0);
    const profits = winTrades.map((t) => t.profit || 0);
    const losses = lossTrades.map((t) => t.profit || 0);

    const bestTrade = Math.max(...(profits.length > 0 ? profits : [0]));
    const worstTrade = Math.min(...(losses.length > 0 ? losses : [0]));
    const avgProfit = closedTrades.length > 0 ? totalProfit / closedTrades.length : 0;
    const totalWinProfit = profits.reduce((a, b) => a + b, 0);
    const totalLossProfit = Math.abs(losses.reduce((a, b) => a + b, 0));
    const profitFactor = totalLossProfit > 0 ? totalWinProfit / totalLossProfit : totalWinProfit;
    const winRate = closedTrades.length > 0 ? (winTrades.length / closedTrades.length) * 100 : 0;

    // Consecutive trades
    let maxConsecWins = 0,
      maxConsecLosses = 0,
      currentWins = 0,
      currentLosses = 0;
    closedTrades.forEach((t) => {
      if ((t.profit || 0) > 0) {
        currentWins++;
        currentLosses = 0;
        maxConsecWins = Math.max(maxConsecWins, currentWins);
      } else {
        currentLosses++;
        currentWins = 0;
        maxConsecLosses = Math.max(maxConsecLosses, currentLosses);
      }
    });

    // Maximum drawdown
    let cumulativeProfit = 0,
      peak = 0,
      maxDD = 0;
    closedTrades.forEach((t) => {
      cumulativeProfit += t.profit || 0;
      if (cumulativeProfit > peak) {
        peak = cumulativeProfit;
      } else {
        const dd = Math.abs((peak - cumulativeProfit) / peak);
        maxDD = Math.max(maxDD, dd);
      }
    });

    // Total volume
    const totalVolume = trades.reduce((sum, t) => sum + (t.quantity || 0), 0);

    setMetrics({
      totalTrades: trades.length,
      closedTrades: closedTrades.length,
      openTrades: openTrades.length,
      winRate,
      totalProfit,
      bestTrade,
      worstTrade,
      avgProfit,
      profitFactor,
      consecutiveWins: maxConsecWins,
      consecutiveLosses: maxConsecLosses,
      maxDrawdown: maxDD * 100,
      totalVolume,
    });

    // Monthly performance
    const monthlyMap = new Map<string, { trades: number; profit: number; wins: number }>();
    closedTrades.forEach((t) => {
      const date = new Date(t.tradeDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthlyMap.get(monthKey) || { trades: 0, profit: 0, wins: 0 };
      existing.trades++;
      existing.profit += t.profit || 0;
      if ((t.profit || 0) > 0) existing.wins++;
      monthlyMap.set(monthKey, existing);
    });

    const monthlyPerformance: MonthlyPerformance[] = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        trades: data.trades,
        profit: parseFloat(data.profit.toFixed(2)),
        winRate: (data.wins / data.trades) * 100,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    setMonthlyData(monthlyPerformance);

    // Symbol performance
    const symbolMap = new Map<string, { trades: number; wins: number; profit: number }>();
    closedTrades.forEach((t) => {
      const existing = symbolMap.get(t.symbol) || { trades: 0, wins: 0, profit: 0 };
      existing.trades++;
      if ((t.profit || 0) > 0) existing.wins++;
      existing.profit += t.profit || 0;
      symbolMap.set(t.symbol, existing);
    });

    const symbolPerformance: SymbolPerformance[] = Array.from(symbolMap.entries())
      .map(([symbol, data]) => ({
        symbol,
        trades: data.trades,
        wins: data.wins,
        profit: parseFloat(data.profit.toFixed(2)),
        winRate: (data.wins / data.trades) * 100,
      }))
      .sort((a, b) => b.profit - a.profit);

    setSymbolData(symbolPerformance);

    // Cumulative profit chart
    let cumProfit = 0;
    const cumChartData = closedTrades.map((t, idx) => {
      cumProfit += t.profit || 0;
      return {
        date: new Date(t.tradeDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        profit: parseFloat(cumProfit.toFixed(2)),
        tradeNum: idx + 1,
      };
    });
    setChartData(cumChartData);

    // Drawdown chart
    let cumProfit2 = 0,
      peak2 = 0;
    const ddChartData = closedTrades.map((t) => {
      cumProfit2 += t.profit || 0;
      if (cumProfit2 > peak2) {
        peak2 = cumProfit2;
      }
      const dd = peak2 > 0 ? ((peak2 - cumProfit2) / peak2) * 100 : 0;
      return {
        date: new Date(t.tradeDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        drawdown: parseFloat(dd.toFixed(2)),
      };
    });
    setDrawdownData(ddChartData);

    setLoading(false);
  };

  const MetricCard = ({ label, value, unit = "", color = "text-blue-400" }: any) => (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>
        {typeof value === "number" ? value.toFixed(2) : value}
        {unit}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">{t("performance", "loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text gradient-text mb-2">
          {t("performance", "title")}
        </h1>
        <p className="text-slate-400">{t("performance", "subtitle")}</p>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">{t("performance", "totalTrades")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label={t("performance", "totalTrades")}
            value={metrics.totalTrades}
            color={metrics.totalTrades > 0 ? "text-blue-400" : "text-slate-400"}
          />
          <MetricCard
            label={t("performance", "closedTrades")}
            value={metrics.closedTrades}
            color="text-slate-300"
          />
          <MetricCard
            label={t("performance", "openTrades")}
            value={metrics.openTrades}
            color="text-yellow-400"
          />
          <MetricCard
            label={t("performance", "winRate")}
            value={metrics.winRate}
            unit="%"
            color={metrics.winRate >= 50 ? "text-green-400" : "text-red-400"}
          />
        </div>
      </div>

      {/* Profitability Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">{t("performance", "totalPL")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard
            label={t("performance", "totalPL")}
            value={metrics.totalProfit}
            color={metrics.totalProfit >= 0 ? "text-green-400" : "text-red-400"}
          />
          <MetricCard
            label={t("performance", "avgProfit")}
            value={metrics.avgProfit}
            color={metrics.avgProfit >= 0 ? "text-green-400" : "text-red-400"}
          />
          <MetricCard
            label={t("performance", "bestTrade")}
            value={metrics.bestTrade}
            color="text-green-400"
          />
          <MetricCard
            label={t("performance", "worstTrade")}
            value={metrics.worstTrade}
            color="text-red-400"
          />
          <MetricCard
            label={t("performance", "profitFactor")}
            value={metrics.profitFactor}
            color={metrics.profitFactor > 1 ? "text-green-400" : "text-red-400"}
          />
        </div>
      </div>

      {/* Risk Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">{t("performance", "maxDrawdown")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label={t("performance", "maxConsecWins")}
            value={metrics.consecutiveWins}
            color="text-green-400"
          />
          <MetricCard
            label={t("performance", "maxConsecLosses")}
            value={metrics.consecutiveLosses}
            color="text-red-400"
          />
          <MetricCard
            label={t("performance", "maxDrawdown")}
            value={metrics.maxDrawdown}
            unit="%"
            color="text-red-400"
          />
          <MetricCard
            label={t("performance", "totalVolume")}
            value={metrics.totalVolume}
            color="text-slate-300"
          />
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="card-base p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t("performance", "equityCurve")}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                dot={false}
                name={t("performance", "equityCurve")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {drawdownData.length > 0 && (
        <div className="card-base p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t("performance", "drawdownChart")}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={drawdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="drawdown" fill="#ef4444" name={t("performance", "drawdownChart")} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Performance */}
      {monthlyData.length > 0 && (
        <div className="card-base p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t("performance", "monthlyPerformance")}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="profit" fill="#10b981" name={t("performance", "profit")} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Symbol Performance Table */}
      {symbolData.length > 0 && (
        <div className="card-base p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t("performance", "symbolBreakdown")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-4 text-slate-400 font-semibold">{t("admin", "symbol")}</th>
                  <th className="text-center py-2 px-4 text-slate-400 font-semibold">{t("admin", "trades")}</th>
                  <th className="text-center py-2 px-4 text-slate-400 font-semibold">{t("admin", "wins")}</th>
                  <th className="text-center py-2 px-4 text-slate-400 font-semibold">{t("performance", "winRate")}</th>
                  <th className="text-right py-2 px-4 text-slate-400 font-semibold">{t("performance", "profit")}</th>
                </tr>
              </thead>
              <tbody>
                {symbolData.map((symbol) => (
                  <tr key={symbol.symbol} className="border-b border-slate-800 hover:bg-slate-900/30 transition">
                    <td className="py-3 px-4 text-white font-medium">{symbol.symbol}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{symbol.trades}</td>
                    <td className="py-3 px-4 text-center text-green-400">{symbol.wins}</td>
                    <td className="py-3 px-4 text-center text-slate-300">
                      {symbol.winRate.toFixed(1)}%
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${symbol.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {symbol.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {metrics.totalTrades === 0 && (
        <div className="card-base p-12 text-center">
          <div className="text-slate-400">
            <p className="text-lg mb-2">No trades yet</p>
            <p className="text-sm">Start trading to see your performance metrics</p>
          </div>
        </div>
      )}
    </div>
  );
}
