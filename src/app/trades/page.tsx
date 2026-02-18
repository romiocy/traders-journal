"use client";

import { useEffect, useState } from "react";
import { Trade } from "@/types/trade";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
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
    return <div className="text-center py-12 text-slate-400">{t("trades", "loadingTrades")}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">{t("trades", "myTrades")}</h1>
          <p className="text-slate-400">{t("trades", "trackAndAnalyze")}</p>
        </div>
        <Link
          href="/add-trade"
          className="btn-primary inline-flex items-center gap-2 w-fit"
        >
          <span>+</span> {t("trades", "addTrade")}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-slate-800">
        {(["all", "open", "closed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`py-3 px-4 capitalize font-medium text-sm transition ${
              filter === status
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-slate-400 hover:text-slate-300 border-b-2 border-transparent"
            }`}
          >
            {status === "all" ? t("trades", "allTrades") : status === "open" ? t("trades", "openTrades") : t("trades", "closedTrades")}
          </button>
        ))}
      </div>

      {trades.length === 0 ? (
        <div className="text-center py-16 card-base">
          <p className="text-slate-400 text-lg mb-2">{t("trades", "no")} {filter !== "all" ? filter : ""} {t("trades", "noTradesFound")}</p>
          <p className="text-slate-500 text-sm">{t("trades", "startByAdding")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "symbol")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "type")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "qty")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "entry")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "exit")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "pl")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "status")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "date")}</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("trades", "actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="hover:bg-slate-800/50 transition"
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
                      <span className="text-slate-500">—</span>
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
                  <td className="px-4 py-4 text-slate-400 text-sm">
                    {new Date(trade.tradeDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/edit-trade/${trade.id}`}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium transition"
                      >
                        {t("trades", "edit")}
                      </Link>
                      <button
                        onClick={() => handleDelete(trade.id)}
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
      )}
    </div>
  );
}
