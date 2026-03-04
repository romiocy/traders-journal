"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Calculator, TrendingUp, Bot, Link2, Globe,
  Rocket, HandMetal, Crosshair, DollarSign, Users, Unlock,
  PenLine, Trophy, Sparkles, ArrowUpRight, ArrowDownRight, Minus,
  BarChart2
} from "lucide-react";

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

  // If no user is logged in, show the welcome landing page
  if (!user) {
    return <WelcomeLanding />;
  }

  return <UserDashboard />;
}

// ============================================================
// WELCOME LANDING PAGE — for first-time / non-logged-in visitors
// ============================================================

// Fake demo chart data
const demoChartData = [
  { date: "Jan", profit: 320 },
  { date: "Feb", profit: 580 },
  { date: "Mar", profit: 420 },
  { date: "Apr", profit: 890 },
  { date: "May", profit: 1150 },
  { date: "Jun", profit: 980 },
  { date: "Jul", profit: 1420 },
  { date: "Aug", profit: 1680 },
  { date: "Sep", profit: 1540 },
  { date: "Oct", profit: 2100 },
  { date: "Nov", profit: 2450 },
  { date: "Dec", profit: 2890 },
];

const demoWinLoss = [
  { name: "Wins", value: 68, color: "#10b981" },
  { name: "Losses", value: 32, color: "#ef4444" },
];

function WelcomeLanding() {
  const { t, lang } = useLanguage();
  const [visibleFeature, setVisibleFeature] = useState(0);

  const features = [
    { icon: <BarChart3 className="w-9 h-9 text-blue-400" />, titleKey: "featureTrack", descKey: "featureTrackDesc" },
    { icon: <Calculator className="w-9 h-9 text-orange-400" />, titleKey: "featureCalculator", descKey: "featureCalculatorDesc" },
    { icon: <TrendingUp className="w-9 h-9 text-emerald-400" />, titleKey: "featureAnalytics", descKey: "featureAnalyticsDesc" },
    { icon: <Bot className="w-9 h-9 text-cyan-400" />, titleKey: "featureAI", descKey: "featureAIDesc" },
    { icon: <Link2 className="w-9 h-9 text-violet-400" />, titleKey: "featureExchange", descKey: "featureExchangeDesc" },
    { icon: <Globe className="w-9 h-9 text-sky-400" />, titleKey: "featureLang", descKey: "featureLangDesc" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <PageTransition>
      <div className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 -mb-8">
        <FloatingParticles count={30} />

        {/* ─── HERO SECTION ─── */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-violet-500/8 rounded-full blur-[80px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mb-6"
          >
            <motion.span
              className="block mb-4"
              animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            >
              <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400" />
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6"
          >
            <span className="gradient-text-animated">{t("welcome", "heroTitle")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10 text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-3xl mb-10"
          >
            {t("welcome", "heroSubtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative z-10 flex flex-col sm:flex-row gap-4 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59,130,246,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
              >
                <Rocket className="w-5 h-5" /> {t("welcome", "getStartedFree")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/80 backdrop-blur border border-slate-600/50 text-white text-lg font-medium rounded-2xl hover:bg-slate-700/80 transition-all"
              >
                <HandMetal className="w-5 h-5" /> {t("welcome", "iHaveAccount")}
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}
            className="relative z-10 text-slate-400 text-sm flex flex-col items-center gap-2"
          >
            <span>{t("welcome", "scrollToExplore")}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* ─── FAKE STATS SHOWCASE ─── */}
        <section className="px-4 py-12 sm:py-20">
          <ScrollFadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-3">
              {t("welcome", "statsTitle")}
            </h2>
            <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto">
              {t("welcome", "statsSubtitle")}
            </p>
          </ScrollFadeIn>

          <ScrollStagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <ScrollStaggerItem>
              <HoverCard glowColor="rgba(59, 130, 246, 0.15)">
                <div className="card-base p-4 sm:p-6 text-center">
                  <motion.span className="text-3xl mb-2 block" animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity }}><BarChart3 className="w-8 h-8 text-blue-400 mx-auto" /></motion.span>
                  <p className="text-xs sm:text-sm text-slate-400 mb-1">{t("welcome", "demoTotalTrades")}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    <AnimatedCounter value={1247} duration={2} />
                  </p>
                </div>
              </HoverCard>
            </ScrollStaggerItem>
            <ScrollStaggerItem>
              <HoverCard glowColor="rgba(16, 185, 129, 0.15)">
                <div className="card-base p-4 sm:p-6 text-center">
                  <motion.span className="text-3xl mb-2 block" animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}><Crosshair className="w-8 h-8 text-emerald-400 mx-auto" /></motion.span>
                  <p className="text-xs sm:text-sm text-slate-400 mb-1">{t("welcome", "demoWinRate")}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">
                    <AnimatedCounter value={68.5} suffix="%" decimals={1} duration={2} />
                  </p>
                </div>
              </HoverCard>
            </ScrollStaggerItem>
            <ScrollStaggerItem>
              <HoverCard glowColor="rgba(16, 185, 129, 0.15)">
                <div className="card-base p-4 sm:p-6 text-center">
                  <motion.span className="text-3xl mb-2 block" animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}><DollarSign className="w-8 h-8 text-emerald-400 mx-auto" /></motion.span>
                  <p className="text-xs sm:text-sm text-slate-400 mb-1">{t("welcome", "demoProfit")}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">
                    <AnimatedCounter value={28940} prefix="$" duration={2.5} />
                  </p>
                </div>
              </HoverCard>
            </ScrollStaggerItem>
            <ScrollStaggerItem>
              <HoverCard glowColor="rgba(139, 92, 246, 0.15)">
                <div className="card-base p-4 sm:p-6 text-center">
                  <motion.span className="text-3xl mb-2 block" animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.9 }}><Users className="w-8 h-8 text-violet-400 mx-auto" /></motion.span>
                  <p className="text-xs sm:text-sm text-slate-400 mb-1">{t("welcome", "demoTraders")}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    <AnimatedCounter value={5200} duration={2} />+
                  </p>
                </div>
              </HoverCard>
            </ScrollStaggerItem>
          </ScrollStagger>
        </section>

        {/* ─── DEMO CHARTS ─── */}
        <section className="px-4 py-12 sm:py-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SlideIn from="left" delay={0.1}>
              <HoverCard className="h-full">
                <div className="card-base p-5 sm:p-6 h-full">
                  <h3 className="text-lg font-bold text-white mb-1">{t("welcome", "demoChartTitle")}</h3>
                  <p className="text-xs text-slate-400 mb-4">{t("welcome", "demoChartDesc")}</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={demoChartData}>
                      <defs>
                        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#475569" />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#475569" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                        formatter={(value: number) => [`$${value}`, "Profit"]}
                      />
                      <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2.5} fill="url(#profitGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </HoverCard>
            </SlideIn>

            <SlideIn from="right" delay={0.15}>
              <HoverCard className="h-full">
                <div className="card-base p-5 sm:p-6 h-full">
                  <h3 className="text-lg font-bold text-white mb-1">{t("welcome", "demoWinLossTitle")}</h3>
                  <p className="text-xs text-slate-400 mb-4">{t("welcome", "demoWinLossDesc")}</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={demoWinLoss}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {demoWinLoss.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </HoverCard>
            </SlideIn>
          </div>
        </section>

        {/* ─── FEATURES CAROUSEL ─── */}
        <section className="px-4 py-12 sm:py-20">
          <ScrollFadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-3">
              {t("welcome", "featuresTitle")}
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
              {t("welcome", "featuresSubtitle")}
            </p>
          </ScrollFadeIn>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <HoverCard glowColor="rgba(59, 130, 246, 0.1)" className="h-full">
                  <div className="card-base p-6 text-center h-full flex flex-col items-center justify-center">
                    <motion.div
                      className="block mb-3"
                      animate={visibleFeature === i ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      {f.icon}
                    </motion.div>
                    <h3 className="text-white font-semibold mb-2">{t("welcome", f.titleKey)}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{t("welcome", f.descKey)}</p>
                  </div>
                </HoverCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="px-4 py-12 sm:py-20 max-w-4xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">
              {t("welcome", "howItWorks")}
            </h2>
          </ScrollFadeIn>

          <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
            {[
              { step: "1", icon: <PenLine className="w-7 h-7 text-blue-400" />, titleKey: "step1Title", descKey: "step1Desc" },
              { step: "2", icon: <BarChart3 className="w-7 h-7 text-cyan-400" />, titleKey: "step2Title", descKey: "step2Desc" },
              { step: "3", icon: <Rocket className="w-7 h-7 text-emerald-400" />, titleKey: "step3Title", descKey: "step3Desc" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center"
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {s.icon}
                </motion.div>
                <div className="text-blue-400 text-xs font-bold mb-2 uppercase tracking-wider">
                  {t("welcome", "step")} {s.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{t("welcome", s.titleKey)}</h3>
                <p className="text-slate-400 text-sm">{t("welcome", s.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
              <div className="card-base p-8 sm:p-12 border-blue-500/20 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5" />
                <motion.div
                  className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"
                  animate={{ scale: [1.3, 1, 1.3], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                />

                <div className="relative z-10">
                  <motion.span
                    className="text-5xl block mb-4"
                    animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Trophy className="w-12 h-12 text-yellow-400" />
                  </motion.span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                    {t("welcome", "ctaTitle")}
                  </h2>
                  <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                    {t("welcome", "ctaSubtitle")}
                  </p>
                  <motion.div
                    className="inline-block rounded-2xl"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(59,130,246,0.6), 0 0 120px rgba(6,182,212,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                    >
                      <Sparkles className="w-5 h-5" /> {t("welcome", "signUpNow")}
                    </Link>
                  </motion.div>
                  <p className="text-slate-500 text-xs mt-4">{t("welcome", "freeForever")}</p>
                </div>
              </div>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
}

// ============================================================
// USER DASHBOARD — for logged-in users (existing functionality)
// ============================================================

function UserDashboard() {
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
              icon="BarChart3"
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
              icon="Crosshair"
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
              icon="DollarSign"
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
              icon="Unlock"
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
              <TrendingUp className="w-8 h-8 text-blue-400" />
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
              <Crosshair className="w-8 h-8 text-emerald-400" />
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
                <BarChart2 className="w-5 h-5" /> {t("dashboard", "viewTrades")}
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
  const iconMap: Record<string, React.ReactNode> = {
    BarChart3: <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />,
    Crosshair: <Crosshair className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />,
    DollarSign: <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />,
    Unlock: <Unlock className="w-7 h-7 sm:w-8 sm:h-8 text-violet-400" />,
  };

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
                className="text-green-400 text-xs font-medium flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> {trendLabels[0]}
              </motion.span>
            )}
            {trend === "down" && (
              <motion.span 
                className="text-red-400 text-xs font-medium flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ArrowDownRight className="w-3.5 h-3.5" /> {trendLabels[1]}
              </motion.span>
            )}
            {trend === "neutral" && (
              <motion.span 
                className="text-slate-400 text-xs font-medium flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Minus className="w-3.5 h-3.5" /> {trendLabels[2]}
              </motion.span>
            )}
          </div>
        </div>
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {iconMap[icon] || icon}
        </motion.div>
      </div>
    </div>
  );
}
