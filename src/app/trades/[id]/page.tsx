"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Trade } from "@/types/trade";
import { getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition, FadeIn } from "@/components/PageTransition";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function TradeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const user = getCurrentUser();
        const headers: any = {};
        if (user?.id) headers["x-user-id"] = user.id;

        const res = await fetch(`/api/trades/${id}`, { headers });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setTrade(data);
      } catch (err) {
        console.error("Failed to load trade:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTrade();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-300">
        {t("tradeDetail", "loading")}
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-300 text-lg mb-4">{t("editTrade", "tradeNotFound")}</p>
        <Link href="/trades" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> {t("tradeDetail", "backToTrades")}
        </Link>
      </div>
    );
  }

  const isProfit = trade.profit != null && trade.profit >= 0;
  const holdingDays =
    trade.exitDate && trade.tradeDate
      ? Math.ceil(
          (new Date(trade.exitDate).getTime() - new Date(trade.tradeDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back link + Header */}
        <div>
          <Link
            href="/trades"
            className="text-sm text-slate-400 hover:text-slate-200 transition inline-flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> {t("tradeDetail", "backToTrades")}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{trade.symbol}</h1>
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  trade.type === "BUY"
                    ? "bg-green-900/30 text-green-300"
                    : "bg-red-900/30 text-red-300"
                }`}
              >
                {trade.type === "BUY" ? t("common", "buy") : t("common", "sell")}
              </span>
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  trade.status === "OPEN"
                    ? "bg-blue-900/30 text-blue-300"
                    : "bg-slate-700/50 text-slate-300"
                }`}
              >
                {trade.status === "OPEN" ? t("common", "open") : t("common", "closed")}
              </span>
            </div>
            <Link
              href={`/edit-trade/${trade.id}`}
              className="btn-primary inline-flex items-center gap-2 w-fit text-sm"
            >
              {t("trades", "edit")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* P/L Summary Card */}
        {trade.status === "CLOSED" && trade.profit != null && (
          <FadeIn>
            <div
              className={`card-base p-6 border-l-4 ${
                isProfit ? "border-l-green-500" : "border-l-red-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{t("tradeDetail", "result")}</p>
                  <p
                    className={`text-3xl font-bold ${
                      isProfit ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isProfit ? "+" : ""}${trade.profit.toFixed(2)}
                  </p>
                </div>
                {trade.profitPercentage != null && (
                  <div className="text-right">
                    <p className="text-slate-400 text-sm mb-1">{t("tradeDetail", "returnPct")}</p>
                    <p
                      className={`text-2xl font-bold ${
                        trade.profitPercentage >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {trade.profitPercentage >= 0 ? "+" : ""}
                      {trade.profitPercentage.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Trade Details Grid */}
        <FadeIn>
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {t("tradeDetail", "tradeInfo")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-6">
              <Detail label={t("trades", "entry")} value={`$${(trade.entryPrice || 0).toFixed(2)}`} />
              <Detail
                label={t("trades", "exit")}
                value={trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "—"}
              />
              <Detail label={t("trades", "qty")} value={String(trade.quantity)} />
              <Detail
                label={t("tradeDetail", "entryDate")}
                value={new Date(trade.tradeDate).toLocaleDateString()}
              />
              <Detail
                label={t("tradeDetail", "exitDate")}
                value={trade.exitDate ? new Date(trade.exitDate).toLocaleDateString() : "—"}
              />
              {holdingDays != null && (
                <Detail label={t("tradeDetail", "holdingPeriod")} value={`${holdingDays}d`} />
              )}
            </div>
          </div>
        </FadeIn>

        {/* Journal Notes */}
        {(trade.setupDescription ||
          trade.reasonToBuy ||
          trade.reasonToSell ||
          trade.mistakes ||
          trade.lessonsLearned ||
          trade.notes) && (
          <FadeIn>
            <div className="card-base p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">
                {t("tradeDetail", "journalNotes")}
              </h2>

              {trade.setupDescription && (
                <NoteBlock
                  label={t("addTrade", "setupDescription")}
                  text={trade.setupDescription}
                />
              )}
              {trade.reasonToBuy && (
                <NoteBlock label={t("addTrade", "reasonToBuy")} text={trade.reasonToBuy} />
              )}
              {trade.reasonToSell && (
                <NoteBlock label={t("editTrade", "reasonToSell")} text={trade.reasonToSell} />
              )}
              {trade.mistakes && (
                <NoteBlock label={t("editTrade", "mistakes")} text={trade.mistakes} />
              )}
              {trade.lessonsLearned && (
                <NoteBlock label={t("editTrade", "lessonsLearned")} text={trade.lessonsLearned} />
              )}
              {trade.notes && (
                <NoteBlock label={t("editTrade", "additionalNotes")} text={trade.notes} />
              )}
            </div>
          </FadeIn>
        )}

        {/* No notes message */}
        {!trade.setupDescription &&
          !trade.reasonToBuy &&
          !trade.reasonToSell &&
          !trade.mistakes &&
          !trade.lessonsLearned &&
          !trade.notes && (
            <FadeIn>
              <div className="card-base p-6 text-center">
                <p className="text-slate-400 text-sm mb-2">{t("tradeDetail", "noNotes")}</p>
                <Link
                  href={`/edit-trade/${trade.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  {t("tradeDetail", "addNotes")}
                </Link>
              </div>
            </FadeIn>
          )}
      </div>
    </PageTransition>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white font-medium text-sm">{value}</p>
    </div>
  );
}

function NoteBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}
