"use client";

import { useEffect, useState } from "react";
import { Trade } from "@/types/trade";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition, FadeIn, FadeInStagger, FadeInItem } from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

export default function TradesPage() {
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    fetchTrades();
  }, [filter]);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      const userId = user?.id;
      
      const headers: any = {};
      if (userId) {
        headers["x-user-id"] = userId;
      }

      const response = await fetch(`/api/trades?status=${filter === "all" ? "" : filter}`, { headers });
      const data = await response.json();
      setTrades(data.trades || []);
    } catch (error) {
      console.error("Failed to fetch trades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("trades", "confirmDelete"))) {
      try {
        const user = getCurrentUser();
        const userId = user?.id;
        
        const fetchHeaders: any = {};
        if (userId) {
          fetchHeaders["x-user-id"] = userId;
        }

        await fetch(`/api/trades/${id}`, { method: "DELETE", headers: fetchHeaders });
        fetchTrades();
      } catch (error) {
        console.error("Failed to delete trade:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-300">{t("trades", "loadingTrades")}</div>;
  }

  return (
    <PageTransition>
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1">{t("trades", "myTrades")}</h1>
          <p className="text-slate-300 text-sm sm:text-base">{t("trades", "trackAndAnalyze")}</p>
        </div>
        <Link
          href="/add-trade"
          className="btn-primary inline-flex items-center gap-2 w-fit text-sm sm:text-base"
        >
          <span>+</span> {t("trades", "addTrade")}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-1 sm:gap-2 border-b border-slate-800 overflow-x-auto">
        {(["all", "open", "closed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 capitalize font-medium text-xs sm:text-sm transition whitespace-nowrap ${
              filter === status
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-slate-300 hover:text-slate-200 border-b-2 border-transparent"
            }`}
          >
            {status === "all" ? t("trades", "allTrades") : status === "open" ? t("trades", "openTrades") : t("trades", "closedTrades")}
          </button>
        ))}
      </div>

      {trades.length === 0 ? (
        <FadeIn>
        <div className="text-center py-12 sm:py-16 card-base">
          <p className="text-slate-300 text-base sm:text-lg mb-2">{t("trades", "no")} {filter !== "all" ? filter : ""} {t("trades", "noTradesFound")}</p>
          <p className="text-slate-400 text-xs sm:text-sm">{t("trades", "startByAdding")}</p>
        </div>
        </FadeIn>
      ) : (
        <>
          {/* Mobile Cards */}
          <FadeInStagger className="sm:hidden space-y-3">
            {trades.map((trade) => (
              <FadeInItem key={trade.id}>
                <div onClick={() => setSelectedTrade(trade)} className="block card-base p-4 hover:bg-slate-800/60 transition cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-400 text-base">{trade.symbol}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        trade.type === "BUY" ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"
                      }`}>
                        {trade.type === "BUY" ? t("common", "buy") : t("common", "sell")}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      trade.status === "OPEN" ? "bg-blue-900/30 text-blue-300" : "bg-slate-700/50 text-slate-300"
                    }`}>
                      {trade.status === "OPEN" ? t("common", "open") : t("common", "closed")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-slate-400">{t("trades", "entry")}</p>
                      <p className="text-white font-medium">${(trade.entryPrice || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">{t("trades", "exit")}</p>
                      <p className="text-white font-medium">{trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">{t("trades", "pl")}</p>
                      <p className={`font-semibold ${
                        trade.profit != null ? (trade.profit >= 0 ? "text-green-400" : "text-red-400") : "text-slate-400"
                      }`}>
                        {trade.profit != null ? `$${trade.profit.toFixed(2)}` : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{new Date(trade.tradeDate).toLocaleDateString()} · {t("trades", "qty")}: {trade.quantity}</span>
                    <div className="flex gap-3">
                      <span onClick={(e) => { e.stopPropagation(); router.push(`/edit-trade/${trade.id}`); }} className="text-blue-400 hover:text-blue-300 text-xs font-medium cursor-pointer">{t("trades", "edit")}</span>
                      <span onClick={(e) => { e.stopPropagation(); handleDelete(trade.id); }} className="text-red-400 hover:text-red-300 text-xs font-medium cursor-pointer">{t("trades", "delete")}</span>
                    </div>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>

          {/* Desktop Table */}
          <FadeIn className="hidden sm:block">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "symbol")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "type")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "qty")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "entry")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "exit")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "pl")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "status")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "date")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{t("trades", "actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="hover:bg-slate-800/50 transition cursor-pointer"
                  onClick={() => setSelectedTrade(trade)}
                >
                  <td className="px-4 py-4 font-semibold text-blue-400">
                    {trade.symbol}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        trade.type === "BUY"
                          ? "bg-green-900/30 text-green-300"
                          : "bg-red-900/30 text-red-300"
                      }`}
                    >
                      {trade.type === "BUY" ? t("common", "buy") : t("common", "sell")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{trade.quantity}</td>
                  <td className="px-4 py-4 text-slate-300">${(trade.entryPrice || 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-slate-300">
                    {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-4">
                    {trade.profit !== undefined && trade.profit !== null ? (
                      <span
                        className={`font-semibold ${
                          trade.profit >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        ${trade.profit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        trade.status === "OPEN"
                          ? "bg-blue-900/30 text-blue-300"
                          : "bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      {trade.status === "OPEN" ? t("common", "open") : t("common", "closed")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300 text-sm">
                    {new Date(trade.tradeDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/edit-trade/${trade.id}`}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("trades", "edit")}
                      </Link>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(trade.id); }}
                        className="text-red-400 hover:text-red-300 text-xs font-medium transition"
                      >
                        {t("trades", "delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </FadeIn>
        </>
      )}
    </div>

    {/* Trade Detail Dialog */}
    <AnimatePresence>
      {selectedTrade && (
        <TradeDetailDialog
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          t={t}
          onEdit={(id) => { setSelectedTrade(null); router.push(`/edit-trade/${id}`); }}
          onDelete={(id) => { setSelectedTrade(null); handleDelete(id); }}
        />
      )}
    </AnimatePresence>
    </PageTransition>
  );
}

function TradeDetailDialog({
  trade,
  onClose,
  t,
  onEdit,
  onDelete,
}: {
  trade: Trade;
  onClose: () => void;
  t: (section: string, key: string) => string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isProfit = trade.profit != null && trade.profit >= 0;
  const holdingDays =
    trade.exitDate && trade.tradeDate
      ? Math.ceil(
          (new Date(trade.exitDate).getTime() - new Date(trade.tradeDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg max-h-[85vh] overflow-y-auto card-base border border-slate-700/50 rounded-xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-5 py-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{trade.symbol}</h2>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  trade.type === "BUY" ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"
                }`}
              >
                {trade.type === "BUY" ? t("common", "buy") : t("common", "sell")}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  trade.status === "OPEN" ? "bg-blue-900/30 text-blue-300" : "bg-slate-700/50 text-slate-300"
                }`}
              >
                {trade.status === "OPEN" ? t("common", "open") : t("common", "closed")}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* P/L Result */}
            {trade.status === "CLOSED" && trade.profit != null && (
              <div className={`p-4 rounded-lg border-l-4 ${
                isProfit ? "border-l-green-500 bg-green-900/10" : "border-l-red-500 bg-red-900/10"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">{t("tradeDetail", "result")}</p>
                    <p className={`text-2xl font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>
                      {isProfit ? "+" : ""}${trade.profit.toFixed(2)}
                    </p>
                  </div>
                  {trade.profitPercentage != null && (
                    <div className="text-right">
                      <p className="text-slate-400 text-xs mb-1">{t("tradeDetail", "returnPct")}</p>
                      <p className={`text-xl font-bold ${trade.profitPercentage >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {trade.profitPercentage >= 0 ? "+" : ""}{trade.profitPercentage.toFixed(2)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trade Info Grid */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                {t("tradeDetail", "tradeInfo")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InfoItem label={t("trades", "entry")} value={`$${(trade.entryPrice || 0).toFixed(2)}`} />
                <InfoItem label={t("trades", "exit")} value={trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "—"} />
                <InfoItem label={t("trades", "qty")} value={String(trade.quantity)} />
                <InfoItem label={t("tradeDetail", "entryDate")} value={new Date(trade.tradeDate).toLocaleDateString()} />
                <InfoItem label={t("tradeDetail", "exitDate")} value={trade.exitDate ? new Date(trade.exitDate).toLocaleDateString() : "—"} />
                {holdingDays != null && (
                  <InfoItem label={t("tradeDetail", "holdingPeriod")} value={`${holdingDays}d`} />
                )}
              </div>
            </div>

            {/* Journal Notes */}
            {(trade.setupDescription || trade.reasonToBuy || trade.reasonToSell || trade.mistakes || trade.lessonsLearned || trade.notes) && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  {t("tradeDetail", "journalNotes")}
                </h3>
                <div className="space-y-3">
                  {trade.setupDescription && <NoteItem label={t("addTrade", "setupDescription")} text={trade.setupDescription} />}
                  {trade.reasonToBuy && <NoteItem label={t("addTrade", "reasonToBuy")} text={trade.reasonToBuy} />}
                  {trade.reasonToSell && <NoteItem label={t("editTrade", "reasonToSell")} text={trade.reasonToSell} />}
                  {trade.mistakes && <NoteItem label={t("editTrade", "mistakes")} text={trade.mistakes} />}
                  {trade.lessonsLearned && <NoteItem label={t("editTrade", "lessonsLearned")} text={trade.lessonsLearned} />}
                  {trade.notes && <NoteItem label={t("editTrade", "additionalNotes")} text={trade.notes} />}
                </div>
              </div>
            )}

            {/* No notes */}
            {!trade.setupDescription && !trade.reasonToBuy && !trade.reasonToSell && !trade.mistakes && !trade.lessonsLearned && !trade.notes && (
              <p className="text-slate-400 text-sm text-center py-2">{t("tradeDetail", "noNotes")}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onEdit(trade.id)}
                className="btn-primary flex-1 text-sm"
              >
                {t("trades", "edit")}
              </button>
              <button
                onClick={() => onDelete(trade.id)}
                className="flex-1 text-sm py-2 px-4 rounded-lg border border-red-700/50 text-red-400 hover:bg-red-900/20 transition"
              >
                {t("trades", "delete")}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-400 text-xs mb-0.5">{label}</p>
      <p className="text-white font-medium text-sm">{value}</p>
    </div>
  );
}

function NoteItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}
