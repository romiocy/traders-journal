"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function CalculatorPage() {
  const { t } = useLanguage();

  const [accountBalance, setAccountBalance] = useState("");
  const [riskPercent, setRiskPercent] = useState("2");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [leverage, setLeverage] = useState("1");

  const calculate = useCallback(() => {
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const lev = parseFloat(leverage) || 1;

    if (!balance || !risk || !entry || !sl) return null;

    const riskAmount = (balance * risk) / 100;
    const slDistance = Math.abs(entry - sl);
    const slPercent = (slDistance / entry) * 100;
    const positionSize = riskAmount / slDistance;
    const positionValue = positionSize * entry;
    const requiredMargin = positionValue / lev;

    let rewardAmount = 0;
    let rrRatio = 0;
    let tpPercent = 0;
    if (tp) {
      const tpDistance = Math.abs(tp - entry);
      tpPercent = (tpDistance / entry) * 100;
      rewardAmount = positionSize * tpDistance;
      rrRatio = tpDistance / slDistance;
    }

    // Max consecutive losses before account is wiped
    const maxConsecLosses = Math.floor(Math.log(0.5) / Math.log(1 - risk / 100));

    // Remaining balance after 1 loss
    const balanceAfterLoss = balance - riskAmount;

    return {
      riskAmount,
      positionSize,
      positionValue,
      requiredMargin,
      rewardAmount,
      rrRatio,
      slPercent,
      tpPercent,
      maxConsecLosses,
      balanceAfterLoss,
    };
  }, [accountBalance, riskPercent, entryPrice, stopLoss, takeProfit, leverage]);

  const results = calculate();

  const formatNum = (n: number, decimals = 2) =>
    n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {t("calculator", "title")}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            {t("calculator", "subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <span className="text-xl">⚙️</span> {t("calculator", "parameters")}
            </h2>

            <div className="space-y-4">
              {/* Account Balance */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t("calculator", "accountBalance")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(e.target.value)}
                    placeholder="10000"
                    className="w-full pl-7 pr-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Risk Percent */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t("calculator", "riskPercent")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(e.target.value)}
                    placeholder="2"
                    step="0.5"
                    min="0.1"
                    max="100"
                    className="w-full pl-4 pr-8 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                </div>
                {/* Quick risk buttons */}
                <div className="flex gap-2 mt-2">
                  {["0.5", "1", "2", "3", "5"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setRiskPercent(v)}
                      className={`px-3 py-1 text-xs rounded-lg transition font-medium ${
                        riskPercent === v
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Entry Price */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t("calculator", "entryPrice")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    placeholder="50000"
                    className="w-full pl-7 pr-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t("calculator", "stopLoss")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">$</span>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="48000"
                    className="w-full pl-7 pr-4 py-2.5 bg-slate-900/50 border border-red-600/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  />
                </div>
              </div>

              {/* Take Profit */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t("calculator", "takeProfit")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">$</span>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="54000"
                    className="w-full pl-7 pr-4 py-2.5 bg-slate-900/50 border border-green-600/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                  />
                </div>
              </div>

              {/* Leverage */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t("calculator", "leverage")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    placeholder="1"
                    min="1"
                    max="125"
                    className="w-full pl-4 pr-8 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">x</span>
                </div>
                {/* Quick leverage buttons */}
                <div className="flex gap-2 mt-2">
                  {["1", "2", "5", "10", "20"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setLeverage(v)}
                      className={`px-3 py-1 text-xs rounded-lg transition font-medium ${
                        leverage === v
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {v}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {results ? (
              <>
                {/* Risk & Reward Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Risk Amount */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                    <p className="text-red-400 text-xs font-medium mb-1">{t("calculator", "riskAmount")}</p>
                    <p className="text-2xl font-bold text-red-400">${formatNum(results.riskAmount)}</p>
                    <p className="text-red-400/60 text-xs mt-1">{riskPercent}% {t("calculator", "ofAccount")}</p>
                  </div>

                  {/* Reward Amount */}
                  <div className={`${results.rewardAmount > 0 ? "bg-green-500/10 border-green-500/20" : "bg-slate-800/50 border-slate-700/50"} border rounded-2xl p-4`}>
                    <p className={`${results.rewardAmount > 0 ? "text-green-400" : "text-slate-400"} text-xs font-medium mb-1`}>{t("calculator", "rewardAmount")}</p>
                    <p className={`text-2xl font-bold ${results.rewardAmount > 0 ? "text-green-400" : "text-slate-500"}`}>
                      {results.rewardAmount > 0 ? `$${formatNum(results.rewardAmount)}` : "—"}
                    </p>
                    {results.tpPercent > 0 && (
                      <p className="text-green-400/60 text-xs mt-1">+{formatNum(results.tpPercent)}% {t("calculator", "fromEntry")}</p>
                    )}
                  </div>
                </div>

                {/* R:R Ratio */}
                {results.rrRatio > 0 && (
                  <div className={`border rounded-2xl p-4 ${
                    results.rrRatio >= 2
                      ? "bg-green-500/10 border-green-500/20"
                      : results.rrRatio >= 1
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-300 text-xs font-medium mb-1">{t("calculator", "rrRatio")}</p>
                        <p className={`text-3xl font-bold ${
                          results.rrRatio >= 2
                            ? "text-green-400"
                            : results.rrRatio >= 1
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}>
                          1 : {formatNum(results.rrRatio)}
                        </p>
                      </div>
                      <div className={`text-4xl ${
                        results.rrRatio >= 2 ? "opacity-100" : results.rrRatio >= 1 ? "opacity-70" : "opacity-50"
                      }`}>
                        {results.rrRatio >= 2 ? "🎯" : results.rrRatio >= 1 ? "⚠️" : "🚫"}
                      </div>
                    </div>
                    {/* Visual bar */}
                    <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 rounded-l-full" style={{ flex: 1 }} />
                      <div
                        className={`rounded-r-full ${
                          results.rrRatio >= 2 ? "bg-green-500" : results.rrRatio >= 1 ? "bg-yellow-500" : "bg-red-400"
                        }`}
                        style={{ flex: results.rrRatio }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-red-400">{t("calculator", "risk")}</span>
                      <span className={`text-xs ${results.rrRatio >= 2 ? "text-green-400" : results.rrRatio >= 1 ? "text-yellow-400" : "text-red-400"}`}>{t("calculator", "reward")}</span>
                    </div>
                  </div>
                )}

                {/* Position Details */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>📊</span> {t("calculator", "positionDetails")}
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{t("calculator", "positionSize")}</span>
                      <span className="text-white font-medium text-sm">{formatNum(results.positionSize, 6)}</span>
                    </div>
                    <div className="border-t border-slate-700/50" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{t("calculator", "positionValue")}</span>
                      <span className="text-white font-medium text-sm">${formatNum(results.positionValue)}</span>
                    </div>
                    {parseFloat(leverage) > 1 && (
                      <>
                        <div className="border-t border-slate-700/50" />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">{t("calculator", "requiredMargin")}</span>
                          <span className="text-white font-medium text-sm">${formatNum(results.requiredMargin)}</span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-slate-700/50" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{t("calculator", "stopLossDistance")}</span>
                      <span className="text-red-400 font-medium text-sm">-{formatNum(results.slPercent)}%</span>
                    </div>
                    {results.tpPercent > 0 && (
                      <>
                        <div className="border-t border-slate-700/50" />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">{t("calculator", "takeProfitDistance")}</span>
                          <span className="text-green-400 font-medium text-sm">+{formatNum(results.tpPercent)}%</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Survival Stats */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>🛡️</span> {t("calculator", "survivalStats")}
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{t("calculator", "balanceAfterLoss")}</span>
                      <span className="text-yellow-400 font-medium text-sm">${formatNum(results.balanceAfterLoss)}</span>
                    </div>
                    <div className="border-t border-slate-700/50" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{t("calculator", "maxConsecLosses")}</span>
                      <span className="text-orange-400 font-medium text-sm">
                        {results.maxConsecLosses} {t("calculator", "tradesToHalf")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Risk Quality Indicator */}
                <div className={`rounded-2xl p-4 border ${
                  parseFloat(riskPercent) <= 1
                    ? "bg-green-500/10 border-green-500/20"
                    : parseFloat(riskPercent) <= 2
                    ? "bg-blue-500/10 border-blue-500/20"
                    : parseFloat(riskPercent) <= 5
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {parseFloat(riskPercent) <= 1
                        ? "✅"
                        : parseFloat(riskPercent) <= 2
                        ? "👍"
                        : parseFloat(riskPercent) <= 5
                        ? "⚠️"
                        : "🚨"
                      }
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${
                        parseFloat(riskPercent) <= 1
                          ? "text-green-400"
                          : parseFloat(riskPercent) <= 2
                          ? "text-blue-400"
                          : parseFloat(riskPercent) <= 5
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}>
                        {parseFloat(riskPercent) <= 1
                          ? t("calculator", "conservativeRisk")
                          : parseFloat(riskPercent) <= 2
                          ? t("calculator", "moderateRisk")
                          : parseFloat(riskPercent) <= 5
                          ? t("calculator", "aggressiveRisk")
                          : t("calculator", "extremeRisk")}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {parseFloat(riskPercent) <= 1
                          ? t("calculator", "conservativeDesc")
                          : parseFloat(riskPercent) <= 2
                          ? t("calculator", "moderateDesc")
                          : parseFloat(riskPercent) <= 5
                          ? t("calculator", "aggressiveDesc")
                          : t("calculator", "extremeDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <span className="text-6xl mb-4">🧮</span>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("calculator", "emptyTitle")}
                </h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  {t("calculator", "emptyDesc")}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
