"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Trade } from "@/types/trade";
import { getCurrentUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { AIAssistant } from "@/components/AIAssistant";
import { 
  PageTransition, FadeIn, FadeInStagger, FadeInItem,
  ScrollFadeIn, ScrollStagger, ScrollStaggerItem, ScrollScaleIn,
  HoverCard, AnimatedCounter, FloatingParticles, GlowPulse,
  TextReveal, SlideIn, AnimatedProgressBar
} from "@/components/PageTransition";
import { motion } from "framer-motion";

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
  const { user } = useAuth();
  const { t, lang } = useLanguage();
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
          { name: lang === "ru" ? "Победы" : "Wins", value: winTrades, color: "#10b981" },
          { name: lang === "ru" ? "Поражения" : "Losses", value: lossTrades, color: "#ef4444" },
        ]);
      })
      .catch(() => console.error("Failed to fetch trades"));
  }, []);

  return (
    <PageTransition>
    <div className="space-y-6 sm:space-y-8 relative">
      {/* Floating particles background */}
      <FloatingParticles count={20} />

      {/* Hero Section */}
      <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 relative">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
            <TextReveal text={t("dashboard", "heroTitle")} className="gradient-text" />
          </h1>
          <ScrollFadeIn delay={0.3} direction="up">
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl">
              {t("dashboard", "heroSubtitle")}
            </p>
          </ScrollFadeIn>
        </div>
      </div>

      {/* Stats Section - Scroll-triggered stagger with hover cards */}
      <ScrollStagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <ScrollStaggerItem>
          <HoverCard glowColor="rgba(59, 130, 246, 0.15)">
            <StatCard
              title={t("dashboard", "totalTrades")}
              value={stats.totalTrades || 0}
              numericValue={stats.totalTrades || 0}
              icon="📊"
              trend={stats.totalTrades > 0 ? "up" : "neutral"}
              trendLabels={[t("dashboard", "positive"), t("dashboard", "negative"), t("dashboard", "neutral")]}
            />
          </HoverCard>
        </ScrollStaggerItem>
        <ScrollStaggerItem>
          <HoverCard glowColor="rgba(16, 185, 129, 0.15)">
            <StatCard
              title={t("dashboard", "winRate")}
              value={`${(stats.winRate || 0).toFixed(1)}%`}
              numericValue={stats.winRate || 0}
              suffix="%"
              decimals={1}
              icon="🎯"
              trend={stats.winRate > 50 ? "up" : "down"}
              trendLabels={[t("dashboard", "positive"), t("dashboard", "negative"), t("dashboard", "neutral")]}
            />
          </HoverCard>
        </ScrollStaggerItem>
        <ScrollStaggerItem>
          <HoverCard glowColor={stats.totalProfit >= 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)"}>
            <StatCard
              title={t("dashboard", "totalProfit")}
              value={`$${(stats.totalProfit || 0).toFixed(2)}`}
              numericValue={stats.totalProfit || 0}
              prefix="$"
              decimals={2}
              icon="💰"
              trend={stats.totalProfit > 0 ? "up" : "down"}
              isProfit={stats.totalProfit >= 0}
              trendLabels={[t("dashboard", "positive"), t("dashboard", "negative"), t("dashboard", "neutral")]}
            />
          </HoverCard>
        </ScrollStaggerItem>
        <ScrollStaggerItem>
          <HoverCard glowColor="rgba(139, 92, 246, 0.15)">
            <StatCard
              title={t("dashboard", "openTrades")}
              value={stats.openTrades || 0}
              numericValue={stats.openTrades || 0}
              icon="🔓"
              trend="neutral"
              trendLabels={[t("dashboard", "positive"), t("dashboard", "negative"), t("dashboard", "neutral")]}
            />
          </HoverCard>
        </ScrollStaggerItem>
      </ScrollStagger>

      {/* Win Rate Progress Bar */}
      <ScrollFadeIn delay={0.1}>
        <div className="card-base p-4 sm:p-6">
          <AnimatedProgressBar
            value={stats.winRate || 0}
            maxValue={100}
            color={stats.winRate >= 50 ? "from-green-500 to-emerald-400" : "from-red-500 to-orange-400"}
            label={t("dashboard", "winRate")}
            showPercentage
            height="h-3"
          />
        </div>
      </ScrollFadeIn>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Cumulative P&L Chart */}
        <SlideIn from="left" delay={0.1}>
        <HoverCard className="h-full">
        <div className="card-base p-4 sm:p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                {t("dashboard", "cumulativePL")}
              </h2>
              <p className="text-sm text-slate-300 mt-1">{t("dashboard", "performanceOverTime")}</p>
            </div>
            <motion.div 
              className="text-3xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              📈
            </motion.div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
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
            <div className="h-[250px] flex items-center justify-center text-slate-300 rounded-lg bg-slate-800/20">
              <div className="text-center">
                <p className="text-sm">{t("dashboard", "noClosedTrades")}</p>
                <p className="text-xs text-slate-400 mt-1">{t("dashboard", "closeTradeSee")}</p>
              </div>
            </div>
          )}
        </div>
        </HoverCard>
        </SlideIn>
        {/* Win/Loss Distribution */}
        <SlideIn from="right" delay={0.15}>
        <HoverCard className="h-full">
        <div className="card-base p-4 sm:p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                {t("dashboard", "tradeResults")}
              </h2>
              <p className="text-sm text-slate-300 mt-1">{t("dashboard", "winsVsLosses")}</p>
            </div>
            <motion.div 
              className="text-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            >
              🎯
            </motion.div>
          </div>
          {winLossData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
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
            <div className="h-[250px] flex items-center justify-center text-slate-300 rounded-lg bg-slate-800/20">
              <div className="text-center">
                <p className="text-sm">{t("dashboard", "noTradeResults")}</p>
                <p className="text-xs text-slate-400 mt-1">{t("dashboard", "addAndClose")}</p>
              </div>
            </div>
          )}
        </div>
        </HoverCard>
        </SlideIn>
      </div>

      {/* Quick Actions - Only show when logged in */}
      {user && (
        <ScrollScaleIn>
        <GlowPulse color="blue">
        <div className="card-base p-5 sm:p-8 border-blue-500/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t("dashboard", "readyToTrack")}</h2>
              <p className="text-slate-300 text-sm sm:text-base">{t("dashboard", "startLogging")}</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <motion.a
                href="/add-trade"
                className="btn-primary flex items-center gap-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>+</span> {t("nav", "addTrade")}
              </motion.a>
              <motion.a
                href="/trades"
                className="btn-secondary flex items-center gap-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📊 {t("dashboard", "viewTrades")}
              </motion.a>
            </div>
          </div>
        </div>
        </GlowPulse>
        </ScrollScaleIn>
      )}

      {/* AI Assistant */}
      <AIAssistant />
    </div>
    </PageTransition>
  );
}

function StatCard({
  title,
  value,
  icon,
  isProfit = true,
  trend = "neutral",
  trendLabels = ["Positive", "Negative", "Neutral"],
  numericValue,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  title: string;
  value: string | number;
  icon: string;
  isProfit?: boolean;
  trend?: "up" | "down" | "neutral";
  trendLabels?: [string, string, string];
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div className="card-base p-4 sm:p-6 relative overflow-hidden group">
      {/* Subtle shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="flex items-start justify-between relative">
        <div className="space-y-2 sm:space-y-3 flex-1">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">{title}</p>
          <p className={`text-2xl sm:text-3xl font-bold ${
            isProfit ? "text-white" : "text-red-400"
          }`}>
            {numericValue !== undefined ? (
              <AnimatedCounter 
                value={numericValue} 
                prefix={prefix} 
                suffix={suffix} 
                decimals={decimals} 
                duration={1.8}
              />
            ) : value}
          </p>
          <div className="flex items-center gap-1">
            {trend === "up" && (
              <motion.span 
                className="text-green-400 text-xs font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                ↑ {trendLabels[0]}
              </motion.span>
            )}
            {trend === "down" && (
              <motion.span 
                className="text-red-400 text-xs font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                ↓ {trendLabels[1]}
              </motion.span>
            )}
            {trend === "neutral" && (
              <motion.span 
                className="text-slate-400 text-xs font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                — {trendLabels[2]}
              </motion.span>
            )}
          </div>
        </div>
        <motion.span 
          className="text-2xl sm:text-3xl"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon}
        </motion.span>
      </div>
    </div>
  );
}
