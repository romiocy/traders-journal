"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Trade } from "@/types/trade";
import { getCurrentUser } from "@/lib/auth";
import { AIAssistant } from "@/components/AIAssistant";

interface Stats {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  openTrades: number;
}

interface ChartData {
  date: string;
  cumulativeProfit: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalTrades: 0,
    winRate: 0,
    totalProfit: 0,
    openTrades: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [winLossData, setWinLossData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    const userId = user?.id;

    const headers: any = {};
    if (userId) {
      headers["x-user-id"] = userId;
    }

    // Fetch stats from API
    fetch("/api/trades/stats", { headers })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.error("Failed to fetch stats"));

    // Fetch trades for chart
    fetch("/api/trades", { headers })
      .then((res) => res.json())
      .then((data) => {
        const trades: Trade[] = data.trades || [];
        const closedTrades = trades
          .filter((t) => t.status === "CLOSED" && t.profit !== undefined)
          .sort((a, b) => new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime());

        // Calculate cumulative profit
        let cumulativeProfit = 0;
        const performanceData: ChartData[] = closedTrades.map((trade) => {
          cumulativeProfit += trade.profit || 0;
          return {
            date: new Date(trade.tradeDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
          };
        });

        setChartData(performanceData);

        // Calculate win/loss distribution
        const winTrades = trades.filter((t) => t.profit && t.profit > 0).length;
        const lossTrades = trades.filter((t) => t.profit && t.profit <= 0).length;

        setWinLossData([
          { name: "Wins", value: winTrades, color: "#10b981" },
          { name: "Losses", value: lossTrades, color: "#ef4444" },
        ]);
      })
      .catch(() => console.error("Failed to fetch trades"));
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
            <span className="gradient-text">Elevate Your Trading</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Your AI-powered trading analyst. Track trades, analyze performance, and build winning strategies with confidence.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades || 0}
          icon="📊"
          trend={stats.totalTrades > 0 ? "up" : "neutral"}
        />
        <StatCard
          title="Win Rate"
          value={`${(stats.winRate || 0).toFixed(1)}%`}
          icon="🎯"
          trend={stats.winRate > 50 ? "up" : "down"}
        />
        <StatCard
          title="Total Profit"
          value={`$${(stats.totalProfit || 0).toFixed(2)}`}
          icon="💰"
          trend={stats.totalProfit > 0 ? "up" : "down"}
          isProfit={stats.totalProfit >= 0}
        />
        <StatCard
          title="Open Trades"
          value={stats.openTrades || 0}
          icon="🔓"
          trend="neutral"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative P&L Chart */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Cumulative Profit/Loss
              </h2>
              <p className="text-sm text-slate-400 mt-1">Your performance over time</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  stroke="#475569"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  stroke="#475569"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  formatter={(value) =>
                    typeof value === "number" ? `$${value.toFixed(2)}` : value
                  }
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeProfit"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    fill: "#3b82f6",
                    r: 5,
                  }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 rounded-lg bg-slate-800/20">
              <div className="text-center">
                <p className="text-sm">No closed trades yet</p>
                <p className="text-xs text-slate-600 mt-1">Close a trade to see your P&L growth</p>
              </div>
            </div>
          )}
        </div>

        {/* Win/Loss Distribution */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Trade Results
              </h2>
              <p className="text-sm text-slate-400 mt-1">Wins vs losses breakdown</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
          {winLossData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value} trades`, "Count"]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 rounded-lg bg-slate-800/20">
              <div className="text-center">
                <p className="text-sm">No trade results yet</p>
                <p className="text-xs text-slate-600 mt-1">Add and close trades to see your results</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-base p-8 border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready to track your trades?</h2>
            <p className="text-slate-400">Start logging your trades and unlock actionable insights.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/add-trade"
              className="btn-primary flex items-center gap-2"
            >
              <span>+</span> Add Trade
            </a>
            <a
              href="/trades"
              className="btn-secondary flex items-center gap-2"
            >
              📊 View Trades
            </a>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  isProfit = true,
  trend = "neutral",
}: {
  title: string;
  value: string | number;
  icon: string;
  isProfit?: boolean;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="card-base p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className={`text-3xl font-bold ${
            isProfit ? "text-white" : "text-red-400"
          }`}>
            {value}
          </p>
          <div className="flex items-center gap-1">
            {trend === "up" && <span className="text-green-400 text-xs font-medium">↑ Positive</span>}
            {trend === "down" && <span className="text-red-400 text-xs font-medium">↓ Negative</span>}
            {trend === "neutral" && <span className="text-slate-500 text-xs font-medium">— Neutral</span>}
          </div>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
