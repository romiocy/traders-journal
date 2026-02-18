"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Trade } from "@/types/trade";
import { getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";

export default function EditTradePage() {
  const router = useRouter();
  const params = useParams();
  const tradeId = params.id as string;
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [trade, setTrade] = useState<Trade | null>(null);
  const [formData, setFormData] = useState({
    exitPrice: "",
    exitDate: "",
    reasonToSell: "",
    mistakes: "",
    lessonsLearned: "",
    notes: "",
  });

  useEffect(() => {
    fetchTrade();
  }, [tradeId]);

  const fetchTrade = async () => {
    try {
      const user = getCurrentUser();
      const userId = user?.id;

      const headers: any = {};
      if (userId) {
        headers["x-user-id"] = userId;
      }

      const response = await fetch(`/api/trades/${tradeId}`, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch trade");
      }
      const data = await response.json();
      setTrade(data);
      setFormData({
        exitPrice: data.exitPrice ? data.exitPrice.toString() : "",
        exitDate: data.exitDate ? new Date(data.exitDate).toISOString().slice(0, 10) : "",
        reasonToSell: data.reasonToSell || "",
        mistakes: data.mistakes || "",
        lessonsLearned: data.lessonsLearned || "",
        notes: data.notes || "",
      });
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trade");
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const user = getCurrentUser();
      const userId = user?.id;

      const updateData: any = {
        ...formData,
        exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      };

      // Automatically close trade if exit price is provided
      if (formData.exitPrice && !formData.exitDate) {
        updateData.exitDate = new Date().toISOString();
      }

      if (formData.exitPrice) {
        updateData.status = "CLOSED";
      }

      const headers: any = { "Content-Type": "application/json" };
      if (userId) {
        headers["x-user-id"] = userId;
      }

      const response = await fetch(`/api/trades/${tradeId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update trade");
      }

      router.push("/trades");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t("editTrade", "loadingTrade")}</div>;
  }

  if (!trade) {
    return <div className="text-center py-12 text-red-600">{t("editTrade", "tradeNotFound")}</div>;
  }

  return (
    <PageTransition>
    <div className="max-w-2xl mx-auto px-1 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          {t("editTrade", "title")} - {trade.symbol}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">{t("editTrade", "subtitle")}</p>
      </div>

      <div className="card-base p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg font-bold text-white mb-4">{t("editTrade", "tradeDetails")}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">{t("editTrade", "entryPrice")}</p>
            <p className="font-bold text-white text-lg">${(trade.entryPrice || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400">{t("editTrade", "entryDate")}</p>
            <p className="font-bold text-white text-lg">
              {new Date(trade.tradeDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-slate-400">{t("editTrade", "type")}</p>
            <p className={`font-bold text-lg ${trade.type === "BUY" ? "text-green-400" : "text-red-400"}`}>
              {trade.type}
            </p>
          </div>
          <div>
            <p className="text-slate-400">{t("editTrade", "quantity")}</p>
            <p className="font-bold text-white text-lg">{trade.quantity}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {trade.status === "OPEN" && (
          <>
            <div className="card-base p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    {t("editTrade", "exitPrice")}
                  </label>
                  <input
                    type="number"
                    name="exitPrice"
                    value={formData.exitPrice}
                    onChange={handleChange}
                    step="0.01"
                    placeholder={t("editTrade", "exitPricePlaceholder")}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    {t("editTrade", "exitDate")}
                  </label>
                  <input
                    type="date"
                    name="exitDate"
                    value={formData.exitDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {formData.exitPrice && (
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    <strong>{t("editTrade", "profitLoss")}:</strong> $
                    {(
                      (parseFloat(formData.exitPrice) - (trade.entryPrice || 0)) *
                      trade.quantity
                    ).toFixed(2)}{" "}
                    (
                    {(
                      (((parseFloat(formData.exitPrice) - (trade.entryPrice || 0)) /
                        (trade.entryPrice || 1)) *
                        100)
                    ).toFixed(2)}
                    %)
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {trade.status === "CLOSED" && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-300">
              ✓ {t("editTrade", "tradeClosed")}
            </p>
            <p className="text-sm text-green-400 mt-1">
              {t("editTrade", "exitPrice")}: ${(trade.exitPrice || 0).toFixed(2)}
            </p>
            {trade.profit !== undefined && (
              <p className={`text-sm font-semibold mt-1 ${trade.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {t("editTrade", "profitLoss")}: ${(trade.profit || 0).toFixed(2)}
              </p>
            )}
          </div>
        )}

        <div className="card-base p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("editTrade", "reasonToSell")}
            </label>
            <textarea
              name="reasonToSell"
              value={formData.reasonToSell}
              onChange={handleChange}
              placeholder={t("editTrade", "reasonToSellPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("editTrade", "mistakes")}
            </label>
            <textarea
              name="mistakes"
              value={formData.mistakes}
              onChange={handleChange}
              placeholder={t("editTrade", "mistakesPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("editTrade", "lessonsLearned")}
            </label>
            <textarea
              name="lessonsLearned"
              value={formData.lessonsLearned}
              onChange={handleChange}
              placeholder={t("editTrade", "lessonsPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("editTrade", "additionalNotes")}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t("editTrade", "notesPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t("editTrade", "saving") : t("editTrade", "saveChanges")}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            {t("common", "cancel")}
          </button>
        </div>
      </form>
    </div>
    </PageTransition>
  );
}
