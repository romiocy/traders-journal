"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";

export default function AddTradePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    symbol: "",
    type: "BUY" as const,
    quantity: "",
    entryPrice: "",
    tradeDate: new Date().toISOString().slice(0, 10),
    setupDescription: "",
    reasonToBuy: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = getCurrentUser();
      const userId = user?.id;

      const headers: any = { "Content-Type": "application/json" };
      if (userId) {
        headers["x-user-id"] = userId;
      }

      const response = await fetch("/api/trades", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          entryPrice: parseFloat(formData.entryPrice),
          tradeDate: new Date(formData.tradeDate),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create trade");
      }

      router.push("/trades");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">{t("addTrade", "title")}</h1>
        <p className="text-slate-400">{t("addTrade", "subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="card-base p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "symbol")} *
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder={t("addTrade", "symbolPlaceholder")}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "type")} *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="BUY">{t("addTrade", "buy")}</option>
                <option value="SELL">{t("addTrade", "sell")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "quantity")} *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="0.01"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "entryPrice")} *
              </label>
              <input
                type="number"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                step="0.01"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "tradeDate")} *
              </label>
              <input
                type="date"
                name="tradeDate"
                value={formData.tradeDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("addTrade", "setupDescription")}
            </label>
            <textarea
              name="setupDescription"
              value={formData.setupDescription}
              onChange={handleChange}
              placeholder={t("addTrade", "setupPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("addTrade", "reasonToBuy")}
            </label>
            <textarea
              name="reasonToBuy"
              value={formData.reasonToBuy}
              onChange={handleChange}
              placeholder={t("addTrade", "reasonPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("addTrade", "saving") : t("addTrade", "saveTrade")}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            {t("addTrade", "cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
